import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import quizRouter from "./routes/quiz.routes";
import cors from "cors";
import { socketHandler } from "./quiz-rooms/conecction.manager";
import { authenticateSocket } from "./quiz-rooms/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use("/users", userRouter);
app.use("/quizzes", quizRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send("Invalid route.");
});

const httpServer = createServer(app);

const io = new IOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

io.use(authenticateSocket);
socketHandler(io);

const PORT = process.env.BACKEND_PORT;
if (!PORT) {
  throw new Error("Missing backend port!");
}
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
