"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    throw new Error("Unauthorized");
  }
}

export async function createBatch(data: { name: string, startDate: Date, endDate: Date }) {
  await verifyAdmin();
  
  await prisma.batch.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      isOpen: true,
    }
  });
}

export async function closeBatch(id: string) {
  await verifyAdmin();
  
  await prisma.batch.update({
    where: { id },
    data: { isOpen: false },
  });
}
