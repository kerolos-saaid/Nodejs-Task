import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import envVariables from "../../config/envVariables.js";
import ROLES_PERMISSIONS from "../Auth/AccessControl/rolesPermissions.js";
import ROLES from "../Auth/AccessControl/roles.js";

export const createUser = async (userData, role) => {
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
