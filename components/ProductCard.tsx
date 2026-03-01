import Image from 'next/image'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    isAvailable: boolean
  }
  isPreOrderOpen?: boolean
}

export default function ProductCard({ product, isPreOrderOpen = true }: ProductCardProps) {
  const waNumber = '62895805023940'
  const waMessage = `Halo Seravicoo, aku mau order *${product.name}* dong.`
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`
  const canBuy = product.isAvailable && isPreOrderOpen;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl shadow-sm border border-caramel/20 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Gambar Produk */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <Image
          src={product.imageUrl || "/hero-bg.webp"}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${!canBuy ? "grayscale opacity-80" : ""}`}
        />
        {/* Label Status Beli */}
        {!canBuy && (
          <div className="absolute top-4 right-4 bg-chocolate/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {!isPreOrderOpen ? "Coming Soon" : "Habis"}
          </div>
        )}
      </div>

      {/* Konten Text */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="text-xl font-bold text-chocolate leading-tight line-clamp-2">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-golden whitespace-nowrap">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
        </div>
        
        <p className="text-sm text-caramel/90 mb-6 flex-grow line-clamp-2">{product.description}</p>
        
        {/* Call to Action Button */}
        {canBuy ? (
          <a 
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-golden hover:bg-brownie text-chocolate hover:text-white font-bold rounded-xl transition-colors duration-300 text-center shadow-sm hover:shadow"
          >
            Pesan via WA
          </a>
        ) : (
          <button 
            disabled 
            className="w-full py-3 bg-caramel/20 text-caramel/70 font-semibold rounded-xl cursor-not-allowed border border-caramel/20"
          >
            {!isPreOrderOpen ? "Coming Soon" : "Habis"}
          </button>
        )}
      </div>
    </div>
  )
}
