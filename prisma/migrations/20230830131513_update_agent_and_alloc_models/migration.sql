/*
  Warnings:

  - You are about to drop the column `nbChildren` on the `familyAllocations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "nbChildren" DECIMAL(65,30) DEFAULT 0;

-- AlterTable
ALTER TABLE "familyAllocations" DROP COLUMN "nbChildren";
