import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import quizRouter from "./routes/quiz.routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use("/users", userRouter);
app.use("/quizzes", quizRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send("Invalid route.");
});

const PORT = process.env.BACKEND_PORT;
if (!PORT) {
  throw new Error("Missing backend port!");
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
