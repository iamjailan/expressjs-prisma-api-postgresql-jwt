/*
  Warnings:

  - You are about to drop the column `sex` on the `Customers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('male', 'female', 'other');

-- AlterTable
ALTER TABLE "Customers" DROP COLUMN "sex",
ADD COLUMN     "gender" "GENDER" NOT NULL DEFAULT 'other';

-- DropEnum
DROP TYPE "SEX";
