import { Router } from "express";
import userController from "../controllers/user.controller";
import { checkIsLoggedIn, logoutCheck } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/me", checkIsLoggedIn, userController.getMe);
userRouter.get("/:id", checkIsLoggedIn, userController.getUserById);
userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);
userRouter.get("/logout/:id", logoutCheck, userController.logout);

export default userRouter;
