"use client";


export default function ReportCards({
  data,
}: {
  data:any;
}) {


  const cards = [

    {
      title:"Total Expenses",
      value:data.totalExpenses,
      color:"text-blue-600"
    },

    {
      title:"Total Amount",
      value:`$${data.totalAmount}`,
      color:"text-green-600"
    },

    {
      title:"Draft",
      value:data.draft,
      color:"text-gray-700"
    },

    {
      title:"Submitted",
      value:data.submitted,
      color:"text-yellow-600"
    },

    {
      title:"Approved",
      value:data.approved,
      color:"text-green-700"
    },

    {
      title:"Rejected",
      value:data.rejected,
      color:"text-red-600"
    }

  ];



  return (

    <div
      className="
      mt-8
      grid
      gap-5
      sm:grid-cols-2
      lg:grid-cols-3
      "
    >

      {
        cards.map((card)=>(


          <div
            key={card.title}
            className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
            "
          >


            <p
              className="
              text-sm
              font-medium
              text-gray-500
              "
            >
              {card.title}
            </p>



            <h2
              className={`
              mt-3
              text-3xl
              font-bold
              ${card.color}
              `}
            >

              {card.value}

            </h2>


          </div>


        ))
      }


    </div>

  );

}