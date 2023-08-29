-- AlterTable
ALTER TABLE "casSocs" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'unPublished',
ALTER COLUMN "validity" DROP NOT NULL,
ALTER COLUMN "validity" SET DEFAULT 'inProgress';
