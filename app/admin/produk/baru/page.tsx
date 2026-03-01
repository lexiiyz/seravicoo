"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { createProduct } from "@/app/actions/product";

export default function TambahProduk() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi Kompresi Gambar Otomatis (Client-side)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Logika kompresi & resize
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Export ke WebP untuk ukuran sangat kecil tapi kualitas bagus (80% quality)
        const compressedBase64 = canvas.toDataURL("image/webp", 0.8);
        setPreview(compressedBase64);
        setError(""); // Clear error if success
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!preview) {
      setError("Foto produk wajib diisi.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formData.get("description") as string,
      price: parseInt(formData.get("price") as string),
      imageUrl: preview, // Kirim Base64 hasil kompresi ke database
      shopeeUrl: formData.get("shopeeUrl") as string,
      category: formData.get("category") as string,
      isAvailable: formData.get("isAvailable") === "on",
    };

    try {
      await createProduct(data);
      router.push("/admin/produk");
      router.refresh();
      // Tambahkan timeout logis untuk ngereset UI kalau transisinya butuh waktu
      setTimeout(() => setLoading(false), 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan produk.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk" className="w-10 h-10 flex items-center justify-center bg-white border border-chocolate/10 rounded-full text-chocolate hover:bg-golden transition-colors shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-1">Tambah Produk Baru</h1>
          <p className="text-sm text-caramel/90">Masukkan detail produk cookies atau brownies.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-chocolate/5 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Upload Foto Produk */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-chocolate">Foto Produk *</label>
            {!preview ? (
              <div 
                className="w-full h-48 border-2 border-dashed border-caramel/30 rounded-2xl bg-cream/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-cream/40 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="text-golden" size={40} />
                <span className="text-sm text-chocolate font-bold">Klik untuk upload foto</span>
                <span className="text-xs text-caramel">Otomatis di-compress. Max ukuran file bebas.</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-caramel/20 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={removeImage} 
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-transform hover:scale-105"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-chocolate">Nama Produk *</label>
              <input name="name" required type="text" placeholder="Misal: Red Velvet Cookies" className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-chocolate">Kategori *</label>
              <select name="category" required className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate">
                <option value="cookies">Cookies</option>
                <option value="brownies">Brownies</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-chocolate">Deskripsi *</label>
            <textarea name="description" required rows={3} placeholder="Deskripsi rasa dan bahan..." className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-chocolate">Harga (Rp) *</label>
              <input name="price" required type="number" min="0" placeholder="15000" className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-chocolate">URL Shopee</label>
              <input name="shopeeUrl" type="url" placeholder="https://shopee.co.id/..." className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50/50 border border-green-200 rounded-xl mt-2">
            <input type="checkbox" name="isAvailable" id="isAvailable" defaultChecked className="w-5 h-5 text-golden rounded border-caramel focus:ring-golden" />
            <label htmlFor="isAvailable" className="text-sm font-bold text-green-800">Tersedia untuk dijual saat ini</label>
          </div>

          <div className="flex justify-end pt-4 border-t border-light/20">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-golden hover:bg-brownie text-chocolate hover:text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
