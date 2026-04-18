import type { Socket } from "socket.io";
import * as cookie from "cookie";
import userModel from "../models/user.model";

export type SocketAuth = {
  userId: number;
  userName: string;
};

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const rawCookie = socket.handshake.headers.cookie;
  if (!rawCookie) return next(new Error("unauthorized"));

  const parsed = cookie.parse(rawCookie);
  const userId = Number(parsed.userId);
  const userEmail = parsed.userEmail;
  if (!userId || !userEmail) return next(new Error("unauthorized"));

  try {
    const user = await userModel.fetchOne(userId);
    if (!user || user.email !== userEmail) {
      return next(new Error("unauthorized"));
    }
    socket.data.userId = user.id;
    socket.data.userName = user.name;
    next();
  } catch (error) {
    console.error("Socket auth error:", error);
    next(new Error("unauthorized"));
  }
};
