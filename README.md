# Seravicoo - Cookies & Brownies 🍪

Seravicoo is a modern, blazing-fast web application and Content Management System (CMS) built for a premium homemade cookies and brownies business. It serves as both a beautiful customer-facing landing page and a robust backend for managing Pre-Order (PO) batches, catalogs, and WhatsApp orders.

## Features

### 🛒 Customer Facing

- **Dynamic Catalog**: Browse available premium cookies and fudgy brownies.
- **Pre-Order (PO) Status**: Real-time indication if PO is currently OPEN or CLOSED.
- **WhatsApp Integration**: Seamlessly direct customers to WhatsApp to place their customized orders.
- **Newsletter**: A functional subscription form to capture customer emails.
- **Sleek Aesthetic**: A buttery, warm, chocolate-and-cream-themed modern UI.

### 🔐 Admin Dashboard (CMS & OMS)

- **Protected Access**: Route protection using simple PIN-based authentication.
- **Batch Management (Laporan)**: Open and close PO periods. Automatically tally up all incoming orders into a single printable "Baking Recap" to optimize kitchen production.
- **Product Management (Produk)**: Add, edit, delete, and instantly toggle availability (`isAvailable`) of menu items for specific PO batches.
- **Order Tracking (Pesanan)**: Input manual orders received from WhatsApp directly into the system. It automatically calculates total pricing and allows tracking from `PENDING` -> `BAKING` -> `DELIVERED`.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (or any PostgreSQL database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/seravicoo-web.git
   cd seravicoo-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your database and admin credentials:

   ```env
   # Admin Dashboard PIN
   ADMIN_PIN=123456

   # Supabase Connection Strings
   DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```

4. Push the Database Schema:
   Sync the Prisma schema to your Supabase project:

   ```bash
   npx prisma db push
   ```

5. Start the Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Accessing the Admin Dashboard

Navigate to `http://localhost:3000/admin` to access the CMS.
Enter the `ADMIN_PIN` configured in your `.env` file.
