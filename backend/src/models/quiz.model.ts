import { prisma } from "../lib/prisma";

const fetchAll = async () => {
  return await prisma.quizzes.findMany();
};

const fetchOne = async (id: number) => {
  return await prisma.quizzes.findUnique({
    where: { id },
  });
};

export default {
  fetchAll,
  fetchOne,
};
