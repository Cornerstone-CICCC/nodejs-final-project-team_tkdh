import { Server, Socket } from 'socket.io';
import {
  addUser,
  getUsername,
  getUsersInRoom,
  removeUser,
} from './user.manager';

export const handleSocketEvents = (io: Server, socket: Socket) => {
  let currentRoom: string | null = null;

  socket.on('joinRoom', (data) => {
    currentRoom = data.room;
    socket.join(data.room);
    addUser(data.room, socket.id, data.username);

    socket.emit('chatRoom', {
      username: 'System',
      message: `Welcome to ${data.room}, ${data.username}!`,
    });

    socket.broadcast.to(data.room).emit('chatRoom', {
      username: 'System',
      message: `${data.username} has join ${data.room}.`,
    });

    io.to(data.room).emit('updateRoomUsers', getUsersInRoom(data.room));
  });

  socket.on('leaveRoom', (data) => {
    socket.leave(data.room);
    const username = getUsername(data.room, socket.id);
    removeUser(data.room, socket.id);
    if (username) {
      socket.to(data.room).emit('chatRoom', {
        username: 'System',
        message: `${username} has left ${data.room}.`,
      });
      io.to(data.room).emit('updateRoomUsers', getUsersInRoom(data.room));
    }
  });

  socket.on('chatRoom', (data) => {
    const username = getUsername(data.room, socket.id) || 'Unknown';
    io.to(data.room).emit('chatRoom', {
      username,
      message: data.message,
    });
  });

  socket.on('disconnect', () => {
    if (currentRoom) {
      const username = getUsername(currentRoom, socket.id);
      removeUser(currentRoom, socket.id);
      if (username) {
        socket.to(currentRoom).emit('chatRoom', {
          username: 'System',
          message: `${username} has left ${currentRoom}.`,
        });
        io.to(currentRoom).emit('updateRoomUsers', getUsersInRoom(currentRoom));
      }
    }
  });
};
