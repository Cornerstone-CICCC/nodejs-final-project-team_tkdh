import { useEffect, useState, useSyncExternalStore } from "react";
import { socket } from "../socket";
import type { GameState, Message, User } from "../types";

const initialGameState: GameState = {
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 5,
  timeLeft: 30,
  teams: [],
  phase: "waiting",
};

const subscribeConnection = (onStoreChange: () => void) => {
  socket.on("connect", onStoreChange);
  socket.on("disconnect", onStoreChange);
  return () => {
    socket.off("connect", onStoreChange);
    socket.off("disconnect", onStoreChange);
  };
};

const getConnectionSnapshot = () => socket.connected;

export function useSocket() {
  const isConnected = useSyncExternalStore(
    subscribeConnection,
    getConnectionSnapshot,
  );
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    const onRoomUsers = (data: { users: User[] }) => setUsers(data.users);
    const onChatMessage = (message: Message) =>
      setMessages((prev) => [...prev, message]);
    const onGameStart = (data: {
      teamId: string;
      teams: GameState["teams"];
    }) => {
      setTeamId(data.teamId);
      setGameState((prev) => ({ ...prev, teams: data.teams, phase: "waiting" }));
    };
    const onGameQuestion = (data: {
      question: GameState["currentQuestion"];
      index: number;
    }) => {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: data.question,
        questionIndex: data.index,
        phase: "question",
        timeLeft: 30,
      }));
    };
    const onGameTimer = (timeLeft: number) =>
      setGameState((prev) => ({ ...prev, timeLeft }));
    const onGameResult = (teams: GameState["teams"]) =>
      setGameState((prev) => ({ ...prev, teams, phase: "result" }));
    const onGameEnd = (teams: GameState["teams"]) =>
      setGameState((prev) => ({ ...prev, teams, phase: "finished" }));

    socket.on("room:users", onRoomUsers);
    socket.on("chat:message", onChatMessage);
    socket.on("game:start", onGameStart);
    socket.on("game:question", onGameQuestion);
    socket.on("game:timer", onGameTimer);
    socket.on("game:result", onGameResult);
    socket.on("game:end", onGameEnd);

    return () => {
      socket.off("room:users", onRoomUsers);
      socket.off("chat:message", onChatMessage);
      socket.off("game:start", onGameStart);
      socket.off("game:question", onGameQuestion);
      socket.off("game:timer", onGameTimer);
      socket.off("game:result", onGameResult);
      socket.off("game:end", onGameEnd);
    };
  }, []);

  const connect = () => {
    if (!socket.connected) socket.connect();
  };
  const disconnect = () => socket.disconnect();

  const joinRoom = (room: string) => {
    socket.emit("room:join", { room });
  };

  const leaveRoom = (room: string) => {
    socket.emit("room:leave", { room });
  };

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
    users,
    teamId,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    submitAnswer,
  };
}
