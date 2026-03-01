import prisma from "@/lib/prisma";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function BakingReport({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin");
  }

  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
  });

  if (!batch) {
    redirect("/admin/laporan");
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { order: { batchId: id } },
    include: { product: true }
  });

  // Group by product
  const recap = orderItems.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = {
        name: item.product.name,
        category: item.product.category,
        totalQuantity: 0,
      };
    }
    acc[item.productId].totalQuantity += item.quantity;
    return acc;
  }, {} as Record<string, { name: string, category: string, totalQuantity: number }>);

  const recapList = Object.values(recap).sort((a, b) => b.totalQuantity - a.totalQuantity);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/admin/laporan" className="w-10 h-10 flex items-center justify-center bg-white border border-chocolate/10 rounded-full text-chocolate hover:bg-golden transition-colors shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-chocolate mb-1">Rekap Baking: {batch.name}</h1>
            <p className="text-sm text-caramel/90">Daftar total produk yang harus diproduksi pada batch ini.</p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-white border border-chocolate/20 hover:bg-cream text-chocolate font-bold rounded-xl transition-all shadow-sm"
        >
          <Printer size={20} />
          Cetak Rekap (Gunakan Ctrl+P)
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-chocolate/5 shadow-sm p-8 print:shadow-none print:p-0 print:border-none">
        <div className="hidden print:block mb-8">
          <h2 className="text-2xl font-bold text-chocolate">Seravicoo Baking Report</h2>
          <p className="text-caramel">Batch: {batch.name}</p>
          <p className="text-caramel">Tanggal Produksi: ______________________</p>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/30 text-chocolate border-b border-light/30">
              <th className="py-4 px-6 font-bold">Produk</th>
              <th className="py-4 px-6 font-bold">Kategori</th>
              <th className="py-4 px-6 font-bold text-center">Jumlah Harus Dibuat</th>
              <th className="py-4 px-6 font-bold text-center print:table-cell">Checklist</th>
            </tr>
          </thead>
          <tbody>
            {recapList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-caramel">
                  Belum ada pesanan masuk untuk batch ini.
                </td>
              </tr>
            ) : recapList.map((item, idx) => (
              <tr key={idx} className="border-b border-light/10">
                <td className="py-4 px-6 font-bold text-chocolate">{item.name}</td>
                <td className="py-4 px-6 capitalize text-caramel">{item.category}</td>
                <td className="py-4 px-6 text-center">
                  <span className="text-xl font-black text-golden">{item.totalQuantity}</span>
                  <span className="text-caramel ml-1">pcs</span>
                </td>
                <td className="py-4 px-6 text-center print:table-cell">
                  <div className="w-6 h-6 border-2 border-caramel/30 rounded mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
