"use client";


export default function StatusOverview({
  expenses,
}:{
  expenses:any[];
}){


  const status:any = {};


  expenses.forEach((expense)=>{

    status[expense.status] =
      (status[expense.status] || 0) + 1;

  });



  return (

    <div
      className="
      mt-8
      rounded-2xl
      border
      border-gray-200
      bg-white
      p-6
      shadow-sm
      "
    >

      <h2
        className="
        text-xl
        font-bold
        text-gray-900
        "
      >
        Expense Status
      </h2>



      <div className="mt-6 space-y-4">


        {
          Object.entries(status).map(
            ([key,value]:any)=>(

              <div
                key={key}
                className="
                flex
                items-center
                justify-between
                rounded-lg
                bg-gray-50
                p-4
                "
              >

                <span
                  className="
                  font-medium
                  text-gray-700
                  "
                >
                  {key}
                </span>


                <span
                  className="
                  text-xl
                  font-bold
                  text-gray-900
                  "
                >
                  {value}
                </span>


              </div>

            )
          )
        }


      </div>


    </div>

  );

}