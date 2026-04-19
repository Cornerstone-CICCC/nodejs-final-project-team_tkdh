export type User = {
  id: string;
  name: string;
  teamId: string | null;
};

export type Quiz = {
  id: number;
  question: string;
  options: string[];
};

export type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
};

export type TeamId = "team1" | "team2";

export type Scores = Record<TeamId, number>;

export type TeamMembers = Record<TeamId, string[]>;

export type GamePhase = "waiting" | "starting" | "question" | "result" | "finished";

export type GameState = {
  currentQuestion: Quiz | null;
  questionIndex: number;
  totalQuestions: number;
  teams: TeamMembers;
  myTeam: TeamId | null;
  scores: Scores;
  correctAnswer: string | null;
  teamAnswer: string | null;
  phase: GamePhase;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};
