const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function main() {
  await client.connect();
  console.log('Connected to DB');

  const products = [
    {
      id: 'prod_1',
      name: 'Fudgy Brownies Classic',
      slug: 'fudgy-brownies-classic',
      description: 'Brownies panggang dengan tekstur fudgy yang lumer di mulut. Menggunakan dark chocolate premium 70%.',
      price: 65000,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: true,
    },
    {
      id: 'prod_2',
      name: 'Choco Chip Cookies (Isi 6)',
      slug: 'choco-chip-cookies',
      description: 'Cookies klasik renyah di luar, lembut di dalam dengan taburan choco chip Belgian yang melimpah.',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: true,
    },
    {
      id: 'prod_3',
      name: 'Matcha White Choco Cookies',
      slug: 'matcha-white-choco-cookies',
      description: 'Perpaduan sempurna antara pahitnya matcha bubuk Uji dan manisnya white chocolate chunk yang creamy.',
      price: 55000,
      imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a881fb8030b?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: false,
    },
    {
      id: 'prod_4',
      name: 'Brownies Cream Cheese',
      slug: 'brownies-cream-cheese',
      description: 'Fudgy brownies dengan pusaran mascarpone cream cheese murni yang gurih. Balance sempurna!',
      price: 85000,
      imageUrl: 'https://plus.unsplash.com/premium_photo-1663127027787-8fbafcefc549?q=80&w=800&auto=format&fit=crop',
      shopeeUrl: 'https://shopee.co.id',
      isAvailable: true,
    }
  ];

  for (const p of products) {
    const query = `
      INSERT INTO "Product" (id, name, slug, description, price, "imageUrl", "shopeeUrl", "isAvailable", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        description = EXCLUDED.description,
        "isAvailable" = EXCLUDED."isAvailable",
        "updatedAt" = NOW();
    `;
    const values = [p.id, p.name, p.slug, p.description, p.price, p.imageUrl, p.shopeeUrl, p.isAvailable];
    await client.query(query, values);
    console.log(`Inserted/Updated ${p.name}`);
  }

  console.log('Seeding finished!');
  await client.end();
}

main().catch(console.error);
