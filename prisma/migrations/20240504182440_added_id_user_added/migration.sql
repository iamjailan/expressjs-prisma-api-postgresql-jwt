/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `usr` on the `Users` table. All the data in the column will be lost.
  - The required column `id` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "usr",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");
