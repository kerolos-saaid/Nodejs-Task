import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import envVariables from "../../config/envVariables.js";
import ROLES_PERMISSIONS from "../Auth/AccessControl/rolesPermissions.js";
import ROLES from "../Auth/AccessControl/roles.js";

export const createUser = async (userData) => {
  const { email, password, name, role } = userData;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, envVariables.HASH_SALT),
      role,
      permissions: ROLES_PERMISSIONS[role] || ROLES_PERMISSIONS[ROLES.USER],
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
