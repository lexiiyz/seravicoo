"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
type OrderStatus = "PENDING" | "PAID" | "BAKING" | "DELIVERED" | "CANCELLED";

async function verifyAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    throw new Error("Unauthorized");
  }
}

export async function createOrder(data: {
  batchId: string;
  customerName: string;
  customerWa: string;
  items: { productId: string; quantity: number; price: number }[];
}) {
  await verifyAdmin();

  const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await prisma.order.create({
    data: {
      batchId: data.batchId,
      customerName: data.customerName,
      customerWa: data.customerWa,
      totalAmount,
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }))
      }
    }
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await verifyAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
}

export async function deleteOrder(orderId: string) {
  await verifyAdmin();

  await prisma.order.delete({
    where: { id: orderId }
  });
}
