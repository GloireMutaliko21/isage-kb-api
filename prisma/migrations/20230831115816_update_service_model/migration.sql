/*
  Warnings:

  - A unique constraint covering the columns `[libelle]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "services_libelle_key" ON "services"("libelle");
