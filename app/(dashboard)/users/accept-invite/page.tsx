"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid invitation link.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/organizations/accept-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          name,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setMessage("Invitation accepted successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-slate-900 mb-6">
          Accept Invitation
        </h1>

        {!token ? (
          <div className="text-center text-red-600">
            Invalid invitation link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3 text-black"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3 text-black"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Accept Invitation"}
            </button>

            {message && (
              <div
                className={`text-center font-medium ${
                  message.toLowerCase().includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}