import Link from "next/link";
import { cookies } from "next/headers";

import SubmitExpenseButton from "@/components/expenses/SubmitExpenseButton";


async function getExpenses() {

  const cookieStore = await cookies();

  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");


  const res = await fetch(
    "http://localhost:3000/api/expenses",
    {
      headers: {
        Cookie: cookie,
      },
      cache: "no-store",
    }
  );


  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }


  return res.json();

}




function StatusBadge({
  status,
}: {
  status: string;
}) {


  const styles: any = {

    APPROVED:
      "bg-green-100 text-green-700",

    REJECTED:
      "bg-red-100 text-red-700",

    SUBMITTED:
      "bg-yellow-100 text-yellow-700",

    DRAFT:
      "bg-gray-100 text-gray-700",

  };


  return (

    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${styles[status]}
      `}
    >
      {status}
    </span>

  );

}




export default async function ExpensesPage() {


  const response = await getExpenses();

  const expenses = response.data || [];



  return (

    <div
      className="
      min-h-screen
      bg-gray-50
      p-8
      "
    >


      <div className="max-w-6xl mx-auto">



        {/* Header */}

        <div
          className="
          flex
          justify-between
          items-center
          mb-8
          "
        >

          <div>

            <h1
              className="
              text-3xl
              font-bold
              text-gray-900
              "
            >
              My Expenses
            </h1>


            <p
              className="
              text-gray-600
              mt-2
              "
            >
              View and manage all your expenses.
            </p>

          </div>




          <Link
            href="/expenses/new"
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            font-medium
            "
          >
            + Add Expense
          </Link>


        </div>





        {/* Expense Cards */}


        <div className="grid gap-5">


          {
            expenses.map((expense: any) => (

              <div
                key={expense.id}
                className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-md
                transition
                "
              >



                <div
                  className="
                  flex
                  justify-between
                  items-start
                  "
                >



                  <div>


                    <h2
                      className="
                      text-xl
                      font-semibold
                      text-gray-900
                      "
                    >
                      {expense.title}
                    </h2>



                    <p
                      className="
                      text-gray-600
                      mt-2
                      "
                    >
                      {expense.description}
                    </p>





                    <div
                      className="
                      flex
                      items-center
                      gap-3
                      mt-4
                      "
                    >


                      <span
                        className="
                        bg-blue-100
                        text-blue-700
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        "
                      >
                        {expense.category}
                      </span>



                      <StatusBadge
                        status={expense.status}
                      />


                    </div>



                  </div>






                  <div
                    className="
                    text-right
                    "
                  >


                    <h2
                      className="
                      text-2xl
                      font-bold
                      text-gray-900
                      "
                    >
                      ${expense.amount}
                    </h2>



                    <p
                      className="
                      text-gray-500
                      text-sm
                      mt-2
                      "
                    >

                      {
                        new Date(
                          expense.createdAt
                        ).toLocaleDateString()
                      }

                    </p>


                  </div>



                </div>





                {/* Submit Button only for Draft */}

                {
                  expense.status === "DRAFT" && (

                    <SubmitExpenseButton
                      id={expense.id}
                    />

                  )
                }



              </div>


            ))
          }



        </div>



      </div>



    </div>

  );

}