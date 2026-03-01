"use client";

import AdminLayout from "@/components/AdminLayout";
import { usePathname } from "next/navigation";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // The login page doesn't need the sidebar
  if (pathname === "/admin") {
    return <>{children}</>;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}
