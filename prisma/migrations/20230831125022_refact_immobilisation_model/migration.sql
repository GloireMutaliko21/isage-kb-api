-- AlterTable
ALTER TABLE "immobilisations" ALTER COLUMN "amortissDate" DROP NOT NULL,
ALTER COLUMN "amortissDate" SET DEFAULT CURRENT_TIMESTAMP;
