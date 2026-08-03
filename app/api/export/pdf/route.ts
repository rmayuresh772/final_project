import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ExpenseCategory, ExpenseStatus, Prisma, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    requireRole(user, [Role.ADMIN]);

    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        {
          success: false,
          message: "from and to are required",
        },
        {
          status: 400,
        }
      );
    }

    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const submitter = searchParams.get("submitter");

    const where: Prisma.ExpenseWhereInput = {
      organizationId: user.organizationId,
      deletedAt: null,
      dateIncurred: {
        gte: new Date(from),
        lte: new Date(`${to}T23:59:59.999Z`),
      },
    };

    if (status && Object.values(ExpenseStatus).includes(status as ExpenseStatus)) {
      where.status = status as ExpenseStatus;
    }

    if (category && Object.values(ExpenseCategory).includes(category as ExpenseCategory)) {
      where.category = category as ExpenseCategory;
    }

    if (submitter) {
      where.userId = submitter;
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        dateIncurred: "asc",
      },
    });

    const pdf = await PDFDocument.create();

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    let page = pdf.addPage([842, 595]);

    const { width, height } = page.getSize();

    let y = height - 40;

    page.drawText("Expense Report", {
      x: 40,
      y,
      size: 22,
      font: bold,
      color: rgb(0, 0, 0),
    });

    y -= 25;

    page.drawText(`Date Range : ${from} to ${to}`, {
      x: 40,
      y,
      size: 11,
      font,
    });

    y -= 30;

    page.drawText(
      "Title",
      { x: 40, y, size: 10, font: bold }
    );

    page.drawText(
      "Amount",
      { x: 220, y, size: 10, font: bold }
    );

    page.drawText(
      "Category",
      { x: 300, y, size: 10, font: bold }
    );

    page.drawText(
      "Status",
      { x: 400, y, size: 10, font: bold }
    );

    page.drawText(
      "Employee",
      { x: 500, y, size: 10, font: bold }
    );

    y -= 15;

    page.drawLine({
      start: { x: 40, y },
      end: { x: width - 40, y },
      thickness: 1,
    });

    y -= 18;

    let total = 0;

    for (const expense of expenses) {
      if (y < 50) {
        page = pdf.addPage([842, 595]);
        y = height - 40;
      }

      total += Number(expense.amount);

      page.drawText(
        expense.title.substring(0, 28),
        {
          x: 40,
          y,
          size: 9,
          font,
        }
      );

      page.drawText(
  `INR ${Number(expense.amount).toFixed(2)}`,
  {
    x: 220,
    y,
    size: 9,
    font,
  }
);

      page.drawText(
        expense.category,
        {
          x: 300,
          y,
          size: 9,
          font,
        }
      );

      page.drawText(
        expense.status,
        {
          x: 400,
          y,
          size: 9,
          font,
        }
      );

      page.drawText(
        expense.user.name.substring(0, 20),
        {
          x: 500,
          y,
          size: 9,
          font,
        }
      );

      y -= 18;
    }

    y -= 20;

    page.drawLine({
      start: { x: 40, y },
      end: { x: width - 40, y },
      thickness: 1,
    });

    y -= 25;

    page.drawText(
      `Total Expenses : ${expenses.length}`,
      {
        x: 40,
        y,
        size: 13,
        font: bold,
      }
    );

    y -= 20;

    page.drawText(
  `Total Amount : INR ${total.toFixed(2)}`,
  {
    x: 40,
    y,
    size: 13,
    font: bold,
  }
);

    const pdfBytes = await pdf.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="expenses-${from}-${to}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}