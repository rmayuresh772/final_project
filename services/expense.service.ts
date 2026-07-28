import {
    approveExpense,
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpensesByOrganization,
  rejectExpense,
  submitExpense,
  updateExpense,
} from "@/repositories/expense.repository";

import { CreateExpenseInput } from "@/validators/expense.validator";

export async function createExpenseService(
  user: {
    userId: string;
    organizationId: string;
  },
  data: CreateExpenseInput
) {
  return createExpense({
    organizationId: user.organizationId,
    userId: user.userId,
    ...data,
  });
}

export async function getExpensesService(
  organizationId: string
) {
  return getExpensesByOrganization(organizationId);
}

export async function getExpenseByIdService(
  id: string,
  organizationId: string
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  return expense;
}

export async function updateExpenseService(
  id: string,
  organizationId: string,
  data: Partial<CreateExpenseInput>
) {
  const existing = await getExpenseById(id, organizationId);

  if (!existing) {
    throw new Error("Expense not found");
  }

  if (existing.status !== "DRAFT") {
    throw new Error("Only draft expenses can be edited");
  }

  await updateExpense(id, organizationId, data);

  return getExpenseById(id, organizationId);
}

export async function deleteExpenseService(
  id: string,
  organizationId: string
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.status !== "DRAFT") {
    throw new Error("Only draft expenses can be deleted");
  }

  await deleteExpense(id, organizationId);

  return {
    message: "Expense deleted successfully",
  };
}

export async function submitExpenseService(
  id: string,
  organizationId: string
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.status !== "DRAFT") {
    throw new Error("Only draft expenses can be submitted");
  }

  await submitExpense(id, organizationId);

  return getExpenseById(id, organizationId);
}

export async function approveExpenseService(
  id: string,
  organizationId: string
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.status !== "SUBMITTED") {
    throw new Error("Only submitted expenses can be approved");
  }

  await approveExpense(id, organizationId);

  return getExpenseById(id, organizationId);
}

export async function rejectExpenseService(
  id: string,
  organizationId: string,
  reason: string
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.status !== "SUBMITTED") {
    throw new Error("Only submitted expenses can be rejected");
  }

  await rejectExpense(id, organizationId, reason);

  return getExpenseById(id, organizationId);
}