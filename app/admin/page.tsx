"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/store";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(pin);
      if (res.success) {
        router.push("/admin/dashboard");
        router.refresh(); // Force refresh to apply cookie
      } else {
        setError(res.error || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-chocolate">
          Login Admin Seravicoo
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-chocolate/10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-chocolate">
                Masukkan PIN Admin
              </label>
              <div className="mt-1">
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-caramel/30 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-golden focus:border-golden sm:text-sm text-chocolate"
                  placeholder="******"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-chocolate bg-golden hover:bg-brownie hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-golden transition-colors disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
