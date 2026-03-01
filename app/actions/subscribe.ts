"use server";

import prisma from "@/lib/prisma";

export async function subscribeToNewsletter(email: string) {
  try {
    await prisma.subscriber.create({
      data: { email }
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { success: true, message: "Email sudah terdaftar." };
    }
    return { success: false, message: "Gagal mendaftar. Silakan coba lagi nanti." };
  }
}
