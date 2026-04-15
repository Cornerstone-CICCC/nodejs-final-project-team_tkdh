import { prisma } from '../lib/prisma';

const fetchAll = async () => {
  return await prisma.user.findMany();
};

const fetchOne = async (id: number) => {
  return await prisma.user.findUnique();
};

const add = async (data: Omit<User, 'id'>) => {
  return await prisma.user.create({ data });
};

const edit = async (id: number, data: Partial<User>) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

const remove = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

export default {
  fetchAll,
  fetchOne,
  add,
  edit,
  remove,
};
