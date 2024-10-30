/*
  Warnings:

  - Added the required column `expectedPax` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "additionalNotes" TEXT,
ADD COLUMN     "additionalServices" TEXT[],
ADD COLUMN     "expectedPax" INTEGER NOT NULL DEFAULT 0;
