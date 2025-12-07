/*
  Warnings:

  - You are about to drop the column `sala` on the `ClassSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `turma` on the `ClassSchedule` table. All the data in the column will be lost.
  - Added the required column `className` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassSchedule" DROP COLUMN "sala",
DROP COLUMN "turma",
ADD COLUMN     "className" TEXT NOT NULL,
ADD COLUMN     "hasConflict" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "room" TEXT NOT NULL;
