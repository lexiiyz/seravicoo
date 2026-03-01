import prisma from "@/lib/prisma";
import { updateOrderStatus, deleteOrder } from "@/app/actions/order";
import { PlusCircle, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
type OrderStatus = "PENDING" | "PAID" | "BAKING" | "DELIVERED" | "CANCELLED";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const revalidate = 0;

export default async function AdminPesanan() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      batch: true,
      items: {
        include: { product: true }
      }
    }
  });

  const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PAID: "bg-blue-100 text-blue-800 border-blue-200",
    BAKING: "bg-orange-100 text-orange-800 border-orange-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-2">Daftar Pesanan</h1>
          <p className="text-caramel/90">Kelola pesanan pelanggan dari WhatsApp dan pantau status pembayarannya.</p>
        </div>
        <Link 
          href="/admin/pesanan/baru"
          className="flex items-center gap-2 px-6 py-3 bg-golden hover:bg-brownie text-chocolate hover:text-white font-bold rounded-xl transition-all shadow-sm"
        >
          <PlusCircle size={20} />
          Input Pesanan Manual
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-chocolate/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-light/20 flex justify-between items-center bg-cream/10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-caramel/50" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau nomor WA..." 
              className="w-full pl-10 pr-4 py-2 border border-caramel/20 rounded-lg text-sm focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-cream/30 text-chocolate border-b border-light/30 text-sm">
                <th className="py-4 px-6 font-bold w-48">Pelanggan</th>
                <th className="py-4 px-6 font-bold">Pesanan</th>
                <th className="py-4 px-6 font-bold">Total Nilai</th>
                <th className="py-4 px-6 font-bold">Batch</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-caramel">
                    Belum ada pesanan yang diinput.
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="border-b border-light/10 hover:bg-cream/10 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-chocolate">{order.customerName}</p>
                    <a href={`https://wa.me/${order.customerWa.replace(/\D/g, "")}`} target="_blank" className="text-xs text-blue-600 hover:underline">
                      {order.customerWa}
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <ul className="text-sm text-caramel/90 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-bold">{item.quantity}x</span> {item.product.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-6 font-bold text-chocolate">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-6 text-sm text-caramel/80">
                    {order.batch.name}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <form action={async () => {
                        "use server";
                        await deleteOrder(order.id);
                        redirect("/admin/pesanan");
                      }}>
                        <button type="submit" className="p-2 text-caramel hover:text-red-500 transition-colors bg-white border border-caramel/20 rounded-md hover:border-red-200">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
