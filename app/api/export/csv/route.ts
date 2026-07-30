import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    requireRole(user, [Role.ADMIN]);

    const { searchParams } = new URL(req.url);

    // Required: date range
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    if (!fromDate || !toDate) {
      return NextResponse.json(
        { success: false, message: "Date range (from, to) is required" },
        { status: 400 }
      );
    }

    // Optional filters
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const submitterId = searchParams.get("submitter");

    // Build where clause
    const where: Prisma.ExpenseWhereInput = {
      organizationId: user.organizationId,
      deletedAt: null,
      createdAt: {
        gte: new Date(fromDate),
        lte: new Date(toDate + "T23:59:59.999Z"),
      },
    };

    if (status) {
      where.status = status as any;
    }

    if (category) {
      where.category = category as any;
    }

    if (submitterId) {
      where.userId = submitterId;
    }

    // Use cursor-based streaming approach
    // We'll use a generator to yield rows one at a time
    const BATCH_SIZE = 100;
    let cursor: string | undefined = undefined;
    let hasMore = true;

    // Create the CSV header
    const header = "ID,Title,Description,Amount,Category,Status,Date Incurred,Receipt Reference,Submitted At,Approved At,Submitter Name,Submitter Email\n";

    // Create a ReadableStream that yields CSV rows
    const stream = new ReadableStream({
      async start(controller) {
        // Push header
        controller.enqueue(new TextEncoder().encode(header));

        while (hasMore) {
          const batch = await prisma.expense.findMany({
            where,
            take: BATCH_SIZE,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            orderBy: { createdAt: "asc" },
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          });

          if (batch.length === 0) {
            hasMore = false;
            break;
          }

          for (const expense of batch) {
            // Escape CSV fields properly
            const row = [
              expense.id,
              escapeCsvField(expense.title),
              escapeCsvField(expense.description ?? ""),
              Number(expense.amount).toFixed(2),
              expense.category,
              expense.status,
              expense.dateIncurred.toISOString().split("T")[0],
              escapeCsvField(expense.receiptReference),
              expense.submittedAt?.toISOString() ?? "",
              expense.approvedAt?.toISOString() ?? "",
              escapeCsvField(expense.user.name),
              escapeCsvField(expense.user.email),
            ].join(",") + "\n";

            controller.enqueue(new TextEncoder().encode(row));
          }

          cursor = batch[batch.length - 1].id;
        }

        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="expenses-${fromDate}-to-${toDate}.csv"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}