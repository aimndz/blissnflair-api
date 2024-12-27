/*
  Warnings:

  - You are about to drop the column `type` on the `MainDishDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MainDishDetails" DROP COLUMN "type",
ADD COLUMN     "dishType" "DishType" NOT NULL DEFAULT 'MAIN';
