"use client";

type OrderStatus = "PENDING" | "PAID" | "BAKING" | "DELIVERED" | "CANCELLED";
import { updateOrderStatus } from "@/app/actions/order";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-blue-100 text-blue-800 border-blue-200",
  BAKING: "bg-orange-100 text-orange-800 border-orange-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      disabled={isPending}
      defaultValue={currentStatus}
      onChange={(e) => {
        startTransition(async () => {
          await updateOrderStatus(orderId, e.target.value as OrderStatus);
          router.refresh();
        });
      }}
      className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer appearance-none text-center outline-none ${
        statusColors[currentStatus]
      } ${isPending ? "opacity-50" : ""}`}
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="BAKING">BAKING</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}
