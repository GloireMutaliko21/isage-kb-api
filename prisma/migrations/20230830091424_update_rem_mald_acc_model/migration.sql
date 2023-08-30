/*
  Warnings:

  - Added the required column `libelle` to the `remJMaladAccs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "remJMaladAccs" ADD COLUMN     "libelle" TEXT NOT NULL;
