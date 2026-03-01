import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Heart } from "lucide-react";
import type { ProductModel as Product } from "@/generated/prisma/client/models/Product";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  let isPreOrderOpen = true;
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: 1 },
    });
    if (settings) {
      isPreOrderOpen = settings.isPreOrderOpen;
    }
  } catch (_error) {
    console.warn("Table StoreSettings might not exist yet. Defaulting to true.");
  }

  // Fetch up to 4 best sellers (currently just taking newest)
  let bestSellers: Product[] = [];
  try {
    bestSellers = await prisma.product.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.warn("Failed to fetch best sellers or database unreachable during build:", error);
  }

  return (
    <div className="w-full">
      {/* Custom Hero Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center bg-cream overflow-hidden pt-20 pb-16">
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-golden/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-caramel/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-golden/20 text-chocolate font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-golden animate-pulse"></span>
              Freshly Baked Everyday
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-chocolate mb-6 tracking-tight leading-[1.1]">
              Sweet Things, <br />
              <span className="text-golden relative inline-flex items-center">
                Made Slowly
                <Heart className="w-10 h-10 lg:w-14 lg:h-14 ml-3 text-golden fill-golden animate-pulse" />
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M0,10 Q100,0 200,10" stroke="#E2AD5F" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-chocolate/80 mb-10 max-w-xl leading-relaxed">
              Brownies fudgy lumer dan cookies renyah dengan bahan premium. Rasakan kebahagiaan di setiap gigitan Seravicoo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/katalog"
                className="px-8 py-4 bg-chocolate hover:bg-brownie text-cream font-bold rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(74,34,17,0.3)] hover:shadow-[0_8px_30px_rgba(74,34,17,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Pesan Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#best-sellers"
                className="px-8 py-4 bg-transparent border-2 border-chocolate/20 text-chocolate hover:border-chocolate font-bold rounded-full transition-all duration-300 flex items-center justify-center"
              >
                Lihat Promo
              </Link>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
            <div className="relative w-[320px] h-[400px] sm:w-[400px] sm:h-[500px] lg:w-[460px] lg:h-[580px] animate-float mt-10 lg:mt-0">
              {/* Image Frame/Backdrop */}
              <div className="absolute inset-0 bg-golden rounded-[40px] rotate-6 transform transition-transform hover:rotate-12 duration-500"></div>
              <div className="absolute inset-0 bg-brownie rounded-[40px] -rotate-3 transform transition-transform hover:-rotate-6 duration-500"></div>
              
              {/* Main Image */}
              <div className="absolute inset-0 rounded-[40px] overflow-hidden border-8 border-cream shadow-2xl bg-caramel/10">
                <Image
                  src="/hero-bg.webp"
                  alt="Seravicoo signature cookies and brownies"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Decorative Badge */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 bg-cream p-3 sm:p-4 rounded-full shadow-xl animate-spin-slow">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-golden flex items-center justify-center text-center p-2">
                  <span className="text-chocolate font-bold text-xs sm:text-sm leading-tight">100%<br/>Premium<br/>Quality</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust / Features Section */}
      <section className="py-16 bg-chocolate text-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-golden">Premium Quality</h3>
              <p className="text-sm text-cream/70">100% Belgian Dark Chocolate</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-golden">Freshly Baked</h3>
              <p className="text-sm text-cream/70">Dipanggang setiap hari</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-golden">Tanpa Pengawet</h3>
              <p className="text-sm text-cream/70">Aman dan sehat untuk keluarga</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-golden">Kirim ke Seluruh ID</h3>
              <p className="text-sm text-cream/70">Packing super aman & rapi</p>
            </div>
          </div>
        </div>
      </section>
      {/* Best Sellers Section */}
      <section id="best-sellers" className="py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Soft radial background for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-cream to-cream -z-10"></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6 relative z-10">
            <div className="max-w-2xl">
              <span className="text-golden font-bold tracking-wider uppercase text-sm mb-2 block">Pilihan Favorit</span>
              <h2 className="text-4xl md:text-5xl font-bold text-chocolate mb-4 leading-tight">Terlaris Bulan Ini</h2>
              <p className="text-caramel/90 text-lg">
                Tidak bisa memilih? Mulailah dari cookies dan brownies paling dicari oleh pelanggan setia Seravicoo.
              </p>
            </div>
            <Link 
              href="/katalog"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-white/50 hover:bg-white backdrop-blur-sm border border-golden/30 text-chocolate font-bold rounded-full transition-all duration-300 shadow-sm hover:shadow-md shrink-0"
            >
              Lihat Katalog Lengkap
              <div className="w-8 h-8 rounded-full bg-golden/20 flex items-center justify-center group-hover:bg-golden transition-colors">
                <ArrowRight className="w-4 h-4 text-chocolate group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>

          <div className="relative">
            {/* Ambient glow behind cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-golden/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

            {bestSellers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestSellers.map((product) => (
                  <div key={product.id} className="relative group/card transform transition-all duration-500 hover:-translate-y-2">
                    {/* Glassmorphism wrapper for ProductCard */}
                    <div className="relative z-10 bg-white/60 backdrop-blur-md rounded-[32px] p-2 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover/card:shadow-[0_20px_40px_rgba(226,173,95,0.15)] transition-shadow duration-500">
                      <ProductCard product={product} isPreOrderOpen={isPreOrderOpen} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm">
                <div className="w-20 h-20 bg-caramel/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-caramel/50" />
                </div>
                <h3 className="text-xl font-bold text-chocolate mb-2">Belum Ada Menu Terlaris</h3>
                <p className="text-caramel">Katalog produk sedang dalam persiapan.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Testimonials Marquee Section */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <section className="py-20 bg-caramel/5 overflow-hidden border-t border-b border-caramel/10">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl font-bold text-chocolate mb-4">Kata Mereka Tentang Seravicoo</h2>
          <div className="flex justify-center gap-1 text-golden mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <p className="text-caramel font-medium">Ribuan cookie lovers tak bisa bohong!</p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full flex overflow-hidden group">
          {/* Gradient Edges for fade effect */}
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Content - Duplicated for seamless loop */}
          <div className="flex w-max animate-marquee gap-6 px-3">
            {[1, 2].map((loopIndex) => (
              <div key={loopIndex} className="flex gap-6 shrink-0 w-max">
                <div className="w-[300px] shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-chocolate/5 flex flex-col gap-4">
                  <p className="text-chocolate/80 italic">&quot;Gila sih browniesnya! Beneran se-fudgy itu dan coklatnya gak bikin eneg sama sekali. Bakal langganan terus!&quot;</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-golden/30 flex items-center justify-center text-chocolate font-bold">A</div>
                    <div>
                      <h4 className="font-bold text-chocolate text-sm">Amanda S.</h4>
                      <p className="text-xs text-caramel">Jakarta Selatan</p>
                    </div>
                  </div>
                </div>

                <div className="w-[300px] shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-chocolate/5 flex flex-col gap-4">
                  <p className="text-chocolate/80 italic">&quot;Matcha cookiesnya the best in town! Pahit matchanya dapet, manis white choco-nya pas. Teksturnya chewy gitu suka banget.&quot;</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brownie/30 flex items-center justify-center text-chocolate font-bold">D</div>
                    <div>
                      <h4 className="font-bold text-chocolate text-sm">Dimas Pratama</h4>
                      <p className="text-xs text-caramel">Bandung</p>
                    </div>
                  </div>
                </div>

                <div className="w-[300px] shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-chocolate/5 flex flex-col gap-4">
                  <p className="text-chocolate/80 italic">&quot;Packingnya super aman nyampe Surabaya tetep utuh dan fresh. Buat kado ke temen juga proper banget boxnya elegan.&quot;</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-caramel/30 flex items-center justify-center text-chocolate font-bold">R</div>
                    <div>
                      <h4 className="font-bold text-chocolate text-sm">Rina Kusuma</h4>
                      <p className="text-xs text-caramel">Surabaya</p>
                    </div>
                  </div>
                </div>

                <div className="w-[300px] shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-chocolate/5 flex flex-col gap-4">
                  <p className="text-chocolate/80 italic">&quot;Cream cheese browniesnya melting di mulut. Porsinya gedeee jadi worth it banget harganya!&quot;</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-golden/30 flex items-center justify-center text-chocolate font-bold">K</div>
                    <div>
                      <h4 className="font-bold text-chocolate text-sm">Kevin </h4>
                      <p className="text-xs text-caramel">Depok</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
