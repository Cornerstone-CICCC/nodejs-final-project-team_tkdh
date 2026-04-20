import { Server, Socket } from 'socket.io';
import {
  addUser,
  getUsersInRoom,
  removeUser,
  assingTeamToUser,
  getUserTeam,
} from './user.manager';
import { assingTeams, fetchRandomQuizzes } from '../services/quiz.service';

type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
};

type Quiz = {
  id: number;
  question: string;
  options: string[];
};

const buildSystemMessage = (text: string): ChatMessage => ({
  id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  userId: 'system',
  userName: 'System',
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

let quizzes: Quiz[] = [];
let correctAnswer: string[] = [];
let currentQuestionIndex = 0;
let emitQuestion: (index: number) => void = () => {};
let scores: Record<string, number> = { team1: 0, team2: 0 };
let answers: Record<string, string> = {};

export const handleSocketEvents = (io: Server, socket: Socket) => {
  const { userId, userName } = socket.data;
  const authUserId = String(userId);
  let currentRoom: string | null = null;

  socket.on('room:join', (data: { room: string }) => {
    if (!data?.room) return;

    currentRoom = data.room;
    socket.join(data.room);
    addUser(data.room, socket.id, userName);

    io.to(data.room).emit(
      'chat:message',
      buildSystemMessage(`${userName} has joined ${data.room}.`),
    );
    io.to(data.room).emit('room:users', { users: getUsersInRoom(data.room) });
  });

  socket.on('room:leave', (data: { room: string }) => {
    if (!data?.room) return;
    socket.leave(data.room);
    removeUser(data.room, socket.id);
    if (currentRoom === data.room) currentRoom = null;

    io.to(data.room).emit(
      'chat:message',
      buildSystemMessage(`${userName} has left ${data.room}.`),
    );
    io.to(data.room).emit('room:users', { users: getUsersInRoom(data.room) });
  });

  socket.on('chat:send', (data: { text: string }) => {
    if (!currentRoom || !data?.text) return;
    const teamId = getUserTeam(currentRoom, socket.id);
    const target = teamId ?? currentRoom;
    io.to(target).emit(
      'chat:message',
      buildUserMessage(authUserId, userName, data.text),
    );
  });

  socket.on('game:start', async () => {
    if (!currentRoom) return;

    const users = getUsersInRoom(currentRoom);
    if (users.length < 2) {
      socket.emit('game:error', {
        message: 'Need at least 2 players to start the game.',
      });
      return;
    }

    const socketIds = users.map((u) => u.id);
    const teams = assingTeams(socketIds);

    teams.team1.forEach((socketId) => {
      assingTeamToUser(currentRoom!, socketId, 'team1');
      io.sockets.sockets.get(socketId)?.join('team1');
    });
    teams.team2.forEach((socketId) => {
      assingTeamToUser(currentRoom!, socketId, 'team2');
      io.sockets.sockets.get(socketId)?.join('team2');
    });

    io.to('team1').emit('game:teams', { team: 'team1', members: teams.team1 });
    io.to('team2').emit('game:teams', { team: 'team2', members: teams.team2 });

    const { fiveQuizzesWithoutAnswer, fiveAnswers } =
      await fetchRandomQuizzes();
    quizzes = fiveQuizzesWithoutAnswer;
    correctAnswer = fiveAnswers;
    currentQuestionIndex = 0;
    scores = { team1: 0, team2: 0 };
    answers = {};

    emitQuestion = (index: number) => {
      if (index >= 5) {
        io.to(currentRoom!).emit('game:end', { scores });
        return;
      }
      answers = {};

      io.to(currentRoom!).emit('game:question', {
        question: quizzes[index],
        index,
        total: 5,
      });

      setTimeout(() => {
        if (currentQuestionIndex === index) {
          const correct = correctAnswer[index];

          if (answers.team1 === correct) scores.team1++;
          if (answers.team2 === correct) scores.team2++;

          io.to(currentRoom!).emit('game:result', {
            correctAnswer: correct,
          });
          currentQuestionIndex++;
          emitQuestion(currentQuestionIndex);
        }
      }, 30000);
    };

    setTimeout(() => emitQuestion(0), 10000);
  });

  socket.on('game:answer', (data: { team: string; answer: string }) => {
    if (!data?.team || !data.answer) return;

    if (answers[data.team]) return;
    answers[data.team] = data.answer;

    io.to(data.team).emit('team:answer-selected', { answer: data.answer });

    if (Object.keys(answers).length === 2) {
      const correct = correctAnswer[currentQuestionIndex];

      if (answers.team1 === correct) scores.team1++;
      if (answers.team2 === correct) scores.team2++;

      io.to(currentRoom!).emit('game:result', {
        correctAnswer: correct,
      });

      currentQuestionIndex++;
      emitQuestion(currentQuestionIndex);
    }
  });

  socket.on('disconnect', () => {
    if (!currentRoom) return;
    removeUser(currentRoom, socket.id);
    io.to(currentRoom).emit(
      'chat:message',
      buildSystemMessage(`${userName} has left ${currentRoom}.`),
    );
    io.to(currentRoom).emit('room:users', {
      users: getUsersInRoom(currentRoom),
    });
    currentRoom = null;
  });
};
