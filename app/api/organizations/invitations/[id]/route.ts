import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } = await context.params;


    await prisma.invitation.delete({
      where: {
        id,
      },
    });


    return NextResponse.json({
      success: true,
      message: "Invitation deleted",
    });


  } catch (error) {


    console.error(
      "Delete invitation error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete invitation",
      },
      {
        status: 500,
      }
    );

  }

}