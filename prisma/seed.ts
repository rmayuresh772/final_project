import { PrismaClient, Role, ExpenseCategory, ExpenseStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create organizations
  const org1 = await prisma.organization.create({
    data: {
      name: "Acme Technologies",
      slug: "acme-technologies",
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: "Globex Corporation",
      slug: "globex-corp",
    },
  });

  console.log(`✅ Created organizations: ${org1.name}, ${org2.name}`);

  // Create users
  const password = await bcrypt.hash("password123", 10);

  const admin1 = await prisma.user.create({
    data: {
      organizationId: org1.id,
      name: "Admin Acme",
      email: "admin@acme.com",
      password,
      role: Role.ADMIN,
    },
  });

  const manager1 = await prisma.user.create({
    data: {
      organizationId: org1.id,
      name: "Manager Acme",
      email: "manager@acme.com",
      password,
      role: Role.MANAGER,
    },
  });

  const employee1 = await prisma.user.create({
    data: {
      organizationId: org1.id,
      name: "Employee Acme",
      email: "employee@acme.com",
      password,
      role: Role.EMPLOYEE,
    },
  });

  const employee2 = await prisma.user.create({
    data: {
      organizationId: org1.id,
      name: "John Doe",
      email: "john@acme.com",
      password,
      role: Role.EMPLOYEE,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      organizationId: org2.id,
      name: "Admin Globex",
      email: "admin@globex.com",
      password,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Created users");

  // Create budget for org1
  await prisma.budget.create({
    data: {
      organizationId: org1.id,
      monthlyLimit: 500000, // ₹5,00,000
      yearlyLimit: 6000000, // ₹60,00,000
    },
  });

  console.log("✅ Created budget for Acme Technologies");

  // Create expenses for org1
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  type ExpenseSeed = {
    userId: string;
    title: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    status: ExpenseStatus;
    dateIncurred: Date;
    receiptReference: string;
    submittedAt?: Date | null;
    approvedAt?: Date | null;
    rejectedAt?: Date | null;
    rejectionReason?: string | null;
  };

  const expensesData: ExpenseSeed[] = [
    {
      userId: employee1.id,
      title: "Flight to Mumbai",
      description: "Business trip to Mumbai for client meeting",
      amount: 15000,
      category: ExpenseCategory.TRAVEL,
      status: ExpenseStatus.APPROVED,
      dateIncurred: new Date(currentYear, currentMonth, 5),
      receiptReference: "REC-2024-001",
      submittedAt: new Date(currentYear, currentMonth, 5),
      approvedAt: new Date(currentYear, currentMonth, 6),
    },
    {
      userId: employee1.id,
      title: "Team Lunch",
      description: "Team lunch at Olive Garden",
      amount: 3500,
      category: ExpenseCategory.FOOD,
      status: ExpenseStatus.APPROVED,
      dateIncurred: new Date(currentYear, currentMonth, 10),
      receiptReference: "REC-2024-002",
      submittedAt: new Date(currentYear, currentMonth, 10),
      approvedAt: new Date(currentYear, currentMonth, 11),
    },
    {
      userId: employee1.id,
      title: "Laptop Stand",
      description: "Ergonomic laptop stand for WFH setup",
      amount: 2500,
      category: ExpenseCategory.EQUIPMENT,
      status: ExpenseStatus.SUBMITTED,
      dateIncurred: new Date(currentYear, currentMonth, 15),
      receiptReference: "REC-2024-003",
      submittedAt: new Date(currentYear, currentMonth, 15),
    },
    {
      userId: employee2.id,
      title: "Hotel Stay",
      description: "Hotel stay during Pune conference",
      amount: 12000,
      category: ExpenseCategory.TRAVEL,
      status: ExpenseStatus.APPROVED,
      dateIncurred: new Date(currentYear, currentMonth, 8),
      receiptReference: "REC-2024-004",
      submittedAt: new Date(currentYear, currentMonth, 8),
      approvedAt: new Date(currentYear, currentMonth, 9),
    },
    {
      userId: employee2.id,
      title: "Office Supplies",
      description: "Printer ink and paper",
      amount: 1800,
      category: ExpenseCategory.EQUIPMENT,
      status: ExpenseStatus.DRAFT,
      dateIncurred: new Date(currentYear, currentMonth, 20),
      receiptReference: "REC-2024-005",
    },
    {
      userId: employee1.id,
      title: "Client Dinner",
      description: "Dinner with client at Taj Hotel",
      amount: 8500,
      category: ExpenseCategory.FOOD,
      status: ExpenseStatus.REJECTED,
      dateIncurred: new Date(currentYear, currentMonth - 1, 25),
      receiptReference: "REC-2024-006",
      submittedAt: new Date(currentYear, currentMonth - 1, 25),
      rejectedAt: new Date(currentYear, currentMonth - 1, 26),
      rejectionReason: "Exceeds per-meal limit. Please split into separate expenses.",
    },
    {
      userId: employee1.id,
      title: "Software License",
      description: "Annual JetBrains license",
      amount: 25000,
      category: ExpenseCategory.OTHER,
      status: ExpenseStatus.SUBMITTED,
      dateIncurred: new Date(currentYear, currentMonth, 18),
      receiptReference: "REC-2024-007",
      submittedAt: new Date(currentYear, currentMonth, 18),
    },
    {
      userId: employee2.id,
      title: "Previous Month Travel",
      description: "Travel to Delhi office",
      amount: 18000,
      category: ExpenseCategory.TRAVEL,
      status: ExpenseStatus.APPROVED,
      dateIncurred: new Date(currentYear, currentMonth - 1, 15),
      receiptReference: "REC-2024-008",
      submittedAt: new Date(currentYear, currentMonth - 1, 15),
      approvedAt: new Date(currentYear, currentMonth - 1, 16),
    },
  ];

  for (const expenseData of expensesData) {
    const expense = await prisma.expense.create({
      data: {
        organizationId: org1.id,
        userId: expenseData.userId,
        title: expenseData.title,
        description: expenseData.description,
        amount: expenseData.amount,
        category: expenseData.category,
        status: expenseData.status,
        dateIncurred: expenseData.dateIncurred,
        receiptReference: expenseData.receiptReference,
        submittedAt: expenseData.submittedAt ?? null,
        approvedAt: expenseData.approvedAt ?? null,
        rejectedAt: expenseData.rejectedAt ?? null,
        rejectionReason: expenseData.rejectionReason ?? null,
      },
    });

    // Create audit logs for status changes
    if (expenseData.status !== ExpenseStatus.DRAFT) {
      await prisma.auditLog.create({
        data: {
          organizationId: org1.id,
          userId: expenseData.userId,
          action: "SUBMIT",
          entity: "Expense",
          entityId: expense.id,
          fromStatus: ExpenseStatus.DRAFT,
          toStatus: ExpenseStatus.SUBMITTED,
        },
      });
    }

    if (expenseData.status === ExpenseStatus.APPROVED) {
      await prisma.auditLog.create({
        data: {
          organizationId: org1.id,
          userId: manager1.id,
          action: "APPROVE",
          entity: "Expense",
          entityId: expense.id,
          fromStatus: ExpenseStatus.SUBMITTED,
          toStatus: ExpenseStatus.APPROVED,
        },
      });
    }

    if (expenseData.status === ExpenseStatus.REJECTED) {
      await prisma.auditLog.create({
        data: {
          organizationId: org1.id,
          userId: manager1.id,
          action: "REJECT",
          entity: "Expense",
          entityId: expense.id,
          fromStatus: ExpenseStatus.SUBMITTED,
          toStatus: ExpenseStatus.REJECTED,
          metadata: { reason: expenseData.rejectionReason },
        },
      });
    }
  }

  console.log("✅ Created expenses with audit logs");

  // Create an invitation for demo
  await prisma.invitation.create({
    data: {
      organizationId: org1.id,
      email: "newuser@acme.com",
      role: Role.EMPLOYEE,
      token: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      invitedById: admin1.id,
    },
  });

  console.log("✅ Created demo invitation");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Demo Accounts:");
  console.log("   Admin:    admin@acme.com / password123");
  console.log("   Manager:  manager@acme.com / password123");
  console.log("   Employee: employee@acme.com / password123");
  console.log("   Employee: john@acme.com / password123");
  console.log("   Admin 2:  admin@globex.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });