import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";

// check if user logged in or not
export const checkIsLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, userEmail } = req.cookies;
  if (!userId || !userEmail) {
    res.status(401).send("Your are not logged in");
    return;
  }
  const target = await userModel.fetchOne(Number(userId));
  const loginJudge = target?.email === userEmail;
  if (!loginJudge) {
    res.status(401).send("Your are not logged in");
    return;
  }
  next();
};

// allow a logged-in user to logout ONLY their account
export const logoutCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { userId } = req.cookies;

  const logoutJudge = userId === id;
  if (!logoutJudge) {
    res.status(400).json({ message: "Logout failed" });
    return;
  }

  next();
};
