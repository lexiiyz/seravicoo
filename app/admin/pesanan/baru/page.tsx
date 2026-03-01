import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderForm from "@/components/OrderForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function TambahPesanan() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin");
  }

  // Only get open batches
  const batches = await prisma.batch.findMany({
    where: { isOpen: true },
    orderBy: { createdAt: "desc" }
  });

  // Get all available products
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/pesanan" className="w-10 h-10 flex items-center justify-center bg-white border border-chocolate/10 rounded-full text-chocolate hover:bg-golden transition-colors shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-1">Input Pesanan Manual</h1>
          <p className="text-sm text-caramel/90">Masukkan detail pesanan pelanggan dari WhatsApp ke dalam sistem.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-chocolate/5 shadow-sm p-8">
        {batches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-bold mb-2">Tidak Ada Batch Terbuka</p>
            <p className="text-caramel text-sm mb-6">Anda harus membuka Batch PO baru sebelum bisa menerima pesanan.</p>
            <Link href="/admin/laporan/baru" className="px-6 py-3 bg-golden text-chocolate font-bold rounded-xl">Buka Batch Sekarang</Link>
          </div>
        ) : (
          <OrderForm batches={batches} products={products} />
        )}
      </div>
    </div>
  );
}
