import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { GameState, Message } from "../types";

const initialGameState: GameState = {
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 5,
  timeLeft: 30,
  teams: [],
  phase: "waiting",
};

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("game:start", (data: { teamId: string; teams: GameState["teams"] }) => {
      setTeamId(data.teamId);
      setGameState((prev) => ({ ...prev, teams: data.teams, phase: "waiting" }));
    });

    socket.on("game:question", (data: { question: GameState["currentQuestion"]; index: number }) => {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: data.question,
        questionIndex: data.index,
        phase: "question",
        timeLeft: 30,
      }));
    });

    socket.on("game:timer", (timeLeft: number) => {
      setGameState((prev) => ({ ...prev, timeLeft }));
    });

    socket.on("game:result", (teams: GameState["teams"]) => {
      setGameState((prev) => ({ ...prev, teams, phase: "result" }));
    });

    socket.on("game:end", (teams: GameState["teams"]) => {
      setGameState((prev) => ({ ...prev, teams, phase: "finished" }));
    });

    socket.on("chat:message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("game:start");
      socket.off("game:question");
      socket.off("game:timer");
      socket.off("game:result");
      socket.off("game:end");
      socket.off("chat:message");
    };
  }, []);

  const connect = () => socket.connect();
  const disconnect = () => socket.disconnect();

  const sendMessage = (text: string) => {
    socket.emit("chat:send", { text });
  };

  const submitAnswer = (optionIndex: number) => {
    socket.emit("team:answer", { optionIndex });
  };

  return {
    isConnected,
    gameState,
    messages,
    teamId,
    connect,
    disconnect,
    sendMessage,
    submitAnswer,
  };
}
