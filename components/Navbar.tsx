"use client";

import BubbleMenu from "./BubbleMenu";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  
  const items = [
    {
      label: 'Home',
      href: '/',
      rotation: -5,
      hoverStyles: { bgColor: '#E2AD5F', textColor: '#4A2211' }
    },
    {
      label: 'Katalog',
      href: '/katalog',
      rotation: 5,
      hoverStyles: { bgColor: '#713F29', textColor: '#F6E6D3' }
    },
    {
      label: 'Instagram',
      href: '#',
      rotation: -5,
      hoverStyles: { bgColor: '#AE6840', textColor: '#F6E6D3' }
    }
  ];

  const logo = (
    <a href="/" className="font-bold text-xl text-[#4A2211] tracking-tight flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-[#E2AD5F] flex items-center justify-center text-[#4A2211] shadow-sm">
        S
      </div>
      <span className="hidden sm:block">Seravicoo</span>
    </a>
  );

  return (
    <div className="relative z-[1001]">
      <BubbleMenu 
        logo={logo}
        items={items}
        menuBg="#F6E6D3"
        menuContentColor="#4A2211"
        useFixedPosition={true}
      />
    </div>
  );
}
