const usersInRoom: Record<string, Record<string, string>> = {};

export const addUser = (room: string, socketId: string, username: string) => {
  if (!usersInRoom[room]) {
    usersInRoom[room] = {};
  }

  usersInRoom[room][socketId] = username;
};

export const removeUser = (room: string, socketId: string) => {
  const roomUsers = usersInRoom[room];
  if (!roomUsers) return;

  delete roomUsers[socketId];

  if (Object.keys(roomUsers).length === 0) {
    delete usersInRoom[room];
  }
};

export const getUsersInRoom = (room: string) => {
  const roomUsers = usersInRoom[room];
  return roomUsers ? Object.values(roomUsers) : [];
};

export const getUsername = (room: string, socketId: string) => {
  return usersInRoom[room]?.[socketId];
};
