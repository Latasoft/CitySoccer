'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/95 shadow-lg border-b border-[#e5e7eb] fixed w-full z-50 top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo e identidad */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Logo City Soccer"
              width={70}
              height={50}
              className="rounded-full border-1 border-[#57AA32] shadow"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-2xl text-[#222]">City Soccer</span>
            </div>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex gap-7 items-center font-medium">
            <Link href="/" className="text-[#222] hover:text-[#57AA32] transition">Inicio</Link>
            <Link href="/quienessomos" className="text-[#222] hover:text-[#57AA32] transition">Quienes somos</Link>
            
            {/* Dropdown Servicios */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-[#222] hover:text-[#57AA32] transition">
                Servicios
                <svg className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#e5e7eb] py-2 transition-all duration-200 ${servicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link href="/arriendos-f7" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Arriendos Fútbol 7
                </Link>
                <Link href="/arriendos-f9" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Arriendos Fútbol 9
                </Link>
                <Link href="/arriendos-pickleball" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Arriendos Pickleball
                </Link>
                <div className="border-t border-[#e5e7eb] my-1"></div>
                <Link href="/clases-particulares-futbol" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Clases particulares Fútbol
                </Link>
                <Link href="/clases-particulares-pickleball" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Clases particulares Pickleball
                </Link>
                <div className="border-t border-[#e5e7eb] my-1"></div>
                <Link href="/academia-futbol" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Academia de Fútbol
                </Link>
                <Link href="/academia-pickleball" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Academia de Pickleball
                </Link>
                <div className="border-t border-[#e5e7eb] my-1"></div>
                <Link href="/summer-camp" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Summer Camp
                </Link>
                <Link href="/eventos" className="block px-4 py-2 text-[#222] hover:bg-[#f8f9fa] hover:text-[#57AA32] transition">
                  Eventos
                </Link>
              </div>
            </div>

            <Link href="/conocenos" className="text-[#222] hover:text-[#57AA32] transition">Conocenos</Link>
            <Link href="/alianzas" className="text-[#222] hover:text-[#57AA32] transition">Alianzas</Link>
            <a href="https://instagram.com/citysoccer" target="_blank" rel="noopener noreferrer" className="text-[#222] hover:text-[#57AA32] transition">
              Social Media
            </a>
            <Link href="/contacto" className="text-[#222] hover:text-[#57AA32] transition">Contacto</Link>
            

            <a
              href="/login"
              className="ml-2 px-4 py-2 bg-[#57AA32] text-white font-bold rounded-lg shadow hover:bg-[#449325] transition"
            >
              Log In
            </a>
          </div>
          
          {/* Hamburger */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <svg className="w-8 h-8" fill="none" stroke="#57AA32" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        
        {/* Mobile menu */}
        <aside
          className={`fixed top-0 right-0 h-full w-72 bg-white/95 text-[#3B3F44] z-50 shadow-xl transform transition-transform duration-300 md:hidden
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#D0D1D4]">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Image
                src="/Logo.png"
                alt="Logo City Soccer"
                width={36}
                height={36}
                className="rounded-full border-2 border-[#57AA32]"
              />
              <span className="font-bold text-lg text-[#3B3F44]">City Soccer</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="text-[#3B3F44] hover:text-[#57AA32] transition"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-2 p-4 font-medium">
            <Link href="/" className="block px-3 py-2 rounded hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
              Inicio
            </Link>
            <Link href="/quienessomos" className="block px-3 py-2 rounded hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
              Quienes somos
            </Link>
            
            {/* Mobile Services Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-[#D0D1D4] hover:text-[#57AA32] text-left"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                Servicios
                <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Link href="/arriendos-f7" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Arriendos Fútbol 7
                </Link>
                <Link href="/arriendos-f9" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Arriendos Fútbol 9
                </Link>
                <Link href="/arriendos-pickleball" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Arriendos Pickleball
                </Link>
                <Link href="/clases-particulares-futbol" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Clases particulares Fútbol
                </Link>
                <Link href="/clases-particulares-pickleball" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Clases particulares Pickleball
                </Link>
                <Link href="/academia-futbol" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Academia de Fútbol
                </Link>
                <Link href="/academia-pickleball" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Academia de Pickleball
                </Link>
                <Link href="/summer-camp" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Summer Camp
                </Link>
                <Link href="/eventos" className="block px-3 py-2 rounded text-sm hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
                  Eventos
                </Link>
              </div>
            </div>

            <Link href="/conocenos" className="block px-3 py-2 rounded hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
              Conocenos
            </Link>
            <Link href="/alianzas" className="block px-3 py-2 rounded hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
              Alianzas
            </Link>
            <a href="https://instagram.com/citysoccer" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded hover:bg-[#D0D1D4] hover:text-[#57AA32]">
              Social Media
            </a>
            <Link href="/contacto" className="block px-3 py-2 rounded hover:bg-[#D0D1D4] hover:text-[#57AA32]" onClick={() => setOpen(false)}>
              Contacto
            </Link>
            
          
            <a
              href="/login"
              className="mt-2 px-4 py-2 bg-[#57AA32] text-white font-bold rounded-lg shadow hover:bg-[#449325] transition text-center"
            >
              Log In
            </a>
          </nav>
        </aside>
      </nav>
      
      {/* Spacer para compensar el navbar fixed */}
      <div className="h-[90px]"></div>
    </>
  );
}