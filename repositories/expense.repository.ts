import { prisma } from "@/lib/prisma";
import { ExpenseCategory, ExpenseStatus } from "@prisma/client";

interface CreateExpenseParams {
  organizationId: string;
  userId: string;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  dateIncurred: Date;
  receiptReference: string;
  receiptUrl?: string;
}

export async function createExpense(data: CreateExpenseParams) {
  return prisma.expense.create({
    data: {
      organizationId: data.organizationId,
      userId: data.userId,
      title: data.title,
      description: data.description,
      amount: data.amount,
      category: data.category,
      dateIncurred: data.dateIncurred,
      receiptReference: data.receiptReference,
      receiptUrl: data.receiptUrl,
      status: ExpenseStatus.DRAFT,
    },
  });
}

export async function getExpensesByOrganization(
  organizationId: string
) {
  return prisma.expense.findMany({
    where: {
      organizationId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getExpenseById(
  id: string,
  organizationId: string
) {
  return prisma.expense.findFirst({
    where: {
      id,
      organizationId,
      deletedAt: null,
    },
  });
}

export async function updateExpense(
  id: string,
  organizationId: string,
  data: {
    title?: string;
    description?: string;
    amount?: number;
    category?: ExpenseCategory;
    dateIncurred?: Date;
    receiptReference?: string;
    receiptUrl?: string;
  }
) {
  return prisma.expense.updateMany({
    where: {
      id,
      organizationId,
      deletedAt: null,
      status: ExpenseStatus.DRAFT,
    },
    data,
  });
}

export async function deleteExpense(
  id: string,
  organizationId: string
) {
  return prisma.expense.updateMany({
    where: {
      id,
      organizationId,
      deletedAt: null,
      status: ExpenseStatus.DRAFT,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function submitExpense(
  id: string,
  organizationId: string
) {
  return prisma.expense.updateMany({
    where: {
      id,
      organizationId,
      status: ExpenseStatus.DRAFT,
      deletedAt: null,
    },
    data: {
      status: ExpenseStatus.SUBMITTED,
      submittedAt: new Date(),
    },
  });
}

export async function approveExpense(
  id: string,
  organizationId: string
) {
  return prisma.expense.updateMany({
    where: {
      id,
      organizationId,
      status: ExpenseStatus.SUBMITTED,
      deletedAt: null,
    },
    data: {
      status: ExpenseStatus.APPROVED,
      approvedAt: new Date(),
    },
  });
}

export async function rejectExpense(
  id: string,
  organizationId: string,
  reason: string
) {
  return prisma.expense.updateMany({
    where: {
      id,
      organizationId,
      status: ExpenseStatus.SUBMITTED,
      deletedAt: null,
    },
    data: {
      status: ExpenseStatus.REJECTED,
      rejectedAt: new Date(),
      rejectionReason: reason,
    },
  });
}