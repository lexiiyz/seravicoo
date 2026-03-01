import { getStoreSettings, togglePreOrderStatus } from "@/app/actions/store";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export const revalidate = 0; // Never cache the admin page

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (session?.value !== "authenticated") {
    redirect("/admin");
  }

  const settings = await getStoreSettings();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-chocolate mb-2">Dashboard Induk</h1>
        <p className="text-caramel/90">Ringkasan operasional toko dan status pemesanan (PO) saat ini.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-chocolate/5 shadow-sm">
        <h2 className="text-xl font-bold text-chocolate mb-6">Status Pre-Order Eksternal</h2>
        
        <div className={`
          flex items-center gap-4 px-6 py-4 rounded-2xl border-2 mb-8 transition-all
          ${settings.isPreOrderOpen 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'}
        `}>
          {settings.isPreOrderOpen ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <XCircle className="w-8 h-8 text-red-500" />
          )}
          <div>
            <span className="block text-lg font-bold">
              {settings.isPreOrderOpen ? "PRE-ORDER SEDANG DIBUKA" : "PRE-ORDER DITUTUP (COMING SOON)"}
            </span>
            <span className="text-sm opacity-80">
              {settings.isPreOrderOpen 
                ? "Pelanggan dapat melihat katalog dan menghubungi via WhatsApp."
                : "Pelanggan hanya dapat melihat menu dengan tombol yang di-disable."}
            </span>
          </div>
        </div>

        <form action={async () => {
          "use server";
          await togglePreOrderStatus(settings.isPreOrderOpen);
          redirect("/admin/dashboard");
        }}>
          <button 
            type="submit"
            className={`
              relative overflow-hidden group px-8 py-4 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all
              ${settings.isPreOrderOpen 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20' 
                : 'bg-golden hover:bg-yellow-500 text-chocolate shadow-golden/20'}
            `}
          >
            <span className="relative z-10 block text-center w-full">
              {settings.isPreOrderOpen ? "TUTUP PRE-ORDER" : "BUKA PRE-ORDER"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}


