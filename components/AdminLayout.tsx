"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Cookie, ShoppingBag, FileText, LogOut, Power } from "lucide-react";
import { logoutAdmin } from "@/app/actions/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/produk", icon: Cookie },
    { name: "Pesanan", href: "/admin/pesanan", icon: ShoppingBag },
    { name: "Laporan", href: "/admin/laporan", icon: FileText },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-cream/30 flex flex-col md:flex-row font-sans max-w-[100vw] overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-chocolate text-cream px-4 py-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-golden rounded-full flex items-center justify-center text-chocolate font-bold shadow-sm">
            <Power size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-golden">Seravicoo</h1>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-cream/70 hover:text-red-400 transition-colors flex items-center gap-1 text-sm font-bold"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex inset-y-0 left-0 z-50 w-64 bg-chocolate text-cream flex-col shrink-0 relative">
        <div className="p-6 flex items-center gap-3 border-b border-light/10">
          <div className="w-8 h-8 bg-golden rounded-full flex items-center justify-center text-chocolate font-bold shadow-sm">
            <Power size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-golden">Seravicoo</h1>
            <p className="text-[10px] text-cream/70 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-golden text-chocolate font-bold shadow-sm"
                    : "text-cream/80 hover:bg-brownie hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-chocolate" : "text-caramel"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-light/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-cream/80 hover:bg-red-900/50 hover:text-red-400 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10 relative w-full md:pb-0 pb-20">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-caramel/20 shadow-xl rounded-2xl z-40 flex justify-around items-center p-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 p-2 w-full rounded-xl transition-all ${
                isActive ? "text-chocolate" : "text-caramel/60 hover:text-chocolate"
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? "bg-golden/30" : "bg-transparent"}`}>
                <item.icon size={22} className={isActive ? "text-chocolate" : "text-caramel/70"} />
              </div>
              <span className={`text-[10px] whitespace-nowrap ${isActive ? "font-bold" : "font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
