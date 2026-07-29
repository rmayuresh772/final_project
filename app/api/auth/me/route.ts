import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";


export async function GET() {

  try {

    const payload = await getCurrentUser();



    const user = await prisma.user.findUnique({

      where: {
        id: payload.userId,
      },


      include: {
        organization: true,
      },

    });



    if (!user) {

      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );

    }



    const {
      password,
      ...safeUser
    } = user;



    return NextResponse.json(

      {
        success: true,

        data: safeUser,
      },

      {
        status: 200,
      }

    );


  } catch(error) {


    console.error(
      "PROFILE ERROR:",
      error
    );


    return NextResponse.json(

      {
        success: false,
        message: "Unauthorized",
      },

      {
        status: 401,
      }

    );

  }

}