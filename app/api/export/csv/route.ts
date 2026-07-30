import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";


function escapeCsvField(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}



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
          success:false,
          message:"from and to date are required"
        },
        {
          status:400
        }
      );

    }



    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const submitter = searchParams.get("submitter");




    const where: Prisma.ExpenseWhereInput = {

      organizationId:user.organizationId,

      deletedAt:null,


      dateIncurred:{
        gte:new Date(from),
        lte:new Date(`${to}T23:59:59.999Z`)
      }

    };



    if(status){

      where.status = status as Prisma.ExpenseWhereInput["status"];

    }



    if(category){

      where.category = category as Prisma.ExpenseWhereInput["category"];

    }



    if(submitter){

      where.userId = submitter;

    }




    const csvHeader =
`ID,Title,Description,Amount,Category,Status,Date Incurred,Receipt Reference,Submitted At,Approved At,Submitter Name,Submitter Email\n`;



    const stream = new ReadableStream({

      async start(controller){


        const encoder = new TextEncoder();



        // send header first

        controller.enqueue(
          encoder.encode(csvHeader)
        );



        let cursor:string | undefined = undefined;


        const LIMIT = 100;



        while(true){



          const expenses = await prisma.expense.findMany({

            where,


            take:LIMIT,


            ...(cursor
              ? {
                  skip:1,
                  cursor:{
                    id:cursor
                  }
                }
              : {}
            ),



            orderBy:{
              id:"asc"
            },


            include:{

              user:{
                select:{
                  name:true,
                  email:true
                }
              }

            }


          });




          if(expenses.length===0){

            break;

          }




          for(const expense of expenses){



            const row = [

              expense.id,

              escapeCsvField(expense.title),

              escapeCsvField(expense.description),

              Number(expense.amount).toFixed(2),

              expense.category,

              expense.status,

              expense.dateIncurred
                .toISOString()
                .split("T")[0],


              escapeCsvField(
                expense.receiptReference
              ),


              expense.submittedAt
                ?.toISOString() ?? "",


              expense.approvedAt
                ?.toISOString() ?? "",



              escapeCsvField(
                expense.user.name
              ),


              escapeCsvField(
                expense.user.email
              )


            ].join(",")
            + "\n";




            controller.enqueue(
              encoder.encode(row)
            );


          }



          cursor =
            expenses[expenses.length-1].id;



        }



        controller.close();



      }


    });



    return new NextResponse(stream,{

      headers:{


        "Content-Type":
          "text/csv; charset=utf-8",



        "Content-Disposition":
          `attachment; filename="expenses-${from}-${to}.csv"`


      }


    });



  }

  catch(error){


    console.error(error);



    return NextResponse.json(

      {
        success:false,
        message:
          error instanceof Error
          ? error.message
          : "Something went wrong"
      },

      {
        status:400
      }

    );


  }


}