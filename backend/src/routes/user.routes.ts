import { Router } from "express";
import userController from "../controllers/user.controller";
import { checkIsLoggedIn, logoutCheck } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
// middleware
userRouter.get("/:id", userController.getUserById);
userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);
// middleware
userRouter.get("/logout/:id", userController.logout);

export default userRouter;
