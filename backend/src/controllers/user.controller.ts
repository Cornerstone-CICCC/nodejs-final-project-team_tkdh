import { Request, Response } from "express";
import userModel from "../models/user.model";
import { User } from "../types/user.type";
import zxcvbn from "zxcvbn";

const register = async (
  req: Request<{}, {}, Omit<User, "id">>,
  res: Response,
) => {
  const { name, email, password } = req.body;
  if (!name.trim() || !email.trim() || !password.trim()) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const passwordScore = zxcvbn(password).score;
  if (passwordScore <= 2) {
    res.status(400).json({
      error: "Password is too weak. Try a longer or more complex password.",
    });
    return;
  }

  try {
    const newUser = await userModel.add({ name, email, password });
    if (!newUser) {
      res.status(409).json({ error: "Email is already registered." });
      return;
    }
    res.cookie("userId", newUser.id, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("userEmail", newUser.email, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    const userWithoutPass = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
    res.status(201).json(userWithoutPass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (
  req: Request<{ id: number }, {}, { email: string; password: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    res.status(401).json({ error: "Email and password are required." });
    return;
  }

  try {
    const loginUser = await userModel.login(email, password);
    if (!loginUser) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    res.cookie("userId", loginUser.id, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("userEmail", loginUser.email, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({
      id: loginUser.id,
      name: loginUser.name,
      email: loginUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const logoutUser = await userModel.fetchOne(Number(id));
    if (!logoutUser) {
      res.status(400).json({ message: "Login user is not found" });
      return;
    }
    res.clearCookie("userId");
    res.clearCookie("userEmail");
    res
      .status(200)
      .json({ message: `${logoutUser.name} is successfully logged out` });
  } catch (error) {}
};

const getMe = async (req: Request, res: Response) => {
  const { userId } = req.cookies;
  try {
    const user = await userModel.fetchOne(Number(userId));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.fetchAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userModel.fetchOne(Number(id));
    if (!user) {
      res.status(404).json({ message: "Cannot find user" });
      return;
    }
    const userWithoutPass = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    res.status(200).json(userWithoutPass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  register,
  login,
  getAllUsers,
  getUserById,
  getMe,
  logout,
};
