/*
  Warnings:

  - You are about to drop the column `images` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "images";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "image";
