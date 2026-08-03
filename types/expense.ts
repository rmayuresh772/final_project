export interface Expense {
  id: string;
  title: string;
  description: string | null;
  amount: string;
  category: string;
  status: string;
  dateIncurred: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  organizationId: string;
  receiptReference: string;
  submittedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}