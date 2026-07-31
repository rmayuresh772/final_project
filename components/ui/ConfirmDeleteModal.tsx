"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}


export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}: Props) {

  if (!open) return null;


  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/50
      "
    >

      <div
        className="
        w-full
        max-w-md
        rounded-xl
        bg-white
        p-6
        shadow-xl
        "
      >


        <h2
          className="
          text-xl
          font-bold
          text-gray-900
          "
        >
          Confirm Delete
        </h2>


        <p
          className="
          mt-3
          text-gray-600
          "
        >
          Are you sure you want to delete this invitation?
        </p>



        <div
          className="
          mt-6
          flex
          justify-end
          gap-3
          "
        >

          <button
            onClick={onClose}
            className="
            rounded-lg
            bg-gray-200
            px-5
            py-2
            font-medium
            text-gray-700
            hover:bg-gray-300
            "
          >
            No
          </button>



          <button
            onClick={onConfirm}
            className="
            rounded-lg
            bg-red-600
            px-5
            py-2
            font-medium
            text-white
            hover:bg-red-700
            "
          >
            Yes, Delete
          </button>


        </div>


      </div>

    </div>
  );
}