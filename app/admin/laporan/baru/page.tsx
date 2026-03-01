"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { createBatch } from "@/app/actions/batch";

export default function BukaBatch() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
    };

    if (data.endDate <= data.startDate) {
      setError("Tanggal tutup PO harus setelah tanggal mulai.");
      setLoading(false);
      return;
    }

    try {
      await createBatch(data);
      router.push("/admin/laporan");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat membuka batch.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/laporan" className="w-10 h-10 flex items-center justify-center bg-white border border-chocolate/10 rounded-full text-chocolate hover:bg-golden transition-colors shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-1">Buka Batch PO Baru</h1>
          <p className="text-sm text-caramel/90">Tentukan periode dan nama batch untuk mulai menerima pesanan.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-chocolate/5 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-chocolate">Nama Batch *</label>
            <input name="name" required type="text" placeholder="Misal: PO Lebaran 2026 Batch 1" className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-chocolate">Tanggal Buka PO *</label>
              <input name="startDate" required type="date" className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate text-sm" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-chocolate">Tanggal Tutup PO *</label>
              <input name="endDate" required type="date" className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate text-sm" />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-light/20 mt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-golden hover:bg-brownie text-chocolate hover:text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <PlayCircle size={20} />
              {loading ? "Memproses..." : "Buka Batch Sekarang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
