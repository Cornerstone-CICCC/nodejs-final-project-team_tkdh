export type RoomUser = {
  id: string;
  name: string;
  teamId: string | null;
};

const usersInRoom: Record<string, Record<string, RoomUser>> = {};

export const addUser = (room: string, socketId: string, username: string) => {
  if (!usersInRoom[room]) {
    usersInRoom[room] = {};
  }

  usersInRoom[room][socketId] = {
    id: socketId,
    name: username,
    teamId: null,
  };
};

export const removeUser = (room: string, socketId: string) => {
  const roomUsers = usersInRoom[room];
  if (!roomUsers) return;

  delete roomUsers[socketId];

  if (Object.keys(roomUsers).length === 0) {
    delete usersInRoom[room];
  }
};

export const getUsersInRoom = (room: string): RoomUser[] => {
  const roomUsers = usersInRoom[room];
  return roomUsers ? Object.values(roomUsers) : [];
};

export const getUsername = (
  room: string,
  socketId: string,
): string | undefined => {
  return usersInRoom[room]?.[socketId]?.name;
};

export const assingTeamToUser = (
  room: string,
  socketId: string,
  teamId: string,
) => {
  if (usersInRoom[room]?.[socketId]) {
    usersInRoom[room][socketId].teamId = teamId;
  }
};

export const getUserTeam = (
  room: string,
  socketId: string,
): string | null => {
  return usersInRoom[room]?.[socketId]?.teamId ?? null;
};
