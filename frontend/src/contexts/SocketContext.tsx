import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { socket } from "../socket";
import type { GameState, Message, Quiz, Scores, TeamId, User } from "../types";
import { SocketContext } from "./socket-context";

const initialGameState: GameState = {
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 5,
  teams: { team1: [], team2: [] },
  myTeam: null,
  scores: { team1: 0, team2: 0 },
  correctAnswer: null,
  teamAnswer: null,
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

export function SocketProvider({ children }: { children: ReactNode }) {
  const isConnected = useSyncExternalStore(
    subscribeConnection,
    getConnectionSnapshot,
  );
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const onRoomUsers = (data: { users: User[] }) => setUsers(data.users);

    const onChatMessage = (message: Message) =>
      setMessages((prev) => [...prev, message]);

    const onGameTeams = (data: { team: TeamId; members: string[] }) => {
      setGameState((prev) => {
        const isMyTeam = data.members.includes(socket.id ?? "");
        return {
          ...prev,
          teams: { ...prev.teams, [data.team]: data.members },
          myTeam: isMyTeam ? data.team : prev.myTeam,
          phase: "starting",
        };
      });
      setMessages([]);
    };

    const onGameQuestion = (data: {
      question: Quiz;
      index: number;
      total: number;
    }) => {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: data.question,
        questionIndex: data.index,
        totalQuestions: data.total,
        correctAnswer: null,
        teamAnswer: null,
        phase: "question",
      }));
    };

    const onTeamAnswerSelected = (data: { answer: string }) => {
      setGameState((prev) => ({ ...prev, teamAnswer: data.answer }));
    };

    const onGameResult = (data: { correctAnswer: string }) => {
      setGameState((prev) => ({
        ...prev,
        correctAnswer: data.correctAnswer,
        phase: "result",
      }));
    };

    const onGameEnd = (data: { scores: Scores }) => {
      setGameState((prev) => ({
        ...prev,
        scores: data.scores,
        phase: "finished",
      }));
    };

    const onGameError = (data: { message: string }) => {
      setErrorMessage(data.message);
    };

    socket.on("room:users", onRoomUsers);
    socket.on("chat:message", onChatMessage);
    socket.on("game:teams", onGameTeams);
    socket.on("game:question", onGameQuestion);
    socket.on("game:result", onGameResult);
    socket.on("game:end", onGameEnd);
    socket.on("game:error", onGameError);
    socket.on("team:answer-selected", onTeamAnswerSelected);

    return () => {
      socket.off("room:users", onRoomUsers);
      socket.off("chat:message", onChatMessage);
      socket.off("game:teams", onGameTeams);
      socket.off("game:question", onGameQuestion);
      socket.off("game:result", onGameResult);
      socket.off("game:end", onGameEnd);
      socket.off("game:error", onGameError);
      socket.off("team:answer-selected", onTeamAnswerSelected);
    };
  }, []);

  const connect = useCallback(() => {
    if (!socket.connected) socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  const joinRoom = useCallback((room: string) => {
    socket.emit("room:join", { room });
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socket.emit("room:leave", { room });
  }, []);

  const sendMessage = useCallback((text: string) => {
    socket.emit("chat:send", { text });
  }, []);

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!gameState.myTeam) return;
      socket.emit("game:answer", { team: gameState.myTeam, answer });
    },
    [gameState.myTeam],
  );

  const startGame = useCallback(() => {
    socket.emit("game:start");
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setMessages([]);
    setErrorMessage(null);
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        gameState,
        messages,
        users,
        errorMessage,
        connect,
        disconnect,
        joinRoom,
        leaveRoom,
        sendMessage,
        submitAnswer,
        startGame,
        resetGame,
        clearError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
