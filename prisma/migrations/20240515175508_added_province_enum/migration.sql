/*
  Warnings:

  - The `city` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProvinceEnum" AS ENUM ('badakhshan', 'badghis', 'baghlan', 'balkh', 'bamyan', 'daykundi', 'farah', 'faryab', 'ghazn', 'ghor', 'helmand', 'herat', 'jowzjan', 'kabul', 'kandahar', 'kapisa', 'khost', 'kunar', 'kunduz', 'laghman', 'logar', 'nangarhar', 'nimroz', 'nuristan', 'panjshir', 'parwan', 'paktia', 'paktika', 'samangan', 'sar_e_pol', 'takhar', 'uruzgan', 'wardak', 'zabul');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "city",
ADD COLUMN     "city" "ProvinceEnum";
