/*
  Warnings:

  - You are about to drop the `users_to_chats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users_to_chats" DROP CONSTRAINT "users_to_chats_chatId_fkey";

-- DropForeignKey
ALTER TABLE "users_to_chats" DROP CONSTRAINT "users_to_chats_userId_fkey";

-- DropTable
DROP TABLE "users_to_chats";

-- CreateTable
CREATE TABLE "chat_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat_session" ADD CONSTRAINT "chat_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_session" ADD CONSTRAINT "chat_session_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
