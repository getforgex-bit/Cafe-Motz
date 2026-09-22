/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Scrollytelling } from './components/Scrollytelling';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { MenuSection } from './components/MenuSection';
import { CombosSection } from './components/CombosSection';
import { OrderModesAndLoyalty } from './components/OrderModesAndLoyalty';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { OrderDrawer } from './components/OrderDrawer';
import { OrderStatusWidget } from './components/OrderStatusWidget';
import { AmbientAudio } from './components/AmbientAudio';
import { MenuItem, ComboItem, OrderType, CartItem } from './types';
import { MENU_ITEMS, BRAND_INFO } from './data/coffeeData';
import { soundscape, SoundscapeType } from './utils/soundscapeEngine';
import { cinematicScrollToMenu } from './utils/cinematicScroll';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | ComboItem | null>(null);
  const [initialSize, setInitialSize] = useState<'small' | 'large'>('small');
  const [initialOrderType, setInitialOrderType] = useState<OrderType>('local');

  // Multi-item cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('motz_cafe_cart');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('motz_cafe_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error(e);
      }
    }
  }, [cartItems]);

  const totalCartItems = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) =>
          it.productId === item.productId &&
          it.size === item.size &&
          it.milk === item.milk &&
          it.extraShot === item.extraShot &&
          it.whippedCream === item.whippedCream
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        return next;
      }

      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter((it): it is CartItem => it !== null);
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleQuickAddMenuItem = (item: MenuItem) => {
    const newItem: CartItem = {
      id: `${item.id}-small-entera-${Date.now()}`,
      productId: item.id,
      name: item.name,
      category: item.category,
      size: item.priceLarge ? 'small' : undefined,
      sizeLabel: item.priceLarge ? 'Chico (300ml)' : undefined,
      milk: ['calientes', 'frios'].includes(item.category) ? 'entera' : undefined,
      unitPrice: item.priceSmall,
      quantity: 1,
      image: item.image,
    };
    handleAddToCart(newItem);
  };

  const handleQuickAddCombo = (combo: ComboItem) => {
    const newItem: CartItem = {
      id: `combo-${combo.id}-${Date.now()}`,
      productId: combo.id,
      name: combo.title,
      unitPrice: combo.price,
      quantity: 1,
      isCombo: true,
    };
    handleAddToCart(newItem);
  };

  // Ambient soundscape & lo-fi music audio state (muted by default for accessibility & browser standards)
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.65);
  const [ambientPreset, setAmbientPreset] = useState<SoundscapeType>('coffee-shop');

  const handleToggleAmbient = async () => {
    if (isPlayingAmbient) {
      soundscape.stop();
      setIsPlayingAmbient(false);
    } else {
      await soundscape.start(ambientPreset, ambientVolume);
      setIsPlayingAmbient(true);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    soundscape.setVolume(vol);
  };

  const handlePresetChange = async (preset: SoundscapeType) => {
    setAmbientPreset(preset);
    await soundscape.setPreset(preset);
  };

  // Safe cleanup on unmount
  useEffect(() => {
    return () => {
      soundscape.stop();
    };
  }, []);

  const handleOpenProductOrder = (item: MenuItem, size: 'small' | 'large' = 'small') => {
    setSelectedProduct(item);
    setInitialSize(size);
    setInitialOrderType('local');
    setIsOrderDrawerOpen(true);
  };

  const handleOpenComboOrder = (combo: ComboItem) => {
    setSelectedProduct(combo);
    setInitialSize('small');
    setInitialOrderType('local');
    setIsOrderDrawerOpen(true);
  };

  const handleOrderSpecialty = () => {
    const specialty = MENU_ITEMS.find((item) => item.id === 'mazapan-latte') || MENU_ITEMS[0];
    setSelectedProduct(specialty);
    setInitialSize('large');
    setInitialOrderType('local');
    setIsOrderDrawerOpen(true);
  };

  const handleOpenDelivery = () => {
    const houseItem = MENU_ITEMS[0];
    setSelectedProduct(houseItem);
    setInitialSize('small');
    setInitialOrderType('domicilio');
    setIsOrderDrawerOpen(true);
  };

  const scrollToMenu = () => {
    cinematicScrollToMenu({
      headerOffset: 75,
      reducedMotion,
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-ink-secondary selection:bg-[#B85D36] selection:text-white relative">
      {/* Editorial Navigation Header */}
      <Header
        onOpenOrderModal={() => handleOpenProductOrder(MENU_ITEMS[0])}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        isPlayingAmbient={isPlayingAmbient}
        onToggleAmbient={handleToggleAmbient}
        cartItemsCount={totalCartItems}
        onOpenCart={() => {
          setSelectedProduct(null);
          setIsOrderDrawerOpen(true);
        }}
        onExploreMenu={scrollToMenu}
      />

      <main>
        {/* Scrollytelling 5-Scene Immersive Experience */}
        <Scrollytelling
          reducedMotion={reducedMotion}
          onExploreMenu={scrollToMenu}
        />

        {/* Hero Section matching reference image */}
        <Hero
          onExploreMenu={scrollToMenu}
          onOpenDelivery={handleOpenDelivery}
          onOrderSpecialty={handleOrderSpecialty}
        />

        {/* Nuestra Historia & Terroir & Core Values */}
        <StorySection reducedMotion={reducedMotion} />

        {/* CARTA DE ESPECIALIDAD: Menu Section with category tabs */}
        <MenuSection
          onSelectItem={handleOpenProductOrder}
          onQuickAdd={handleQuickAddMenuItem}
          reducedMotion={reducedMotion}
        />

        {/* AHORRO Y SABOR: Combos Section */}
        <CombosSection
          onSelectCombo={handleOpenComboOrder}
          onQuickAddCombo={handleQuickAddCombo}
        />

        {/* Modalidades de Pedido & Programa de Lealtad VIP */}
        <OrderModesAndLoyalty />

        {/* VISÍTANOS: Ubicación y Horarios con mapa del Parque Central */}
        <LocationHours />
      </main>

      {/* Footer */}
      <Footer />

      {/* Real-Time 'Estado de Pedido' Corner Floating Widget */}
      <OrderStatusWidget
        cartItems={cartItems}
        onOpenOrderDrawer={() => {
          setSelectedProduct(null);
          setIsOrderDrawerOpen(true);
        }}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        reducedMotion={reducedMotion}
      />

      {/* Interactive Order Customization Drawer */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        selectedProduct={selectedProduct}
        initialSize={initialSize}
        initialOrderType={initialOrderType}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateCartQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveItem}
        onClearCart={handleClearCart}
        onExploreMenu={scrollToMenu}
      />

      {/* Accessible Coffee Shop Ambient Audio Controller */}
      <AmbientAudio
        isPlaying={isPlayingAmbient}
        onTogglePlay={handleToggleAmbient}
        volume={ambientVolume}
        onVolumeChange={handleVolumeChange}
        currentPreset={ambientPreset}
        onPresetChange={handlePresetChange}
        hasActiveCart={totalCartItems > 0}
      />

      {/* Floating Quick WhatsApp Action Button */}
      <a
        href={`https://wa.me/${BRAND_INFO.phoneClean}?text=${encodeURIComponent(
          '¡Hola Motz Café! Me gustaría hacer un pedido desde el menú.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed z-40 bg-[#3D2314] hover:bg-[#B85D36] text-white p-3.5 rounded-full shadow-[0_10px_24px_rgba(61,35,20,0.25)] border border-white/20 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group ${
          totalCartItems > 0
            ? 'hidden sm:flex sm:bottom-24 sm:right-6'
            : 'bottom-4 right-3 sm:bottom-5 sm:right-6'
        }`}
        aria-label="Pedir por WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold pl-0 group-hover:pl-2">
          Pedir por WhatsApp
        </span>
      </a>
    </div>
  );
}
