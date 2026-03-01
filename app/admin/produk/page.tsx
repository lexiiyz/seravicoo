import prisma from "@/lib/prisma";
import { toggleProductAvailability, deleteProduct } from "@/app/actions/product";
import { PlusCircle, Search, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export const revalidate = 0;

export default async function AdminProduk() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-2">Manajemen Produk</h1>
          <p className="text-caramel/90">Atur katalog cookies dan brownies yang akan dijual di website.</p>
        </div>
        <Link 
          href="/admin/produk/baru"
          className="flex items-center gap-2 px-6 py-3 bg-golden hover:bg-brownie text-chocolate hover:text-white font-bold rounded-xl transition-all shadow-sm"
        >
          <PlusCircle size={20} />
          Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-chocolate/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-light/20 flex justify-between items-center bg-cream/10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-caramel/50" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full pl-10 pr-4 py-2 border border-caramel/20 rounded-lg text-sm focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </div>
          <div className="flex gap-2 text-sm text-caramel font-medium">
            <span className="px-3 py-1 bg-chocolate/5 rounded-md border border-chocolate/10">Total: {products.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/30 text-chocolate border-b border-light/30">
                <th className="py-4 px-6 font-bold w-16">Foto</th>
                <th className="py-4 px-6 font-bold">Menu</th>
                <th className="py-4 px-6 font-bold">Kategori</th>
                <th className="py-4 px-6 font-bold text-right">Harga</th>
                <th className="py-4 px-6 font-bold text-center">Status Jual</th>
                <th className="py-4 px-6 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-caramel">
                    Belum ada produk. Silakan tambah produk baru.
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="border-b border-light/10 hover:bg-cream/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-cream border border-caramel/20">
                      <Image src={product.imageUrl || "/hero-bg.webp"} alt={product.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-chocolate">{product.name}</p>
                    <p className="text-xs text-caramel/80 line-clamp-1 max-w-[200px]">{product.description}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-brownie/10 text-chocolate rounded-full text-xs font-semibold capitalize border border-brownie/20">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-chocolate">
                    Rp {product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <form action={async () => {
                      "use server";
                      await toggleProductAvailability(product.id, product.isAvailable);
                      redirect("/admin/produk");
                    }}>
                      <button 
                        type="submit"
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          product.isAvailable ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {product.isAvailable ? "Tersedia" : "Ditutup"}
                      </button>
                    </form>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-caramel hover:text-golden transition-colors bg-white border border-caramel/20 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <form action={async () => {
                        "use server";
                        await deleteProduct(product.id);
                        redirect("/admin/produk");
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
