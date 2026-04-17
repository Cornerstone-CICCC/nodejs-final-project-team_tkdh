import { Server, Socket } from "socket.io";
import {
  addUser,
  getUsersInRoom,
  removeUser,
} from "./user.manager";

type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
};

const buildSystemMessage = (text: string): ChatMessage => ({
  id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  userId: "system",
  userName: "System",
  text,
  timestamp: Date.now(),
});

const buildUserMessage = (
  userId: string,
  userName: string,
  text: string,
): ChatMessage => ({
  id: `${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  userId,
  userName,
  text,
  timestamp: Date.now(),
});

export const handleSocketEvents = (io: Server, socket: Socket) => {
  const { userId, userName } = socket.data;
  const authUserId = String(userId);
  let currentRoom: string | null = null;

  socket.on("room:join", (data: { room: string }) => {
    if (!data?.room) return;

    currentRoom = data.room;
    socket.join(data.room);
    addUser(data.room, authUserId, userName);

    io.to(data.room).emit(
      "chat:message",
      buildSystemMessage(`${userName} has joined ${data.room}.`),
    );
    io.to(data.room).emit("room:users", { users: getUsersInRoom(data.room) });
  });

  socket.on("room:leave", (data: { room: string }) => {
    if (!data?.room) return;
    socket.leave(data.room);
    removeUser(data.room, authUserId);
    if (currentRoom === data.room) currentRoom = null;

    io.to(data.room).emit(
      "chat:message",
      buildSystemMessage(`${userName} has left ${data.room}.`),
    );
    io.to(data.room).emit("room:users", { users: getUsersInRoom(data.room) });
  });

  socket.on("chat:send", (data: { text: string }) => {
    if (!currentRoom || !data?.text) return;
    io.to(currentRoom).emit(
      "chat:message",
      buildUserMessage(authUserId, userName, data.text),
    );
  });

  socket.on("disconnect", () => {
    if (!currentRoom) return;
    removeUser(currentRoom, authUserId);
    io.to(currentRoom).emit(
      "chat:message",
      buildSystemMessage(`${userName} has left ${currentRoom}.`),
    );
    io.to(currentRoom).emit("room:users", {
      users: getUsersInRoom(currentRoom),
    });
    currentRoom = null;
  });
};
