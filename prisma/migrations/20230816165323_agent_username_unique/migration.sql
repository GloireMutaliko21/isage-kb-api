/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `agents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "agents_username_key" ON "agents"("username");
