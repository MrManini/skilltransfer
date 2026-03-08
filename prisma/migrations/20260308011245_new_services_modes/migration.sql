/*
  Warnings:

  - The values [SERVICIO] on the enum `ServiceMode` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `completed` on the `MentorshipStep` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "InteractionType" ADD VALUE 'NONE';

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceMode_new" AS ENUM ('HIBRIDO', 'MENTORIA', 'EJECUTADO');
ALTER TABLE "Service" ALTER COLUMN "mode" TYPE "ServiceMode_new" USING ("mode"::text::"ServiceMode_new");
ALTER TYPE "ServiceMode" RENAME TO "ServiceMode_old";
ALTER TYPE "ServiceMode_new" RENAME TO "ServiceMode";
DROP TYPE "public"."ServiceMode_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- AlterTable
ALTER TABLE "MentorshipStep" DROP COLUMN "completed";

-- DropTable
DROP TABLE "Payment";

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateTable
CREATE TABLE "MentorshipStepProgress" (
    "id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "mentorshipStepId" TEXT NOT NULL,

    CONSTRAINT "MentorshipStepProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipStepProgress_clientId_mentorshipStepId_key" ON "MentorshipStepProgress"("clientId", "mentorshipStepId");

-- AddForeignKey
ALTER TABLE "MentorshipStepProgress" ADD CONSTRAINT "MentorshipStepProgress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipStepProgress" ADD CONSTRAINT "MentorshipStepProgress_mentorshipStepId_fkey" FOREIGN KEY ("mentorshipStepId") REFERENCES "MentorshipStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
