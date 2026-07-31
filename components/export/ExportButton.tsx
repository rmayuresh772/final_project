"use client";

import { useState, useRef, useEffect } from "react";

export default function ExportButton() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const from = "2026-07-01";
  const to = "2026-07-30";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function download(type: "csv" | "pdf") {
    try {
      setLoading(true);
      setOpen(false);

      const response = await fetch(
        `/api/export/${type}?from=${from}&to=${to}`
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `expenses-${from}-${to}.${type}`;

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(`${type.toUpperCase()} export failed`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? "Downloading..." : "Download"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
          <button
            onClick={() => download("csv")}
            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
          >
            📊 Download CSV
          </button>

          <button
            onClick={() => download("pdf")}
            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
          >
            📄 Download PDF
          </button>
        </div>
      )}
    </div>
  );
}