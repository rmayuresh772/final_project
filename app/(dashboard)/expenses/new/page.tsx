"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function NewExpensePage() {

  const router = useRouter();


  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    category: "TRAVEL",
  });


  const [loading, setLoading] = useState(false);



  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }



  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);


    try {

      const res = await fetch(
        "/api/expenses",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },

          body:JSON.stringify({
            ...form,
            amount:Number(form.amount),
          }),

        }
      );


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create expense");
      }

      router.push("/expenses");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
    finally{

      setLoading(false);

    }

  }



  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-3xl mx-auto">


        {/* Header */}

        <div className="mb-8">

          <h1 className="
          text-3xl
          font-bold
          text-gray-900
          ">
            Add Expense
          </h1>


          <p className="
          text-gray-500
          mt-2
          ">
            Submit a new company expense request
          </p>

        </div>



        {/* Form Card */}

        <div className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        p-8
        ">


          <form
          onSubmit={handleSubmit}
          className="space-y-6"
          >


            {/* Title */}

            <div>

              <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
              ">
                Expense Title
              </label>


              <input

              name="title"

              value={form.title}

              onChange={handleChange}

              placeholder="Example: Flight to Bangalore"

              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-900
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              "

              required

              />

            </div>




            {/* Description */}

            <div>

              <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
              ">
                Description
              </label>


              <textarea

              name="description"

              value={form.description}

              onChange={handleChange}

              placeholder="Client meeting details"

              rows={4}

              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-900
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              "

              />

            </div>





            <div className="
            grid
            md:grid-cols-2
            gap-6
            ">


              {/* Amount */}

              <div>

                <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
                ">
                  Amount
                </label>


                <input

                type="number"

                name="amount"

                value={form.amount}

                onChange={handleChange}

                placeholder="5500"

                className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                text-gray-900
                "

                required

                />

              </div>





              {/* Category */}

              <div>

                <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
                ">
                  Category
                </label>


                <select

                name="category"

                value={form.category}

                onChange={handleChange}

                className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                text-gray-900
                "

                >

                  <option value="TRAVEL">
                    Travel
                  </option>

                  <option value="FOOD">
                    Food
                  </option>

                  <option value="EQUIPMENT">
                    Equipment
                  </option>

                  <option value="OTHER">
                    Other
                  </option>


                </select>


              </div>


            </div>





            {/* Button */}

            <button

            disabled={loading}

            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-medium
            py-3
            rounded-xl
            transition
            disabled:opacity-50
            "

            >

              {
                loading
                ? "Submitting..."
                : "Submit Expense"
              }


            </button>



          </form>


        </div>


      </div>


    </div>

  );

}