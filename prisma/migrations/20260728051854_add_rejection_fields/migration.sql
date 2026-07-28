-- AlterTable
ALTER TABLE "public"."Expense" ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT;
