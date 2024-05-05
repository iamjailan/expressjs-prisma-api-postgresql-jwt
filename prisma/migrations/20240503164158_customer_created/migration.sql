-- CreateEnum
CREATE TYPE "SEX" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "sex" "SEX" NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);
