/*
  Warnings:

  - A unique constraint covering the columns `[libelle]` on the table `articles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[libelle]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[libelle]` on the table `unities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "articles_libelle_key" ON "articles"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "categories_libelle_key" ON "categories"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "unities_libelle_key" ON "unities"("libelle");
