"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Cookie, ShoppingBag, FileText, LogOut, Power, Menu, X } from "lucide-react";
import { logoutAdmin } from "@/app/actions/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Menu / Produk", href: "/admin/produk", icon: Cookie },
    { name: "Pesanan", href: "/admin/pesanan", icon: ShoppingBag },
    { name: "Laporan Batch", href: "/admin/laporan", icon: FileText },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-cream/30 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-chocolate text-cream p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-golden rounded-full flex items-center justify-center text-chocolate font-bold shadow-sm">
            <Power size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-golden">Seravicoo</h1>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-cream hover:text-golden transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-chocolate text-cream flex flex-col shrink-0 
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-light/10">
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
      <main className="flex-1 overflow-auto bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10 relative w-full">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
