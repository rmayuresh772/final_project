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

import { createAuditLog } from "@/repositories/audit.repository";

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
  userId: string,
  data: Partial<CreateExpenseInput>
) {
  const existing = await getExpenseById(id, organizationId);

  if (!existing) {
    throw new Error("Expense not found");
  }

  if (existing.userId !== userId) {
    throw new Error("You can only edit your own expenses");
  }

  if (existing.status !== "DRAFT") {
    throw new Error("Only draft expenses can be edited");
  }

  await updateExpense(id, organizationId, data);

  return getExpenseById(id, organizationId);
}

export async function deleteExpenseService(
  id: string,
  organizationId: string,
  userId: string
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.userId !== userId) {
    throw new Error("You can only delete your own expenses");
  }

  if (expense.status !== "DRAFT") {
    throw new Error("Only draft expenses can be deleted");
  }

  await deleteExpense(id, organizationId);

  await createAuditLog({
    organizationId,
    userId,
    action: "DELETE",
    entity: "Expense",
    entityId: id,
    fromStatus: expense.status,
    toStatus: "DELETED",
  });

  return {
    message: "Expense deleted successfully",
  };
}

export async function submitExpenseService(
  id: string,
  organizationId: string,
  userId: string
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.userId !== userId) {
    throw new Error("You can only submit your own expenses");
  }

  if (expense.status !== "DRAFT") {
    throw new Error("Only draft expenses can be submitted");
  }

  await submitExpense(id, organizationId);

  await createAuditLog({
    organizationId,
    userId,
    action: "SUBMIT",
    entity: "Expense",
    entityId: id,
    fromStatus: expense.status,
    toStatus: "SUBMITTED",
  });

  return getExpenseById(id, organizationId);
}

export async function approveExpenseService(
  id: string,
  organizationId: string,
  userId: string,
  overrideBudget?: boolean
) {
  const expense = await getExpenseById(id, organizationId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.status !== "SUBMITTED") {
    throw new Error("Only submitted expenses can be approved");
  }

  // Budget check: if no override flag, check if approval would exceed monthly budget
  if (!overrideBudget) {
    const { checkBudget } = await import("@/services/budget.service");
    const budgetWarning = await checkBudget(organizationId, Number(expense.amount));
    if (budgetWarning) {
      const error = new Error(budgetWarning) as Error & { statusCode?: number };
      error.statusCode = 422;
      throw error;
    }
  }

  await approveExpense(id, organizationId);

  await createAuditLog({
    organizationId,
    userId,
    action: "APPROVE",
    entity: "Expense",
    entityId: id,
    fromStatus: expense.status,
    toStatus: "APPROVED",
  });

  return getExpenseById(id, organizationId);
}

export async function rejectExpenseService(
  id: string,
  organizationId: string,
  userId: string,
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

  await createAuditLog({
    organizationId,
    userId,
    action: "REJECT",
    entity: "Expense",
    entityId: id,
    fromStatus: expense.status,
    toStatus: "REJECTED",
    metadata: { reason },
  });

  return getExpenseById(id, organizationId);
}