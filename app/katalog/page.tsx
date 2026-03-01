import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { ProductModel as Product } from "@/generated/prisma/client/models/Product";

export const revalidate = 60; // Revalidate every minute

export default async function Katalog() {
  let isPreOrderOpen = true;
  let cookies: Product[] = [];
  let brownies: Product[] = [];

  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: 1 },
    });
    if (settings) {
      isPreOrderOpen = settings.isPreOrderOpen;
    }

    // Fetch Cookies
    cookies = await prisma.product.findMany({
      where: { category: 'cookies' },
      orderBy: { name: 'asc' }
    });

    // Fetch Brownies 
    brownies = await prisma.product.findMany({
      where: { category: 'brownies' },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.warn("Table StoreSettings or Product might not exist yet or database is unreachable during build. Fallback applied.", error);
  }

  return (
    <div className="w-full bg-cream min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Katalog */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-chocolate mb-4">
            Katalog Produk
          </h1>
          <p className="text-lg text-caramel max-w-2xl mx-auto">
            Temukan semua varian cookies dan brownies Seravicoo. Dibuat dengan bahan berkualitas untuk rasa yang tak terlupakan.
          </p>
        </div>

        {/* PO Status Banner */}
        {!isPreOrderOpen && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong className="font-bold">Mohon Maaf, Pre-Order Saat Ini Sedang Ditutup.</strong><br/>
                  Kami sedang memproses pesanan batch sebelumnya. Silakan lihat katalog produk kami di bawah ini untuk persiapan PO Batch selanjutnya!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section: Premium Cookies */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-chocolate">Premium Cookies</h2>
            <div className="h-px bg-golden flex-grow opacity-50"></div>
          </div>
          
          {cookies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cookies.map((product) => (
                <ProductCard key={product.id} product={product} isPreOrderOpen={isPreOrderOpen} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 rounded-2xl border border-caramel/20 border-dashed">
              <p className="text-caramel">Katalog cookies sedang disiapkan.</p>
            </div>
          )}
        </div>

        {/* Section: Fudgy Brownies */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-chocolate">Fudgy Brownies</h2>
            <div className="h-px bg-golden flex-grow opacity-50"></div>
          </div>

          {brownies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brownies.map((product) => (
                <ProductCard key={product.id} product={product} isPreOrderOpen={isPreOrderOpen} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 rounded-2xl border border-caramel/20 border-dashed">
              <p className="text-caramel">Katalog brownies sedang disiapkan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
