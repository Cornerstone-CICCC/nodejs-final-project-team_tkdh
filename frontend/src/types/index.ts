export type User = {
  id: string;
  name: string;
  teamId: string | null;
};

export type Team = {
  id: string;
  name: string;
  members: User[];
  score: number;
};

export type Quiz = {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
};

export type GamePhase = "waiting" | "question" | "result" | "finished";

export type GameState = {
  currentQuestion: Quiz | null;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  teams: Team[];
  phase: GamePhase;
};
