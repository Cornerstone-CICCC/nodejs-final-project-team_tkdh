import type { Team, Quiz, Message } from "./types";

export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Team Alpha",
    members: [
      { id: "u1", name: "Alice", teamId: "team-1" },
      { id: "u2", name: "Bob", teamId: "team-1" },
      { id: "u3", name: "Charlie", teamId: "team-1" },
    ],
    score: 3,
  },
  {
    id: "team-2",
    name: "Team Beta",
    members: [
      { id: "u4", name: "Dave", teamId: "team-2" },
      { id: "u5", name: "Eve", teamId: "team-2" },
      { id: "u6", name: "Frank", teamId: "team-2" },
    ],
    score: 2,
  },
  {
    id: "team-3",
    name: "Team Gamma",
    members: [
      { id: "u7", name: "Grace", teamId: "team-3" },
      { id: "u8", name: "Hank", teamId: "team-3" },
      { id: "u9", name: "Ivy", teamId: "team-3" },
    ],
    score: 1,
  },
];

export const mockQuiz: Quiz = {
  id: "q1",
  question: "What is the capital of France?",
  options: ["London", "Berlin", "Paris", "Madrid"],
  correctIndex: 2,
};

export const mockMessages: Message[] = [
  { id: "m1", userId: "u1", userName: "Alice", text: "I think it's Paris!", timestamp: Date.now() - 5000 },
  { id: "m2", userId: "u2", userName: "Bob", text: "Yeah, definitely Paris", timestamp: Date.now() - 3000 },
  { id: "m3", userId: "u3", userName: "Charlie", text: "Agreed, let's go with C", timestamp: Date.now() },
];
