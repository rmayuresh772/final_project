import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();

    const {
      email,
      password
    } = body;



    if(!email || !password){

      return NextResponse.json(
        {
          success:false,
          message:"Email and password required"
        },
        {
          status:400
        }
      );

    }



    const user = await prisma.user.findUnique({

      where:{
        email
      }

    });



    if(!user){

      return NextResponse.json(
        {
          success:false,
          message:"Invalid credentials"
        },
        {
          status:401
        }
      );

    }



    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );



    if(!passwordMatch){

      return NextResponse.json(
        {
          success:false,
          message:"Invalid credentials"
        },
        {
          status:401
        }
      );

    }



    const token = jwt.sign(

      {
        userId:user.id,
        organizationId:user.organizationId,
        role:user.role
      },

      process.env.JWT_SECRET!,

      {
        expiresIn:"7d"
      }

    );



    const response = NextResponse.json(

      {
        success:true,

        message:"Login successful",

        data:{

          user:{

            id:user.id,

            organizationId:user.organizationId,

            name:user.name,

            email:user.email,

            role:user.role,

            createdAt:user.createdAt,

            updatedAt:user.updatedAt

          },

          token

        }

      }

    );



    // Store JWT token in browser cookie

    response.cookies.set(
      "token",
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );



    return response;



  } catch(error){


    console.error(
      "LOGIN ERROR:",
      error
    );


    return NextResponse.json(

      {
        success:false,
        message:"Something went wrong"
      },

      {
        status:500
      }

    );

  }

}