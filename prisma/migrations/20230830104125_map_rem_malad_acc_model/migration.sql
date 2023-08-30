/*
  Warnings:

  - You are about to drop the `remJMaladAccs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "remJMaladAccs" DROP CONSTRAINT "remJMaladAccs_agentId_fkey";

-- DropTable
DROP TABLE "remJMaladAccs";

-- CreateTable
CREATE TABLE "remjmaladaccs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "days" DECIMAL(65,30) NOT NULL,
    "libelle" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "remjmaladaccs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "remjmaladaccs" ADD CONSTRAINT "remjmaladaccs_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
