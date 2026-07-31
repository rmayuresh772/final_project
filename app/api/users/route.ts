import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;


    if (!token) {

      return NextResponse.json(
        {
          message: "Unauthorized"
        },
        {
          status: 401
        }
      );

    }



    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId:string;
      organizationId:string;
      role:string;
    };





    const users = await prisma.user.findMany({

      where:{
        organizationId: decoded.organizationId
      },


      select:{

        id:true,
        name:true,
        email:true,
        role:true,

      },


      orderBy:{
        createdAt:"desc"
      }

    });





    return NextResponse.json({

      users

    });


  } catch(error) {


    console.error(
      "GET USERS ERROR:",
      error
    );


    return NextResponse.json(

      {
        message:"Failed to fetch users"
      },

      {
        status:500
      }

    );

  }

}