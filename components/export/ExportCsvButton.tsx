"use client";

import { useState } from "react";

export default function ExportCsvButton() {
  const [loading, setLoading] = useState(false);

  async function downloadCSV() {
    try {
      setLoading(true);

      const from = "2026-07-01";
      const to = "2026-07-30";

      const response = await fetch(
        `/api/export/csv?from=${from}&to=${to}`
      );


      if (!response.ok) {
        throw new Error("Export failed");
      }


      const blob = await response.blob();


      const url = window.URL.createObjectURL(blob);


      const link = document.createElement("a");

      link.href = url;

      link.download = `expenses-${from}-${to}.csv`;


      document.body.appendChild(link);

      link.click();


      link.remove();


      window.URL.revokeObjectURL(url);


    } catch (error) {

      console.error(error);

      alert("CSV export failed");

    } finally {

      setLoading(false);

    }
  }


  return (
    <button
      onClick={downloadCSV}
      disabled={loading}
      className="
        px-4 py-2
        rounded-lg
        bg-blue-600
        text-white
        hover:bg-blue-700
        disabled:opacity-50
      "
    >
      {loading ? "Exporting..." : "Download CSV"}
    </button>
  );
}