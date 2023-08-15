-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "public_id" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiration" TIMESTAMP(3);
