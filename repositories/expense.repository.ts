import { prisma } from "@/lib/prisma";
import { ExpenseCategory, ExpenseStatus } from "@prisma/client";

interface CreateExpenseParams {
  organizationId: string;
  userId: string;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
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
      isDeleted: false,
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
      isDeleted: false,
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
    receiptUrl?: string;
  }
) {
  return prisma.expense.updateMany({
    where: {
      id,
      organizationId,
      isDeleted: false,
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
      isDeleted: false,
      status: ExpenseStatus.DRAFT,
    },
    data: {
      isDeleted: true,
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
      isDeleted: false,
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
      isDeleted: false,
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
      isDeleted: false,
    },
    data: {
      status: ExpenseStatus.REJECTED,
      rejectedAt: new Date(),
      rejectionReason: reason,
    },
  });
}