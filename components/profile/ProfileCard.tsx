"use client";


export default function ProfileCard({
  user,
}:{
  user:any;
}){


  return (

    <div
      className="
      mt-8
      max-w-xl
      rounded-2xl
      border
      border-gray-200
      bg-white
      p-8
      shadow-sm
      "
    >


      <div
        className="
        flex
        items-center
        gap-5
        "
      >


        <div
          className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-blue-100
          text-2xl
          font-bold
          text-blue-700
          "
        >

          {
            user?.name
              ?.charAt(0)
              ?.toUpperCase()
          }

        </div>



        <div>


          <h2
            className="
            text-xl
            font-bold
            text-gray-900
            "
          >
            {user.name}
          </h2>


          <p
            className="
            text-gray-600
            "
          >
            {user.email}
          </p>


        </div>


      </div>




      <div
        className="
        mt-8
        space-y-4
        "
      >


        <div
          className="
          rounded-lg
          bg-gray-50
          p-4
          "
        >

          <p className="text-sm text-gray-500">
            Role
          </p>


          <p className="mt-1 font-semibold text-gray-900">
            {user.role}
          </p>

        </div>



        <div
          className="
          rounded-lg
          bg-gray-50
          p-4
          "
        >

          <p className="text-sm text-gray-500">
            Organization
          </p>


          <p className="mt-1 font-semibold text-gray-900">
            {user.organization?.name ?? "N/A"}
          </p>

        </div>


      </div>



    </div>

  );

}