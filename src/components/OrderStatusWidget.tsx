import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ChevronUp, ChevronDown, Plus, Minus, Trash2, ArrowRight, Sparkles, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface OrderStatusWidgetProps {
  cartItems: CartItem[];
  onOpenOrderDrawer: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  reducedMotion?: boolean;
}

export const OrderStatusWidget: React.FC<OrderStatusWidgetProps> = ({
  cartItems,
  onOpenOrderDrawer,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  reducedMotion = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close mini-preview if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const totalItems = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = cartItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);

  if (totalItems === 0) {
    return null;
  }

  return (
    <aside
      ref={containerRef}
      id="order-status-corner-widget"
      aria-label="Estado de Pedido"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-5 sm:w-96 sm:max-w-sm z-40 pointer-events-auto"
    >
      <AnimatePresence>
        <motion.div
          key="order-status-container"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 25, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="bg-[#3D2314]/95 hover:bg-[#3D2314] text-white rounded-2xl shadow-[0_12px_36px_rgba(61,35,20,0.28)] border border-[#E9BDA7]/25 backdrop-blur-md overflow-hidden transition-all duration-300"
        >
          {/* Expanded Drawer Mini-Preview (view items without opening full drawer) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="border-b border-white/10 bg-[#2F1A0E]/40 overflow-hidden"
              >
                <div className="p-3.5 space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between text-[11px] text-[#E9BDA7] font-semibold tracking-wide uppercase">
                    <span>Artículos en tu pedido</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-[#DCCBBE] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      title="Vaciar todo el pedido"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Vaciar</span>
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2.5 bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/5 transition-all text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate text-xs">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#DCCBBE] truncate">
                          {item.size ? (item.size === 'small' ? 'Chico' : 'Grande') : ''}
                          {item.milk ? ` • Leche ${item.milk}` : ''}
                          {item.extraShot ? ' • +Shot' : ''}
                          {item.whippedCream ? ' • +Crema' : ''}
                        </p>
                        <p className="text-[11px] font-sans tabular-nums text-[#E9BDA7] mt-0.5">
                          ${(item.unitPrice * item.quantity).toFixed(2)} MXN
                        </p>
                      </div>

                      {/* Inline Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-[#2F1A0E]/60 px-2 py-1 rounded-lg border border-white/10 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                          aria-label={`Reducir cantidad de ${item.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-sans tabular-nums text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Collapsed Status Bar */}
          <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
            {/* Left: Bag Icon with Live Badge and State Details */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#A24E2C] text-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-terracotta-cta text-white font-sans tabular-nums text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#3D2314]">
                  {totalItems}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse motion-reduce:animate-none" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E9BDA7]">
                    Estado de Pedido
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                    ${subtotal.toFixed(subtotal % 1 === 0 ? 0 : 2)}{' '}
                    <span className="text-[11px] font-sans font-normal text-[#DCCBBE]">MXN</span>
                  </span>
                  <span className="text-xs text-[#DCCBBE] hidden xs:inline truncate">
                    ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Expand Toggle & Open Drawer Action */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#DCCBBE] transition-colors cursor-pointer"
                title={isExpanded ? 'Contraer lista de productos' : 'Ver productos en tiempo real'}
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onOpenOrderDrawer}
                id="order-status-open-drawer-btn"
                className="inline-flex items-center gap-1.5 bg-[#A24E2C] hover:bg-[#B85D36] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <span>Pedir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
};
