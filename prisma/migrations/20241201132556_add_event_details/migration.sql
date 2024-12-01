/*
  Warnings:

  - Added the required column `additionalHours` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasCleaningFee` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasInHouseCatering` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "additionalHours" INTEGER NOT NULL,
ADD COLUMN     "hasCleaningFee" BOOLEAN NOT NULL,
ADD COLUMN     "hasInHouseCatering" BOOLEAN NOT NULL,
ADD COLUMN     "venue" TEXT NOT NULL,
ALTER COLUMN "expectedPax" DROP DEFAULT;
