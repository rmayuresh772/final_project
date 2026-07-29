"use client";


export default function CategoryBreakdown({
  expenses,
}: {
  expenses:any[];
}) {


  const categories:any = {};


  expenses.forEach((expense)=>{

    if(!categories[expense.category]){
      categories[expense.category] = 0;
    }

    categories[expense.category] += Number(expense.amount);

  });



  const data = Object.entries(categories);



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
        Category Spending
      </h2>


      <div className="mt-6 space-y-5">


        {
          data.map(([category,total]:any)=>(


            <div key={category}>


              <div
                className="
                mb-2
                flex
                justify-between
                text-sm
                "
              >

                <span className="font-medium text-gray-700">
                  {category}
                </span>


                <span className="font-semibold text-gray-900">
                  ${total.toLocaleString()}
                </span>


              </div>



              <div
                className="
                h-4
                rounded-full
                bg-gray-100
                "
              >

                <div
                  className="
                  h-4
                  rounded-full
                  bg-blue-600
                  "
                  style={{
                    width:`${
                      (total /
                      Math.max(
                        ...data.map((x:any)=>x[1])
                      ))
                      *100
                    }%`
                  }}
                />

              </div>


            </div>


          ))
        }


      </div>


    </div>

  );

}