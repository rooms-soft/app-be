/*
  Warnings:

  - The primary key for the `users_to_chats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users_to_chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users_to_chats" DROP CONSTRAINT "users_to_chats_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "users_to_chats_pkey" PRIMARY KEY ("userId", "chatId");
