/*
  Warnings:

  - You are about to drop the column `hasInHouseCatering` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "hasInHouseCatering",
ADD COLUMN     "cateringId" TEXT;

-- CreateTable
CREATE TABLE "CateringSelection" (
    "id" TEXT NOT NULL,
    "expectedPax" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "numberOfMainDishes" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,

    CONSTRAINT "CateringSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainDishPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numOfDishesCategory" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "minPax" INTEGER NOT NULL,
    "maxPax" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MainDishPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CateringMainDish" (
    "id" TEXT NOT NULL,
    "cateringSelectionId" TEXT NOT NULL,
    "mainDishDetailId" TEXT NOT NULL,

    CONSTRAINT "CateringMainDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CateringSnackCorner" (
    "id" TEXT NOT NULL,
    "cateringSelectionId" TEXT NOT NULL,
    "pickASnackCornerId" TEXT NOT NULL,

    CONSTRAINT "CateringSnackCorner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CateringAddOn" (
    "id" TEXT NOT NULL,
    "cateringSelectionId" TEXT NOT NULL,
    "addOnDetailId" TEXT NOT NULL,

    CONSTRAINT "CateringAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagesDetails" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagesDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InclusionsDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InclusionsDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainDishDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MainDishDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickASnackCornerDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PickASnackCornerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CateringAddOnsDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "paxCapacity" INTEGER,
    "serviceHours" INTEGER,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CateringAddOnsDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CateringSelection_eventId_key" ON "CateringSelection"("eventId");

-- AddForeignKey
ALTER TABLE "CateringSelection" ADD CONSTRAINT "CateringSelection_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "MainDishPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateringSelection" ADD CONSTRAINT "CateringSelection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateringMainDish" ADD CONSTRAINT "CateringMainDish_cateringSelectionId_fkey" FOREIGN KEY ("cateringSelectionId") REFERENCES "CateringSelection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateringMainDish" ADD CONSTRAINT "CateringMainDish_mainDishDetailId_fkey" FOREIGN KEY ("mainDishDetailId") REFERENCES "MainDishDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateringSnackCorner" ADD CONSTRAINT "CateringSnackCorner_cateringSelectionId_fkey" FOREIGN KEY ("cateringSelectionId") REFERENCES "CateringSelection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateringSnackCorner" ADD CONSTRAINT "CateringSnackCorner_pickASnackCornerId_fkey" FOREIGN KEY ("pickASnackCornerId") REFERENCES "PickASnackCornerDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateringAddOn" ADD CONSTRAINT "CateringAddOn_cateringSelectionId_fkey" FOREIGN KEY ("cateringSelectionId") REFERENCES "CateringSelection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateringAddOn" ADD CONSTRAINT "CateringAddOn_addOnDetailId_fkey" FOREIGN KEY ("addOnDetailId") REFERENCES "CateringAddOnsDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
