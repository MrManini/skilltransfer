/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,mentorshipStepId]` on the table `MentorshipStepProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `MentorshipStepProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MentorshipStepProgress_clientId_mentorshipStepId_key";

-- AlterTable
ALTER TABLE "MentorshipStepProgress" ADD COLUMN     "bookingId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipStepProgress_bookingId_mentorshipStepId_key" ON "MentorshipStepProgress"("bookingId", "mentorshipStepId");

-- AddForeignKey
ALTER TABLE "MentorshipStepProgress" ADD CONSTRAINT "MentorshipStepProgress_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
