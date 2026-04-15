import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { User } from '../types/user.type';
import zxcvbn from 'zxcvbn';

const register = async (
  req: Request<{}, {}, Omit<User, 'id'>>,
  res: Response,
) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const passwordScore = zxcvbn(password).score;
  if (passwordScore <= 2) {
    res.status(400).json({
      error: 'Password is too weak. Try a longer or more complex password.',
    });
    return;
  }

  const newUser = await userModel.add(name, email, password);
  if (!newUser) {
    res.status(409).json({ error: 'Email is already registered.' });
    return;
  }

  res.cookie('userId', newUser.id, { maxAge: 60 * 60 * 1000, httpOnly: true });
  res.cookie('username', newUser.name, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  });

  res
    .status(201)
    .json({ id: newUser.id, name: newUser.name, email: newUser.email });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    res.status(401).json({ error: 'Email and password are required.' });
    return;
  }

  const user = await userModel.login(email, password);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  res.cookie('userId', user.id, { maxAge: 60 * 60 * 1000, httpOnly: true });
  res.cookie('username', user.name, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.fetchAll();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userModel.fetchOne(Number(id));
    if (!user) {
      res.status(404).json({ message: 'Cannot find user' });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const newUser = await userModel.add({
      name,
      email,
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export default {
  getAllUsers,
  getUserById,
  addUser,
};
