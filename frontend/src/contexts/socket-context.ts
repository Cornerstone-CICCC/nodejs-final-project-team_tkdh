import { createContext, useContext } from "react";
import type { GameState, Message, User } from "../types";

export type SocketContextValue = {
  isConnected: boolean;
  gameState: GameState;
  messages: Message[];
  users: User[];
  errorMessage: string | null;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  sendMessage: (text: string) => void;
  submitAnswer: (answer: string) => void;
  startGame: () => void;
  resetGame: () => void;
  clearError: () => void;
};

export const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
