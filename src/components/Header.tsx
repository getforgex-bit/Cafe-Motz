import React, { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { Coffee, Phone, MessageSquare, Menu as MenuIcon, X, Sparkles, SlidersHorizontal, Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { BRAND_INFO } from '../data/coffeeData';

interface HeaderProps {
  onOpenOrderModal?: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  isPlayingAmbient?: boolean;
  onToggleAmbient?: () => void;
  cartItemsCount?: number;
  onOpenCart?: () => void;
  onExploreMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrderModal,
  reducedMotion,
  onToggleReducedMotion,
  isPlayingAmbient = false,
  onToggleAmbient,
  cartItemsCount = 0,
  onOpenCart,
  onExploreMenu,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 40;
    setIsScrolled((prev) => (prev === next ? prev : next));
  });

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Historia', href: '#historia' },
    { name: 'Menú', href: '#menu' },
    { name: 'Combos', href: '#combos' },
    { name: 'Fidelidad', href: '#fidelidad' },
    { name: 'Ubicación y Horarios', href: '#ubicacion' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F9F5F0]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(61,35,20,0.06)] border-b border-[#EFE7DE] py-3'
          : 'bg-[#F9F5F0]/90 backdrop-blur-sm py-4 border-b border-[#EFE7DE]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#inicio" className="flex items-center gap-2 sm:gap-3 group shrink-0" id="brand-logo-link">
          <Coffee className="w-6 h-6 text-[#B85D36] transition-transform duration-200 ease-out group-hover:-rotate-6 motion-reduce:transform-none" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#3D2314] leading-none whitespace-nowrap">
              MOTZ CAFÉ
            </span>
            <span className="hidden min-[400px]:block font-serif italic text-xs text-ink-secondary mt-1 whitespace-nowrap">
              El sabor de nuestra tierra
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 xl:gap-7" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.href === '#menu' && onExploreMenu) {
                  e.preventDefault();
                  onExploreMenu();
                }
              }}
              className="whitespace-nowrap text-sm font-medium text-ink-secondary hover:text-[#3D2314] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B85D36] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Contact & CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {onToggleAmbient && (
            <button
              type="button"
              onClick={onToggleAmbient}
              aria-pressed={isPlayingAmbient}
              aria-label={isPlayingAmbient ? 'Pausar música de cafetería' : 'Reproducir música de cafetería'}
              title={isPlayingAmbient ? 'Pausar música de cafetería' : 'Escuchar música de cafetería'}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                isPlayingAmbient
                  ? 'bg-[#3D2314] text-white border-[#3D2314]'
                  : 'bg-[#FBF7F1] hover:bg-[#F4ECE1] text-ink-secondary hover:text-[#3D2314] border-[#EFE7DE]'
              }`}
              id="header-ambient-audio-toggle"
            >
              {isPlayingAmbient ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#EFE7DE] animate-pulse motion-reduce:animate-none" />
                  <span className="hidden xl:inline">Música: Activa</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-ink-secondary" />
                  <span className="hidden xl:inline">Música de Café</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleReducedMotion}
            title={reducedMotion ? 'Activar efectos cinemáticos de scroll' : 'Desactivar efectos de scroll (modo accesible)'}
            aria-pressed={reducedMotion}
            aria-label={reducedMotion ? 'Activar efectos cinemáticos de scroll' : 'Desactivar efectos de scroll (modo accesible)'}
            className="flex items-center gap-1.5 text-xs text-ink-secondary hover:text-[#3D2314] bg-[#FBF7F1] hover:bg-[#F4ECE1] border border-[#EFE7DE] px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
            id="reduced-motion-toggle"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B85D36]" />
            <span className="hidden xl:inline">{reducedMotion ? 'Scroll: Estático' : 'Scrollytelling'}</span>
          </button>

          <a
            href={`tel:${BRAND_INFO.phoneClean}`}
            className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-[#3D2314] hover:text-[#B85D36] transition-colors whitespace-nowrap tabular-nums"
            id="header-phone-link"
          >
            <Phone className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>{BRAND_INFO.phone}</span>
          </a>

          {/* Cart / Order button if items added */}
          {cartItemsCount > 0 && onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 bg-[#A24E2C] hover:bg-[#3D2314] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 ease-out cursor-pointer"
              id="header-cart-btn"
              title="Ver estado de pedido"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pedido</span>
              <span className="bg-[#FBF7F1] text-[#A24E2C] text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                {cartItemsCount}
              </span>
            </button>
          )}

          <a
            href={`https://wa.me/${BRAND_INFO.phoneClean}?text=${encodeURIComponent(
              '¡Hola Motz Café! Me gustaría consultar su menú y hacer un pedido.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#3D2314] hover:bg-[#B85D36] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none"
            id="header-whatsapp-cta"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Hacer Pedido / WhatsApp</span>
          </a>
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 md:hidden shrink-0">
          {cartItemsCount > 0 && onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="p-2 text-[#A24E2C] bg-[#F4ECE1] hover:bg-[#EFE7DE] rounded-lg transition-colors relative cursor-pointer before:content-[''] before:absolute before:-inset-1.5"
              title="Ver estado de pedido"
              id="header-cart-mobile-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-terracotta-cta text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            </button>
          )}
          {onToggleAmbient && (
            <button
              type="button"
              onClick={onToggleAmbient}
              aria-pressed={isPlayingAmbient}
              aria-label={isPlayingAmbient ? 'Pausar música de cafetería' : 'Reproducir música de cafetería'}
              className={`relative p-2 rounded-lg transition-colors cursor-pointer before:content-[''] before:absolute before:-inset-1.5 ${
                isPlayingAmbient ? 'text-[#3D2314] bg-[#F4ECE1]' : 'text-ink-secondary'
              }`}
              title={isPlayingAmbient ? 'Pausar música de cafetería' : 'Reproducir música de cafetería'}
            >
              {isPlayingAmbient ? (
                <Volume2 className="w-4 h-4 text-[#B85D36] animate-pulse motion-reduce:animate-none" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onToggleReducedMotion}
            className="relative p-2 text-ink-secondary rounded-lg before:content-[''] before:absolute before:-inset-1.5"
            title="Accesibilidad de scroll"
            aria-label={reducedMotion ? 'Activar efectos cinemáticos de scroll' : 'Desactivar efectos de scroll (modo accesible)'}
          >
            <Sparkles className={`w-4 h-4 ${reducedMotion ? 'text-ink-secondary' : 'text-[#B85D36]'}`} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            className="relative p-2 text-[#3D2314] hover:text-[#B85D36] rounded-lg transition-colors before:content-[''] before:absolute before:-inset-0.5"
            aria-label="Abrir menú"
            id="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F9F5F0] border-b border-[#EFE7DE] px-4 pt-3 pb-6 shadow-[0_16px_32px_rgba(61,35,20,0.12)] animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.href === '#menu' && onExploreMenu) {
                    e.preventDefault();
                    onExploreMenu();
                  }
                }}
                className="text-base font-medium text-[#3D2314] hover:text-[#B85D36] py-2 border-b border-[#EFE7DE]/50"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              {onToggleAmbient && (
                <button
                  type="button"
                  onClick={onToggleAmbient}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#EFE7DE] bg-[#FBF7F1] text-sm font-medium text-[#3D2314] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {isPlayingAmbient ? (
                      <Volume2 className="w-4 h-4 text-[#B85D36] animate-pulse motion-reduce:animate-none" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-ink-secondary" />
                    )}
                    <span>Ambiente Sonoro de Cafetería</span>
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isPlayingAmbient ? 'bg-[#3D2314] text-white' : 'bg-[#F4ECE1] text-ink-secondary'
                  }`}>
                    {isPlayingAmbient ? 'Activo' : 'Silencio'}
                  </span>
                </button>
              )}

              <a
                href={`tel:${BRAND_INFO.phoneClean}`}
                className="flex items-center gap-2 text-sm font-semibold text-[#3D2314]"
              >
                <Phone className="w-4 h-4 text-[#B85D36]" />
                <span>Llamar: {BRAND_INFO.phone}</span>
              </a>
              <a
                href={`https://wa.me/${BRAND_INFO.phoneClean}?text=${encodeURIComponent(
                  '¡Hola Motz Café! Me gustaría hacer un pedido desde su menú digital.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#3D2314] hover:bg-[#B85D36] text-white text-sm font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hacer Pedido / WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
