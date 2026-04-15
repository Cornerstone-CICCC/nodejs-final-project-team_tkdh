import { Router } from 'express';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.post('/', userController.addUser);
userRouter.put('/:id', userController.updateUserById);
userRouter.delete('/:id', userController.deleteUserByID);

export default userRouter;
