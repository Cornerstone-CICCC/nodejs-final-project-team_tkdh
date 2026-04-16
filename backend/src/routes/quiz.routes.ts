import { Router } from "express";
import quizController from "../controllers/quiz.controller";

const quizRouter = Router();

quizRouter.get("/", quizController.getAllQuestions);
quizRouter.get("/:id", quizController.getQuestionById);

export default quizRouter;
