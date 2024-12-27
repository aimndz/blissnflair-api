-- CreateEnum
CREATE TYPE "DishType" AS ENUM ('MAIN', 'OTHERS');

-- AlterTable
ALTER TABLE "MainDishDetails" ADD COLUMN     "type" "DishType" NOT NULL DEFAULT 'MAIN';
