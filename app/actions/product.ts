"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    throw new Error("Unauthorized");
  }
}

export async function toggleProductAvailability(id: string, currentStatus: boolean) {
  await verifyAdmin();
  
  await prisma.product.update({
    where: { id },
    data: { isAvailable: !currentStatus },
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  shopeeUrl?: string;
  category: string;
  isAvailable: boolean;
}) {
  await verifyAdmin();
  
  await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      shopeeUrl: data.shopeeUrl || "",
      category: data.category,
      isAvailable: data.isAvailable,
    }
  });
}

export async function deleteProduct(id: string) {
  await verifyAdmin();
  
  await prisma.product.delete({
    where: { id },
  });
}
