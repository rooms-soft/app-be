/*
  Warnings:

  - Made the column `connectedAt` on table `chat_session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "chat_session" ALTER COLUMN "connectedAt" SET NOT NULL;
