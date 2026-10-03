import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Coffee,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Bike,
  Store,
  Package,
  ArrowRight,
  ScanBarcode,
  Flame,
} from 'lucide-react';
import { MenuItem, ComboItem, MilkOption, OrderType, CartItem } from '../types';
import { BRAND_INFO, MODIFICADORES } from '../data/coffeeData';
import { SCANBAR_URL, formatearGtin } from '../lib/scanbar';
import { TipCalculator } from './TipCalculator';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: MenuItem | ComboItem | null;
  initialSize?: 'small' | 'large';
  initialOrderType?: OrderType;
  cartItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onUpdateCartQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onExploreMenu?: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  initialSize = 'small',
  initialOrderType = 'local',
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  onExploreMenu,
}) => {
  if (!isOpen) return null;

  const isMenuItem = selectedProduct && 'category' in selectedProduct;

  const [size, setSize] = useState<'small' | 'large'>(initialSize);
  const [milk, setMilk] = useState<MilkOption>('entera');
  const [extraShot, setExtraShot] = useState(false);
  const [whippedCream, setWhippedCream] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>(initialOrderType);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [justAddedFeedback, setJustAddedFeedback] = useState(false);
  const [tipPercent, setTipPercent] = useState<number | null>(null);

  useEffect(() => {
    setSize(initialSize);
    setOrderType(initialOrderType);
    setTipPercent(null);
    setJustAddedFeedback(false);
  }, [initialSize, initialOrderType, selectedProduct, isOpen]);

  // Price Calculation for current customizing product (if any)
  let currentProductPrice = 0;
  if (selectedProduct) {
    if (isMenuItem) {
      const item = selectedProduct as MenuItem;
      currentProductPrice = size === 'large' && item.priceLarge ? item.priceLarge : item.priceSmall;
    } else {
      currentProductPrice = selectedProduct.price;
    }
  }

  const milkCost = milk === 'ninguna' ? 0 : MODIFICADORES.leche[milk].precio;
  const extraShotCost = extraShot ? MODIFICADORES.extraShot.precio : 0;
  const whippedCreamCost = whippedCream ? MODIFICADORES.cremaBatida.precio : 0;
  const singleItemCustomTotal = selectedProduct
    ? currentProductPrice + milkCost + extraShotCost + whippedCreamCost
    : 0;

  // Nutritional calculation for current customizing product (if any)
  let baseProductCalories = 0;
  let currentProductCalories = 0;
  let currentProductAllergens: string[] = [];

  if (selectedProduct) {
    if (isMenuItem) {
      const item = selectedProduct as MenuItem;
      baseProductCalories =
        size === 'large' && item.caloriesLarge ? item.caloriesLarge : (item.calories || 0);

      let extraCalories = 0;
      if (['calientes', 'frios'].includes(item.category)) {
        if (extraShot) extraCalories += 5;
        if (whippedCream) extraCalories += 75;
        if (milk === 'almendra') extraCalories -= 25;
        else if (milk === 'avena') extraCalories += 20;
        else if (milk === 'ninguna') extraCalories -= 70;
      }
      currentProductCalories = Math.max(5, baseProductCalories + extraCalories);

      // Dynamically compute allergen disclosures based on selections
      const allergensSet = new Set<string>(item.allergens || []);
      if (['calientes', 'frios'].includes(item.category)) {
        if (milk === 'entera' || milk === 'deslactosada') {
          allergensSet.add('Lácteos');
        } else if (milk === 'almendra') {
          allergensSet.add('Almendras (fruto seco)');
        } else if (milk === 'avena') {
          allergensSet.add('Avena');
        }
        if (whippedCream) {
          allergensSet.add('Lácteos (crema batida)');
        }
      }
      currentProductAllergens = Array.from(allergensSet);
    } else {
      const combo = selectedProduct as ComboItem;
      baseProductCalories = combo.calories || 0;
      currentProductCalories = baseProductCalories;
      currentProductAllergens = combo.allergens || [];
    }
  }

  // Cart total calculation
  const cartSubtotal = cartItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
  const cartTotalCalories = cartItems.reduce(
    (acc, it) => acc + (it.calories ? it.calories * it.quantity : 0),
    0
  );
  const packagingCost = orderType === 'pickup' ? 5 : orderType === 'domicilio' ? 20 : 0;

  // Base total for entire order:
  // If selectedProduct exists and has NOT yet been added to cart, we include its cost or allow adding it
  const baseOrderTotal = cartSubtotal + packagingCost;
  const tipAmount = tipPercent ? (baseOrderTotal * tipPercent) / 100 : 0;
  const finalTotal = baseOrderTotal + tipAmount;

  const handleAddCurrentToCart = () => {
    if (!selectedProduct) return;

    const productName = isMenuItem
      ? (selectedProduct as MenuItem).name
      : (selectedProduct as ComboItem).title;

    const unitPrice =
      currentProductPrice +
      (isMenuItem && ['calientes', 'frios'].includes((selectedProduct as MenuItem).category)
        ? milkCost + extraShotCost + whippedCreamCost
        : 0);

    const newItem: CartItem = {
      id: `${selectedProduct.id}-${size}-${milk}-${extraShot}-${whippedCream}-${Date.now()}`,
      productId: selectedProduct.id,
      name: productName,
      category: isMenuItem ? (selectedProduct as MenuItem).category : undefined,
      size: isMenuItem && (selectedProduct as MenuItem).priceLarge ? size : undefined,
      sizeLabel:
        isMenuItem && (selectedProduct as MenuItem).priceLarge
          ? size === 'small'
            ? 'Chico (300ml)'
            : 'Grande (420ml)'
          : undefined,
      milk: isMenuItem && ['calientes', 'frios'].includes((selectedProduct as MenuItem).category) ? milk : undefined,
      extraShot: extraShot,
      whippedCream: whippedCream,
      unitPrice,
      quantity: 1,
      image: isMenuItem ? (selectedProduct as MenuItem).image : undefined,
      isCombo: !isMenuItem,
      calories: currentProductCalories > 0 ? currentProductCalories : undefined,
      allergens: currentProductAllergens.length > 0 ? currentProductAllergens : undefined,
    };

    onAddToCart(newItem);
    setJustAddedFeedback(true);
    setTimeout(() => {
      setJustAddedFeedback(false);
    }, 2000);
  };

  // Format WhatsApp order text with complete order details
  const generateWhatsAppMessage = () => {
    let text = `☕ *NUEVO PEDIDO - MOTZ CAFÉ* ☕\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;

    if (cartItems.length > 0) {
      const totalUnits = cartItems.reduce((sum, it) => sum + it.quantity, 0);
      text += `*ARTÍCULOS EN TU PEDIDO (${totalUnits}):*\n`;
      cartItems.forEach((it, index) => {
        text += `${index + 1}. *${it.name}* (x${it.quantity})\n`;
        const specs: string[] = [];
        if (it.size) specs.push(it.size === 'small' ? 'Chico' : 'Grande');
        if (it.milk && it.milk !== 'ninguna') specs.push(`Leche ${it.milk}`);
        if (it.extraShot) specs.push('+1 Shot Espresso');
        if (it.whippedCream) specs.push('+Crema batida');
        if (specs.length > 0) {
          text += `   _(${specs.join(', ')})_\n`;
        }
        text += `   $${(it.unitPrice * it.quantity).toFixed(2)} MXN\n`;
        if (it.codigo) text += `   Código: ${it.codigo}\n`;
      });
      if (cartItems.some((it) => it.codigo)) text += `_(Muestra los códigos en caja para cobrar al instante)_\n`;
    } else if (selectedProduct) {
      const productName = isMenuItem
        ? (selectedProduct as MenuItem).name
        : (selectedProduct as ComboItem).title;
      text += `*Producto:* ${productName}\n`;
      if (isMenuItem && (selectedProduct as MenuItem).priceLarge) {
        text += `*Tamaño:* ${size === 'small' ? 'Chico' : 'Grande'}\n`;
      }
      if (isMenuItem && ['calientes', 'frios'].includes((selectedProduct as MenuItem).category)) {
        text += `*Leche:* ${milk.toUpperCase()}\n`;
      }
      if (extraShot) text += `*Extra:* +1 Shot de Espresso (+$${MODIFICADORES.extraShot.precio})\n`;
      if (whippedCream) text += `*Extra:* +Crema batida casera (+$${MODIFICADORES.cremaBatida.precio})\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Modalidad:* ${
      orderType === 'local'
        ? 'En el Local (Parque Central)'
        : orderType === 'pickup'
        ? 'Para Llevar (Pick-up, +$5 empaque)'
        : 'A Domicilio en Motozintla (+$20 tarifa)'
    }\n`;

    if (customerName.trim()) text += `*Cliente:* ${customerName.trim()}\n`;
    if (orderType === 'domicilio' && address.trim()) {
      text += `*Dirección de entrega:* ${address.trim()}\n`;
    }
    if (notes.trim()) text += `*Notas especiales:* ${notes.trim()}\n`;

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (tipPercent && tipPercent > 0) {
      text += `*Subtotal:* $${cartSubtotal > 0 ? cartSubtotal.toFixed(2) : singleItemCustomTotal.toFixed(2)} MXN\n`;
      if (packagingCost > 0) {
        text += `*Empaque/Envío:* +$${packagingCost.toFixed(2)} MXN\n`;
      }
      text += `*Propina sugerida (${tipPercent}%):* +$${tipAmount.toFixed(2)} MXN\n`;
      text += `*TOTAL CON PROPINA:* $${finalTotal.toFixed(2)} MXN\n`;
    } else {
      text += `*TOTAL ESTIMADO:* $${finalTotal > 0 ? finalTotal.toFixed(2) : (singleItemCustomTotal + packagingCost).toFixed(2)} MXN\n`;
    }
    text += `_¡Muchas gracias por apoyar el café de nuestra Sierra!_`;

    return text;
  };

  const handleSendWhatsApp = () => {
    // If user has not added current item to cart, but is ordering with product open and cart empty, add it
    if (selectedProduct && cartItems.length === 0) {
      handleAddCurrentToCart();
    }
    const text = generateWhatsAppMessage();
    const url = `https://wa.me/${BRAND_INFO.phoneClean}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyTicket = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalItemsCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#3D2314]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      id="order-drawer-backdrop"
    >
      <div className="relative w-full max-w-lg bg-[#FBF7F1] rounded-2xl shadow-[0_24px_64px_rgba(61,35,20,0.35)] border border-[#EFE7DE] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-[#F9F5F0] border-b border-[#EFE7DE] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3D2314] text-white flex items-center justify-center">
              <Coffee className="w-4 h-4 text-[#EFE7DE]" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#3D2314]">
                {selectedProduct ? 'Personalizar & Agregar al Pedido' : 'Tu Pedido en Curso'}
              </h3>
              <p className="text-[11px] text-ink-secondary">
                MOTZ CAFÉ • Motozintla de Mendoza, Chiapas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-ink-secondary hover:text-[#3D2314] rounded-lg hover:bg-[#FBF7F1] transition-colors cursor-pointer"
            aria-label="Cerrar modal de pedido"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Customizing Active Product (if opened with a specific item) */}
          {selectedProduct && (
            <div className="space-y-4 bg-[#FBF7F1] p-4 rounded-xl border border-[#EFE7DE]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85D36]">
                    Producto seleccionado
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#3D2314]">
                    {isMenuItem ? (selectedProduct as MenuItem).name : (selectedProduct as ComboItem).title}
                  </h4>
                  <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2">
                    {selectedProduct.description}
                  </p>
                </div>
                <span className="font-serif text-lg font-bold text-[#3D2314] ml-3 shrink-0">
                  ${currentProductPrice} <span className="text-xs font-sans font-normal">MXN</span>
                </span>
              </div>

              {/* Size Choice (if item has sizes) */}
              {isMenuItem && (selectedProduct as MenuItem).priceLarge && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary block mb-2">
                    Tamaño de Bebida
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSize('small')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                        size === 'small'
                          ? 'border-[#B85D36] bg-[#FBF0EB] text-[#3D2314]'
                          : 'border-[#EFE7DE] bg-[#FBF7F1] text-ink-secondary hover:bg-[#F9F5F0]'
                      }`}
                    >
                      <span>Chico (300ml)</span>
                      <span className="font-bold text-[#3D2314]">
                        ${(selectedProduct as MenuItem).priceSmall}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSize('large')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                        size === 'large'
                          ? 'border-[#B85D36] bg-[#FBF0EB] text-[#3D2314]'
                          : 'border-[#EFE7DE] bg-[#FBF7F1] text-ink-secondary hover:bg-[#F9F5F0]'
                      }`}
                    >
                      <span>Grande (420ml)</span>
                      <span className="font-bold text-[#3D2314]">
                        ${(selectedProduct as MenuItem).priceLarge}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Milk Selection (for hot and cold coffees) */}
              {isMenuItem && ['calientes', 'frios'].includes((selectedProduct as MenuItem).category) && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary block mb-2">
                    Tipo de Leche
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'entera' as const, label: 'Entera' },
                      { id: 'deslactosada' as const, label: 'Deslact.' },
                      { id: 'almendra' as const, label: 'Almendra' },
                      { id: 'avena' as const, label: 'Avena' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMilk(m.id)}
                        className={`py-2 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                          milk === m.id
                            ? 'border-[#B85D36] bg-[#3D2314] text-white'
                            : 'border-[#EFE7DE] bg-[#FBF7F1] text-ink-secondary hover:bg-[#F9F5F0]'
                        }`}
                      >
                        <span>{m.label}</span>
                        <span className="text-[10px] opacity-80">+${MODIFICADORES.leche[m.id].precio}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras and Customization */}
              {isMenuItem && ['calientes', 'frios'].includes((selectedProduct as MenuItem).category) && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary block mb-2">
                    Adiciones Especiales
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExtraShot(!extraShot)}
                      className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        extraShot
                          ? 'border-[#B85D36] bg-[#FBF0EB] text-[#3D2314]'
                          : 'border-[#EFE7DE] bg-[#FBF7F1] text-ink-secondary'
                      }`}
                    >
                      <span>+1 Shot Espresso</span>
                      <span className="font-bold text-[#B85D36]">+${MODIFICADORES.extraShot.precio}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWhippedCream(!whippedCream)}
                      className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        whippedCream
                          ? 'border-[#B85D36] bg-[#FBF0EB] text-[#3D2314]'
                          : 'border-[#EFE7DE] bg-[#FBF7F1] text-ink-secondary'
                      }`}
                    >
                      <span>+Crema Batida</span>
                      <span className="font-bold text-[#B85D36]">+${MODIFICADORES.cremaBatida.precio}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Nutritional Information (Calories & Allergens) */}
              {(baseProductCalories > 0 || currentProductAllergens.length > 0) && (
                <div
                  className="bg-[#F4ECE1]/70 rounded-xl p-3 border border-[#EFE7DE] text-xs space-y-2"
                  id="drawer-nutritional-info"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-ink-secondary flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                      <span>Información Nutricional</span>
                    </span>
                    {currentProductCalories > 0 && (
                      <span className="font-sans tabular-nums font-bold text-[#3D2314] text-xs">
                        ~{currentProductCalories}{' '}
                        <span className="font-normal text-[11px] text-ink-secondary">kcal</span>
                        {isMenuItem && (selectedProduct as MenuItem).priceLarge && (
                          <span className="ml-1 text-[10px] text-ink-secondary font-normal">
                            ({size === 'small' ? 'Chico' : 'Grande'})
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Dynamic nutritional notes if customized */}
                  {isMenuItem && ['calientes', 'frios'].includes((selectedProduct as MenuItem).category) && (
                    <div className="text-[11px] text-ink-secondary flex flex-wrap gap-x-2 gap-y-0.5">
                      <span>Base: ~{baseProductCalories} kcal</span>
                      {milk !== 'entera' && (
                        <span>
                          · Leche {milk} (
                          {milk === 'almendra'
                            ? '-25 kcal'
                            : milk === 'avena'
                            ? '+20 kcal'
                            : milk === 'ninguna'
                            ? '-70 kcal'
                            : 'igual'}
                          )
                        </span>
                      )}
                      {extraShot && <span>· +Espresso (+5 kcal)</span>}
                      {whippedCream && <span>· +Crema (+75 kcal)</span>}
                    </div>
                  )}

                  {/* Allergens notice */}
                  <div className="flex items-start gap-1.5 pt-1 border-t border-[#EFE7DE] text-[11px]">
                    <span className="font-semibold text-[#3D2314] shrink-0">Alérgenos:</span>
                    {currentProductAllergens.length > 0 ? (
                      <span className="text-ink-secondary">
                        {currentProductAllergens.join(', ')}
                      </span>
                    ) : (
                      <span className="text-[#3E5A38] font-medium">
                        Sin alérgenos comunes declarados
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Add To Cart CTA Button */}
              <button
                type="button"
                onClick={handleAddCurrentToCart}
                id="drawer-add-to-cart-btn"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  justAddedFeedback
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#B85D36] hover:bg-[#A24E2C] text-white'
                }`}
              >
                {justAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>¡Agregado al Pedido con Éxito!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>
                      Añadir al Carrito (${singleItemCustomTotal} MXN)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Current Cart Items List (Real-Time Order State) */}
          {cartItems.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#B85D36]" />
                  <span>Artículos en tu pedido ({totalItemsCount})</span>
                </label>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] text-ink-secondary hover:text-[#A24E2C] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Vaciar</span>
                </button>
              </div>

              <div className="space-y-2 border border-[#EFE7DE] rounded-xl p-2.5 bg-[#FBF7F1]/60 max-h-52 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2.5 bg-[#FBF7F1] p-2.5 rounded-lg border border-[#EFE7DE] text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#3D2314] truncate">{item.name}</p>
                      <p className="text-[11px] text-ink-secondary truncate">
                        {item.size ? (item.size === 'small' ? 'Chico' : 'Grande') : ''}
                        {item.milk ? ` • Leche ${item.milk}` : ''}
                        {item.extraShot ? ' • +Shot' : ''}
                        {item.whippedCream ? ' • +Crema' : ''}
                      </p>
                      {/* Calories & Allergens in Cart */}
                      {(item.calories || (item.allergens && item.allergens.length > 0)) && (
                        <p className="text-[11px] text-ink-secondary mt-0.5 truncate">
                          {item.calories ? `~${item.calories} kcal/ud.` : ''}
                          {item.calories && item.allergens && item.allergens.length > 0 ? ' · ' : ''}
                          {item.allergens && item.allergens.length > 0 ? `Contiene: ${item.allergens.join(', ')}` : ''}
                        </p>
                      )}
                      <p className="text-xs font-serif font-bold text-[#B85D36] mt-0.5">
                        ${(item.unitPrice * item.quantity).toFixed(2)} MXN
                      </p>
                      {item.codigo && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-[11px] text-ink-secondary inline-flex items-center gap-1 tabular-nums">
                            <ScanBarcode className="w-3 h-3" aria-hidden="true" />
                            <span>Código {formatearGtin(item.codigo)}</span>
                          </summary>
                          <img
                            src={`${SCANBAR_URL}/v1/codes/${item.codigo}.svg?kind=ean13`}
                            alt={`Código de barras ${item.codigo}`}
                            className="mt-1 h-14 w-auto bg-white rounded p-1"
                          />
                        </details>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-[#FBF7F1] px-2 py-1 rounded-lg border border-[#EFE7DE]">
                      <button
                        type="button"
                        onClick={() => onUpdateCartQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-[#FBF7F1] text-[#3D2314] cursor-pointer"
                        aria-label="Restar uno"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-sans tabular-nums text-xs font-bold text-[#3D2314] px-1">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateCartQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-[#FBF7F1] text-[#3D2314] cursor-pointer"
                        aria-label="Sumar uno"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-1 text-ink-secondary hover:text-[#A24E2C] rounded-lg transition-colors cursor-pointer"
                      title="Eliminar este artículo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {cartTotalCalories > 0 && (
                <div className="flex items-center justify-between px-1 text-[11px] text-ink-secondary pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                    <span>Energía estimada total del pedido:</span>
                  </span>
                  <span className="font-sans tabular-nums font-semibold text-[#3D2314]">
                    ~{cartTotalCalories} kcal
                  </span>
                </div>
              )}
            </div>
          ) : !selectedProduct ? (
            <div className="text-center py-8 px-4 bg-[#FBF7F1] rounded-xl border border-dashed border-[#EFE7DE] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4ECE1] text-[#B85D36] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6 text-[#B85D36]" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#3D2314]">
                Tu carrito de pedidos está vacío
              </h4>
              <p className="text-xs text-ink-secondary max-w-xs mx-auto">
                Explora nuestra carta artesanal o combos especiales para agregar tus bebidas y alimentos favoritos.
              </p>
              {onExploreMenu && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onExploreMenu();
                  }}
                  className="inline-flex items-center gap-2 bg-[#3D2314] hover:bg-[#B85D36] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Explorar Menú</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : null}

          {/* Order Modality Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary block mb-2">
              Modalidad de Entrega
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'local' as OrderType, label: 'En Local', extra: 'Sin costo', icon: Store },
                { id: 'pickup' as OrderType, label: 'Para Llevar', extra: '+$5 empaque', icon: Package },
                { id: 'domicilio' as OrderType, label: 'A Domicilio', extra: '+$20 tarifa', icon: Bike },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = orderType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOrderType(opt.id)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#B85D36] bg-[#FBF0EB] text-[#3D2314] ring-1 ring-[#B85D36]/40'
                        : 'border-[#EFE7DE] bg-[#FBF7F1] text-ink-secondary hover:bg-[#F9F5F0]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#B85D36]' : 'text-ink-secondary'}`} />
                    <span className="text-xs font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-ink-secondary">{opt.extra}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details Fields */}
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-semibold text-ink-secondary block mb-1">
                Tu Nombre
              </label>
              <input
                type="text"
                placeholder="Ej. Carlos Méndez"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FBF7F1] border border-[#EFE7DE] rounded-lg focus:outline-none focus:border-[#B85D36]"
              />
            </div>

            {orderType === 'domicilio' && (
              <div>
                <label className="text-xs font-semibold text-ink-secondary block mb-1">
                  Dirección de Entrega en Motozintla
                </label>
                <input
                  type="text"
                  placeholder="Ej. Barrio San Antonio, frente a la escuela"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FBF7F1] border border-[#EFE7DE] rounded-lg focus:outline-none focus:border-[#B85D36]"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-ink-secondary block mb-1">
                Indicaciones especiales (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Poca azúcar, sin canela, servilletas extra"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FBF7F1] border border-[#EFE7DE] rounded-lg focus:outline-none focus:border-[#B85D36]"
              />
            </div>
          </div>

          {/* Calculadora de Propinas Sugeridas */}
          <TipCalculator
            orderTotal={baseOrderTotal > 0 ? baseOrderTotal : singleItemCustomTotal + packagingCost}
            selectedTipPercent={tipPercent}
            onSelectTipPercent={setTipPercent}
          />
        </div>

        {/* Modal Footer / Actions */}
        <div className="bg-[#F9F5F0] border-t border-[#EFE7DE] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-ink-secondary block">
              {tipPercent !== null ? `Total con propina (${tipPercent}%)` : 'Total de tu pedido'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#3D2314]">
                ${(finalTotal > 0 ? finalTotal : singleItemCustomTotal + packagingCost).toFixed(2)}{' '}
                <span className="text-xs font-sans font-normal text-ink-secondary">MXN</span>
              </span>
              {tipPercent !== null && (
                <span className="text-[11px] font-semibold text-[#B85D36] bg-[#FBF0EB] px-2 py-0.5 rounded-full border border-[#E9BDA7]/60">
                  +${tipAmount.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyTicket}
              className="py-3 px-3 rounded-lg border border-[#EFE7DE] bg-[#FBF7F1] hover:bg-[#F4ECE1] text-xs font-semibold text-[#3D2314] transition-colors cursor-pointer"
              title="Copiar texto del pedido"
            >
              {copied ? <Check className="w-4 h-4 text-botanical" /> : 'Copiar'}
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#3D2314] hover:bg-[#B85D36] text-white text-xs font-semibold py-3 px-5 rounded-lg transition-all cursor-pointer"
              id="confirm-order-whatsapp-btn"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar Pedido a WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
