-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('male', 'female', 'other');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" "GENDER";
