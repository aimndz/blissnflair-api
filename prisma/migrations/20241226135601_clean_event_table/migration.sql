/*
  Warnings:

  - You are about to drop the column `additionalServices` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `expectedPax` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "additionalServices",
DROP COLUMN "expectedPax";
