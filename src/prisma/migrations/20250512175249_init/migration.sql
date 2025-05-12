-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('READ_OWN_POST', 'READ_PUBLIC_POST', 'READ_ANY_POST', 'UPDATE_OWN_POST', 'UPDATE_ANY_POST', 'DELETE_OWN_POST', 'DELETE_ANY_POST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "Permission"[] DEFAULT ARRAY[]::"Permission"[],
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
