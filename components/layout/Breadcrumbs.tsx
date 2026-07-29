"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const labels:any = {

  dashboard:"Dashboard",

  expenses:"My Expenses",

  new:"Add Expense",

  approvals:"Approvals",

  reports:"Reports",

  profile:"Profile",

};



export default function Breadcrumbs(){

  const pathname = usePathname();


  const paths = pathname
    .split("/")
    .filter(Boolean);



  if(paths.length === 0){
    return null;
  }



  return (

    <div
      className="
      mb-6
      flex
      items-center
      gap-2
      text-sm
      "
    >


      <Link
        href="/dashboard"
        className="
        text-gray-500
        hover:text-gray-900
        "
      >
        Home
      </Link>



      {
        paths.map((path,index)=>{


          const href =
            "/" +
            paths
              .slice(0,index+1)
              .join("/");


          const isLast =
            index === paths.length - 1;



          return (

            <div
              key={path}
              className="
              flex
              items-center
              gap-2
              "
            >

              <span className="text-gray-400">
                /
              </span>


              {
                isLast ? (

                  <span
                    className="
                    font-semibold
                    text-gray-900
                    "
                  >
                    {labels[path] || path}
                  </span>

                ) : (

                  <Link
                    href={href}
                    className="
                    text-gray-500
                    hover:text-gray-900
                    "
                  >
                    {labels[path] || path}
                  </Link>

                )
              }


            </div>

          );


        })
      }



    </div>

  );

}