"use client";

import Link from 'next/link'
import { Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/subscribe'

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setStatus('loading');
    setMessage('');
    
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setStatus('success');
        setMessage(result.message || '');
      } else {
        setStatus('error');
        setMessage(result.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Gagal menghubungi server');
    } finally {
      setIsLoading(false);
    }
  };

  if (pathname.startsWith("/admin")) return null;

  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-chocolate text-cream mt-auto border-t-[6px] border-golden relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brownie/40 blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-golden flex items-center justify-center text-chocolate font-bold shadow-sm">
                S
              </div>
              <span className="font-bold text-2xl text-golden tracking-tight">
                Seravicoo
              </span>
            </div>
            <p className="text-cream/80 leading-relaxed mb-6">
              Sweet things, made slowly. Kami memanggang kebahagiaan setiap hari melalui cookies renyah dan brownies fudgy berkualitas premium.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/seravicoo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brownie flex items-center justify-center text-golden hover:bg-golden hover:text-chocolate transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:seravicoo@gmail.com" className="w-10 h-10 rounded-full bg-brownie flex items-center justify-center text-golden hover:bg-golden hover:text-chocolate transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-golden mb-6 uppercase tracking-wider text-sm">Navigasi</h3>
            <ul className="flex flex-col gap-4 text-cream/80">
              <li>
                <Link href="/" className="hover:text-golden transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel"></span>
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-golden transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel"></span>
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/#best-sellers" className="hover:text-golden transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel"></span>
                  Promo Spesial
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-golden transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel"></span>
                  Tanya Jawab (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-golden mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h3>
            <ul className="flex flex-col gap-5 text-cream/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-caramel shrink-0 mt-0.5" />
                <span>Jl. Talang Barat II no 10c<br/>Semarang, 50232</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-caramel shrink-0" />
                <span>+62 895-8050-23940</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-caramel shrink-0 mt-0.5" />
                <span>Setiap Hari<br/>09:00 - 21:00 WIB</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-golden mb-6 uppercase tracking-wider text-sm">Berlangganan</h3>
            <p className="text-cream/80 mb-4">
              Dapatkan info promo exclusive dan varian rasa terbaru langsung di inbox-mu!
            </p>
            {status === 'success' ? (
              <div className="bg-green-100/10 border border-green-500/50 rounded-lg p-4 text-green-400 text-sm">
                Terima kasih telah berlangganan! Cek inbox-mu (atau folder spam) untuk info terbaru kami.
              </div>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alamat Email" 
                  className="w-full px-4 py-3 rounded-lg bg-brownie/50 border border-caramel/30 text-cream placeholder:text-cream/40 focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden transition-all disabled:opacity-50"
                  required
                  disabled={isLoading}
                />
                
                {status === 'error' && (
                  <p className="text-red-400 text-xs">{message}</p>
                )}
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-golden hover:bg-cream text-chocolate font-bold rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                </button>
              </form>
            )}
          </div>

        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-brownie py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-sm text-cream/50">
            © {currentYear} Seravicoo Cookies & Brownies. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-cream/50">
            <Link href="/privacy" className="hover:text-golden transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-golden transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
