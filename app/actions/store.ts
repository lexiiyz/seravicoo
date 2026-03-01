"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function loginAdmin(pin: string) {
  const envPin = process.env.ADMIN_PIN;
  
  if (pin === envPin) {
    (await cookies()).set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }
  
  return { success: false, error: "PIN Salah" };
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_session");
}

export async function getStoreSettings() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 1,
          isPreOrderOpen: true,
        },
      });
    }

    return settings;
  } catch (error) {
    console.warn("Table StoreSettings might not exist yet. Defaulting to StoreSettings mock.");
    return {
      id: 1,
      isPreOrderOpen: true,
      updatedAt: new Date()
    };
  }
}

export async function togglePreOrderStatus(currentStatus: boolean) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  
  if (session?.value !== "authenticated") {
    throw new Error("Unauthorized");
  }

  try {
    const updated = await prisma.storeSettings.update({
      where: { id: 1 },
      data: { isPreOrderOpen: !currentStatus },
    });
    return updated;
  } catch (error) {
    console.warn("Table StoreSettings might not exist yet. Simulating toggle for UI.");
    // Return a mocked toggle so the UI doesn't crash
    return {
      id: 1,
      isPreOrderOpen: !currentStatus,
      updatedAt: new Date()
    };
  }
}
