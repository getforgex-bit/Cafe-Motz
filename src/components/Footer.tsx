import React from 'react';
import { Coffee, MapPin, Phone, MessageSquare, Heart } from 'lucide-react';
import { BRAND_INFO } from '../data/coffeeData';

const NAV = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#historia', label: 'Nuestra Historia & Terroir' },
  { href: '#menu', label: 'Menú Artesanal' },
  { href: '#combos', label: 'Combos & Promociones' },
  { href: '#fidelidad', label: 'Programa de Lealtad VIP' },
  { href: '#ubicacion', label: 'Ubicación & Horarios' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3D2314] text-[#F9F5F0] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-[#F9F5F0]/15">
          {/* Masthead */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-3 font-serif text-3xl font-bold tracking-tight text-[#FBF7F1]">
              <Coffee className="w-6 h-6 text-[#E9BDA7]" aria-hidden="true" />
              MOTZ CAFÉ
            </span>
            <p className="mt-6 font-serif italic text-2xl text-[#E9BDA7] leading-snug">
              &ldquo;{BRAND_INFO.tagline}&rdquo;
            </p>
            <p className="mt-5 text-sm text-[#DCCBBE] leading-relaxed max-w-sm">
              Café de estricta altura cultivado en la Sierra Madre de Chiapas. Fundado con orgullo por estudiantes del TecNM Campus Frontera Comalapa, Unidad Motozintla.
            </p>
          </div>

          {/* Navigation */}
          <nav className="lg:col-span-3" aria-label="Navegación del pie de página">
            <span className="block text-[10px] uppercase tracking-[0.18em] font-bold text-[#E9BDA7] mb-3">
              Navegación
            </span>
            <ul className="text-sm text-[#DCCBBE]">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center min-h-[40px] hover:text-[#FBF7F1] underline-offset-4 hover:underline decoration-[#B85D36] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Branch */}
          <div className="lg:col-span-4">
            <span className="block text-[10px] uppercase tracking-[0.18em] font-bold text-[#E9BDA7] mb-3">
              Sucursal Central
            </span>
            <p className="text-sm text-[#DCCBBE] leading-relaxed flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#E9BDA7] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{BRAND_INFO.address}</span>
            </p>
            <p className="mt-4 text-sm text-[#DCCBBE] flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#E9BDA7] shrink-0" aria-hidden="true" />
              <span>
                Pedidos: <span className="font-serif text-lg font-bold text-[#FBF7F1] tabular-nums">{BRAND_INFO.phone}</span>
              </span>
            </p>
            <a
              href={`https://wa.me/${BRAND_INFO.phoneClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 min-h-[44px] bg-[#A24E2C] hover:bg-[#B85D36] text-white text-sm font-semibold px-5 rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CDB9AA]">
          <p>
            © {BRAND_INFO.foundedYear} {BRAND_INFO.name}. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Hecho con amor serrano en Motozintla, Chiapas</span>
            <Heart className="w-3 h-3 text-[#E9BDA7] fill-[#E9BDA7]" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
};
