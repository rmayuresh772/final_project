"use client";

import { useState } from "react";

type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export default function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setInviteLink("");

    try {
      const response = await fetch("/api/organizations/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create invitation");
      }

      setMessage("Invitation created successfully.");

      // IMPORTANT: matches app/user/accept-invite/page.tsx
      setInviteLink(
        `${window.location.origin}/users/accept-invite?token=${data.data.token}`
      );

      setEmail("");
      setRole("EMPLOYEE");
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

  async function copyLink() {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);

    alert("Invitation link copied.");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Invite User
      </h1>

      <p className="text-slate-500 mb-8">
        Send an invitation to join your organization.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="employee@example.com"
            className="w-full rounded-lg border border-gray-300 p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border border-gray-300 p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating Invitation..." : "Send Invitation"}
        </button>
      </form>

      {message && (
        <div className="mt-8 rounded-lg border bg-slate-50 p-4">
          <p className="font-medium text-slate-800">
            {message}
          </p>
        </div>
      )}

      {inviteLink && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h2 className="font-semibold text-blue-900 mb-3">
            Invitation Link
          </h2>

          <input
            readOnly
            value={inviteLink}
            className="w-full rounded border bg-white p-3 text-sm text-black"
          />

          <button
            onClick={copyLink}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Copy Invitation Link
          </button>
        </div>
      )}
    </div>
  );
}