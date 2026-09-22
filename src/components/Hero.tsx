import React from 'react';
import { Utensils, Bike, Coffee, Sparkles, Send, MapPin, Award, ArrowUpRight } from 'lucide-react';
import { MENU_ITEMS } from '../data/coffeeData';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenDelivery: () => void;
  onOrderSpecialty: () => void;
}

const specialty = MENU_ITEMS.find((item) => item.id === 'mazapan-latte');

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onOpenDelivery,
  onOrderSpecialty,
}) => {
  return (
    <section id="inicio" className="pt-24 pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-end">
          {/* Cover copy */}
          <div className="lg:col-span-7 lg:pb-10 flex flex-col items-start">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-ink-secondary mb-7">
              <MapPin className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
              <span>Café 100% chiapaneco, Motozintla</span>
            </p>

            <h1 className="font-serif text-[2.5rem] sm:text-6xl lg:text-[4.25rem] font-bold text-[#3D2314] leading-[1.08] tracking-tight max-w-[14ch] text-balance">
              El auténtico sabor de nuestra Sierra en cada taza.
            </h1>

            <p className="mt-7 text-base sm:text-lg text-ink-secondary leading-relaxed max-w-[52ch]">
              Elaboramos café de estricta altura, bebidas artesanales y repostería local que honran las tradiciones ancestrales y la riqueza natural de la Sierra Madre de Chiapas.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center gap-2.5 bg-[#3D2314] hover:bg-[#B85D36] text-white text-sm font-semibold px-6 py-3.5 rounded-lg shadow-[0_8px_24px_rgba(61,35,20,0.14)] transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer"
                id="hero-explore-menu-btn"
              >
                <Utensils className="w-4 h-4 text-[#EFE7DE]" aria-hidden="true" />
                <span>Explorar Menú Completo</span>
              </button>

              <button
                type="button"
                onClick={onOpenDelivery}
                className="inline-flex items-center justify-center gap-2 bg-[#FBF7F1] hover:bg-[#F4ECE1] text-[#3D2314] text-sm font-semibold px-6 py-3.5 rounded-lg border border-[#EFE7DE] transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer"
                id="hero-delivery-btn"
              >
                <Bike className="w-4 h-4 text-[#B85D36]" aria-hidden="true" />
                <span>Pedir a Domicilio</span>
                <span className="ml-1 font-serif text-sm font-bold text-terracotta-cta">+$20</span>
              </button>
            </div>

            {/* Service line: one editorial sentence instead of pill trio */}
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-secondary">
              <li className="inline-flex items-center gap-2">
                <Coffee className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                Servicio en barra y mesa
              </li>
              <li className="inline-flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                Envíos locales rápidos
              </li>
              <li className="inline-flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                Productores de altura
              </li>
            </ul>
          </div>

          {/* Cover image + margin notes */}
          <div className="lg:col-span-5 lg:-mr-10 xl:-mr-16">
            <div className="relative rounded-2xl overflow-hidden bg-[#F4ECE1] shadow-[0_16px_36px_rgba(61,35,20,0.12)]">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
                alt="Taza de café artesanal de Motz Café con pan casero y granos"
                className="w-full aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 sm:gap-x-8 items-start">
              {/* Altitude figure */}
              <div className="pr-5 sm:pr-8 border-r border-[#EFE7DE]">
                <span className="block font-serif text-4xl font-bold text-[#3D2314] leading-none tabular-nums">
                  1,450
                </span>
                <span className="mt-2 block text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                  msnm
                </span>
                <span className="mt-1 block text-xs text-ink-secondary">
                  Típica & Borbón
                </span>
              </div>

              {/* House specialty margin note */}
              <button
                type="button"
                onClick={onOrderSpecialty}
                className="group text-left cursor-pointer rounded-lg"
                id="hero-specialty-card"
              >
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-terracotta-cta">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  Especialidad de la casa
                </span>
                <span className="mt-1.5 block font-serif text-lg font-bold text-[#3D2314] leading-snug group-hover:text-[#B85D36] transition-colors duration-200">
                  Mazapán Latte & Pan Casero
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-ink-secondary group-hover:text-[#3D2314] transition-colors duration-200">
                  {specialty?.priceLarge ? `Grande, $${specialty.priceLarge} MXN` : 'Pedir ahora'}
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
