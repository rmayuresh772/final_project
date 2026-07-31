/*
  Warnings:

  - The values [ACCOMMODATION,OFFICE,SOFTWARE,TRAINING] on the enum `ExpenseCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isDeleted` on the `Expense` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId,receiptReference]` on the table `Expense` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateIncurred` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptReference` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedById` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ExpenseCategory_new" AS ENUM ('TRAVEL', 'FOOD', 'EQUIPMENT', 'OTHER');
ALTER TABLE "public"."Expense" ALTER COLUMN "category" TYPE "public"."ExpenseCategory_new" USING ("category"::text::"public"."ExpenseCategory_new");
ALTER TYPE "public"."ExpenseCategory" RENAME TO "ExpenseCategory_old";
ALTER TYPE "public"."ExpenseCategory_new" RENAME TO "ExpenseCategory";
DROP TYPE "public"."ExpenseCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."AuditLog" ADD COLUMN     "fromStatus" TEXT,
ADD COLUMN     "toStatus" TEXT;

-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "isDeleted",
ADD COLUMN     "dateIncurred" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "receiptReference" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Invitation" ADD COLUMN     "invitedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "public"."AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "Expense_submittedAt_idx" ON "public"."Expense"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_organizationId_receiptReference_key" ON "public"."Expense"("organizationId", "receiptReference");

-- CreateIndex
CREATE INDEX "Invitation_token_idx" ON "public"."Invitation"("token");

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
