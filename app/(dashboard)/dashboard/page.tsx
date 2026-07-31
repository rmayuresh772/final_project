import { cookies } from "next/headers";

import SummaryCards from "@/components/dashboard/SummaryCards";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import PendingExpenses from "@/components/dashboard/PendingExpenses";
import MonthlyExpenseChart from "@/components/charts/MonthlyExpenseChart";
import ExportCsvButton from "@/components/export/ExportButton";


async function getDashboardData() {


  const cookieStore = await cookies();

  const token =
    cookieStore.get("token")?.value;



  const headers = {

    Cookie:`token=${token}`

  };



  const [
    summaryResponse,
    recentResponse,
    pendingResponse,
    monthlyResponse

  ] = await Promise.all([


    fetch(
      "http://localhost:3000/api/dashboard",
      {
        headers,
        cache:"no-store"
      }
    ),


    fetch(
      "http://localhost:3000/api/dashboard/recent",
      {
        headers,
        cache:"no-store"
      }
    ),


    fetch(
      "http://localhost:3000/api/dashboard/pending",
      {
        headers,
        cache:"no-store"
      }
    ),


    fetch(
      "http://localhost:3000/api/dashboard/monthly",
      {
        headers,
        cache:"no-store"
      }
    )


  ]);



  const summary =
    await summaryResponse.json();


  const recent =
    await recentResponse.json();


  const pending =
    await pendingResponse.json();


  const monthly =
    await monthlyResponse.json();




  return {

    summary: summary.data ?? {},

    recent: recent.data ?? [],

    pending: pending.data ?? [],

    monthly: monthly.data ?? []

  };


}





export default async function DashboardPage(){


  const data =
    await getDashboardData();



  return (

    <div
      className="
      min-h-screen
      bg-slate-50
      p-10
      space-y-10
      "
    >



      {/* Header */}

      <div
        className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        "
      >


        <div>

          <h1
            className="
            text-4xl
            font-bold
            text-slate-900
            "
          >
            Expense Dashboard
          </h1>


          <p
            className="
            text-slate-500
            mt-2
            "
          >
            Track, review and manage company expenses
          </p>


        </div>



        {/* CSV Export */}

        <ExportCsvButton />


      </div>





      <SummaryCards
        data={data.summary}
      />





      <MonthlyExpenseChart

        data={
          data.monthly.map(
            (
              item:{
                month:string;
                total:number
              }
            )=>({

              month:item.month,

              total:Number(item.total)

            })
          )
        }

      />





      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >


        <RecentExpenses
          expenses={data.recent}
        />



        <PendingExpenses
          expenses={data.pending}
        />


      </div>



    </div>

  );

}