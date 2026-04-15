import { Request, Response } from 'express';
import userModel from '../models/user.model';

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

const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await userModel.edit(Number(id), {
      name,
      email,
    });
    if (!updatedUser) {
      res.status(404).json({ message: 'Unable to find user' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUserByID = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await userModel.remove(Number(id));
    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(deletedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getAllUsers,
  getUserById,
  addUser,
  updateUserById,
  deleteUserByID,
};
