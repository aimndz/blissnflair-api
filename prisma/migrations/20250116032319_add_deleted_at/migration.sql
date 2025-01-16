-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "deletedAt" TIMESTAMP(3);
