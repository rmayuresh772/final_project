import { z } from "zod";
import { ExpenseCategory } from "@prisma/client";

export const createExpenseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.nativeEnum(ExpenseCategory),
  dateIncurred: z
    .string()
    .optional()
    .default(() => new Date().toISOString())
    .transform((val) => new Date(val)),
  receiptReference: z
    .string()
    .min(1, "Receipt reference is required")
    .optional()
    .default(() => `REC-${Date.now()}`),
  receiptUrl: z.string().url().optional(),
});

export const rejectExpenseSchema = z.object({
  reason: z.string().min(5, "Reason is required"),
});

export type RejectExpenseInput = z.infer<typeof rejectExpenseSchema>;

// For PATCH requests
export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;