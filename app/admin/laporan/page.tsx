import prisma from "@/lib/prisma";
import { closeBatch } from "@/app/actions/batch";
import { PlusCircle, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminLaporan() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin");
  }

  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-2">Laporan & Batch PO</h1>
          <p className="text-caramel/90">Kelola periode batch Pre-Order dan rekap pesanan untuk produksi (baking).</p>
        </div>
        <Link 
          href="/admin/laporan/baru"
          className="flex items-center gap-2 px-6 py-3 bg-golden hover:bg-brownie text-chocolate hover:text-white font-bold rounded-xl transition-all shadow-sm"
        >
          <PlusCircle size={20} />
          Buka Batch Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white/50 rounded-3xl border border-caramel/20 border-dashed">
            <p className="text-caramel">Belum ada batch PO. Silakan buat batch baru.</p>
          </div>
        ) : batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-3xl p-6 border border-chocolate/5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-chocolate">{batch.name}</h3>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                batch.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {batch.isOpen ? "BUKA" : "DITUTUP"}
              </span>
            </div>
            
            <div className="flex flex-col gap-2 text-sm text-caramel/90">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(batch.startDate).toLocaleDateString('id-ID')} - {new Date(batch.endDate).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>{batch._count.orders} Pesanan Masuk</span>
              </div>
            </div>

            <div className="mt-auto pt-4 flex gap-2 border-t border-light/20">
              <Link 
                href={`/admin/laporan/${batch.id}`} 
                className="flex-1 text-center py-2 bg-cream text-chocolate hover:bg-golden font-bold rounded-lg transition-colors text-sm"
              >
                Lihat Rekap Baking
              </Link>
              {batch.isOpen && (
                <form action={async () => {
                  "use server";
                  await closeBatch(batch.id);
                  redirect("/admin/laporan");
                }}>
                  <button type="submit" className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 font-bold rounded-lg transition-colors text-sm">
                    Tutup
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
