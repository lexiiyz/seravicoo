const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Buat data produk testing
  const products = [
    {
      name: 'Fudgy Brownies Classic',
      slug: 'fudgy-brownies-classic',
      description: 'Brownies panggang dengan tekstur fudgy yang lumer di mulut. Menggunakan dark chocolate premium 70%.',
      price: 65000,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: true,
    },
    {
      name: 'Choco Chip Cookies (Isi 6)',
      slug: 'choco-chip-cookies',
      description: 'Cookies klasik renyah di luar, lembut di dalam dengan taburan choco chip Belgian yang melimpah.',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: true,
    },
    {
      name: 'Matcha White Choco Cookies',
      slug: 'matcha-white-choco-cookies',
      description: 'Perpaduan sempurna antara pahitnya matcha bubuk Uji dan manisnya white chocolate chunk yang creamy.',
      price: 55000,
      imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a881fb8030b?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: false, // Contoh produk habis
    },
    {
      name: 'Brownies Cream Cheese',
      slug: 'brownies-cream-cheese',
      description: 'Fudgy brownies dengan pusaran mascarpone cream cheese murni yang gurih. Balance sempurna!',
      price: 85000,
      imageUrl: 'https://plus.unsplash.com/premium_photo-1663127027787-8fbafcefc549?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: true,
    }
  ]

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
    console.log(`Created product with id: ${product.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
