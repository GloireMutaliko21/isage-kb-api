/*
  Warnings:

  - You are about to drop the column `resetTokenExpiration` on the `agents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "agents" DROP COLUMN "resetTokenExpiration";
