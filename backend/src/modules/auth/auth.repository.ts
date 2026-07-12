import { prisma } from '../../config/db';
import { SignupInput } from './auth.types';

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = (input: SignupInput & { password: string }) => {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: input.password,
    },
  });
};
