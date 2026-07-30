"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,

          email,

          password,

          organizationName,

          organizationSlug,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(
          Array.isArray(data.message)
            ? data.message.map((err: any) => err.message).join(", ")
            : data.message || "Registration failed",
        );

        return;
      }

      router.push("/login");
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
  min-h-screen
  flex
  items-center
  justify-center
  bg-gradient-to-br
  from-gray-900
  via-gray-800
  to-gray-900
  px-4
  py-8
  "
    >
      <div
        className="
    w-full
    max-w-md
    rounded-2xl
    bg-white
    p-8
    shadow-2xl
    "
      >
        {/* Header */}

        <div
          className="
          text-center
          mb-8
          "
        >
          <div
            className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            text-2xl
            text-white
            "
          >
            💳
          </div>

          <h1
            className="
            mt-4
            text-3xl
            font-bold
            text-gray-900
            "
          >
            Create Account
          </h1>

          <p
            className="
            mt-2
            text-gray-500
            "
          >
            Join Expense Tracker
          </p>
        </div>

        {error && (
          <div
            className="
              mb-5
              rounded-lg
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              "
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="
          space-y-5
          "
        >
          {/* Name */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-700
              "
            >
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mayuresh Raskar"
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
              required
            />
          </div>

          {/* Email */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-700
              "
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mayuresh@gmail.com"
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
              required
            />
          </div>

          {/* Organization Name */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-700
              "
            >
              Organization Name
            </label>

            <input
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Acme Technologies"
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
              required
            />
          </div>

          {/* Organization Slug */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-700
              "
            >
              Organization Slug
            </label>

            <input
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              placeholder="acme-technologies"
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
              required
            />
          </div>

          {/* Password */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-700
              "
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            rounded-xl
            bg-blue-600
            py-3
            font-semibold
            text-white
            hover:bg-blue-700
            disabled:opacity-50
            "
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")}
          className="
          mt-5
          w-full
          rounded-xl
          border
          border-gray-300
          py-3
          font-semibold
          text-gray-700
          hover:bg-gray-50
          "
        >
          Already have account? Login
        </button>
      </div>
    </div>
  );
}
