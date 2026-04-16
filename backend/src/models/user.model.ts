import { Users } from "../../prisma/generated/prisma/client";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

const add = async (registerData: Omit<Users, "id">) => {
  const hashedPassword = await bcrypt.hash(registerData.password, 12);
  const data = {
    name: registerData.name,
    email: registerData.email,
    password: hashedPassword,
  };
  return await prisma.users.create({ data });
};

const fetchOne = async (id: number) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

const fetchAll = async () => {
  return await prisma.users.findMany();
};

const login = async (email: string, password: string) => {
  const users = await fetchAll();
  const targetUser = users.find((user) => user.email === email);
  if (!targetUser) {
    return null;
  }
  const passwordJudge = await bcrypt.compare(password, targetUser.password);
  if (!passwordJudge) {
    return null;
  }
  return targetUser;
};

export default {
  fetchAll,
  fetchOne,
  add,
  login,
};
