import prisma from "../../prisma/prisma.js";

export const createUser = async (userData) => {
  const { email, password, name } = userData;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, envVariables.HASH_SALT),
    },
  });
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return null;
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
