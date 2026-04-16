import { Request, Response } from "express";
import quizModel from "../models/quiz.model";

const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await quizModel.fetchAll();
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getQuestionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const question = await quizModel.fetchOne(Number(id));
    if (!question) {
      res.status(404).json({ message: "Cannot find question" });
      return;
    }
    res.status(200).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAllQuestions,
  getQuestionById,
};
