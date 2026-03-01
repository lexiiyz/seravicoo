"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/order";
import { Save, Plus, Trash2 } from "lucide-react";

export default function OrderForm({ 
  batches, 
  products 
}: { 
  batches: { id: string, name: string }[], 
  products: { id: string, name: string, price: number }[] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [batchId, setBatchId] = useState(batches[0]?.id || "");
  const [customerName, setCustomerName] = useState("");
  const [customerWa, setCustomerWa] = useState("");
  
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: "productId" | "quantity", value: string | number) => {
    const newItems = [...items];
    if (field === "quantity") {
      newItems[index].quantity = value as number;
    } else {
      newItems[index].productId = value as string;
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate items
    if (items.some(item => !item.productId || item.quantity < 1)) {
      setError("Pilih produk dan pastikan jumlah lebih dari 0 untuk setiap pesanan.");
      setLoading(false);
      return;
    }

    const orderData = {
      batchId,
      customerName,
      customerWa,
      items: items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product ? product.price : 0
        };
      })
    };

    try {
      await createOrder(orderData);
      router.push("/admin/pesanan");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan pesanan.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Customer Info */}
      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-lg text-chocolate border-b border-light/20 pb-2">Informasi Pemesanan</h3>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-chocolate">Pilih Batch PO *</label>
          <select 
            value={batchId} 
            onChange={e => setBatchId(e.target.value)}
            required 
            className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate font-medium"
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-chocolate">Nama Pelanggan *</label>
            <input 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)}
              required 
              type="text" 
              placeholder="Ex: Raditya" 
              className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-chocolate">Nomor WhatsApp *</label>
            <input 
              value={customerWa} 
              onChange={e => setCustomerWa(e.target.value)}
              required 
              type="tel" 
              placeholder="081234567890" 
              className="px-4 py-3 bg-cream/30 border border-caramel/30 rounded-xl focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-chocolate" 
            />
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-light/20 pb-2">
          <h3 className="font-bold text-lg text-chocolate">Detail Pesanan</h3>
          <button 
            type="button" 
            onClick={addItem}
            className="flex items-center gap-1 text-sm bg-golden/20 text-chocolate hover:bg-golden px-3 py-1.5 rounded-lg transition-colors font-bold"
          >
            <Plus size={16} /> Tambah Menu
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-center bg-cream/20 p-4 rounded-xl border border-caramel/20">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs font-bold text-caramel">Pilih Menu</label>
                <select 
                  value={item.productId}
                  onChange={e => updateItem(index, 'productId', e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-caramel/30 rounded-md focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-sm"
                >
                  <option value="" disabled>-- Pilih Kue / Brownies --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-24 flex flex-col gap-1">
                <label className="text-xs font-bold text-caramel">Jumlah</label>
                <input 
                  type="number" 
                  min="1" 
                  required
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-caramel/30 rounded-md focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden text-sm text-center font-bold"
                />
              </div>

              <div className="pt-5">
                <button 
                  type="button" 
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="p-2 text-caramel hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:hover:text-caramel disabled:hover:bg-transparent"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Display */}
        <div className="flex justify-between items-center p-6 bg-chocolate text-cream rounded-xl mt-4 border border-chocolate shadow-lg">
          <span className="font-bold text-lg">Total Pembayaran</span>
          <span className="font-black text-2xl text-golden">Rp {calculateTotal().toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-light/20">
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-golden hover:bg-brownie text-chocolate hover:text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? "Menyimpan..." : "Simpan Pesanan"}
        </button>
      </div>
    </form>
  );
}
