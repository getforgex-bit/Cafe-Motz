import React, { useState } from 'react';
import { Coffee, Snowflake, Utensils, Cake, Sparkles, SlidersHorizontal, ShoppingBag, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MENU_ITEMS } from '../data/coffeeData';
import { MenuItem, ProductCategory } from '../types';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem, size?: 'small' | 'large') => void;
  onQuickAdd?: (item: MenuItem) => void;
  reducedMotion?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

interface PriceSheetProps {
  item: MenuItem;
  large?: boolean;
}

/** Margin price sheet: size label as a micro-label, price as a serif figure. */
const PriceSheet: React.FC<PriceSheetProps> = ({ item, large = false }) => (
  <dl className="space-y-3">
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
        {item.sizeSmallLabel || 'Chico (300ml)'}
      </dt>
      <dd className={`mt-0.5 font-serif font-bold text-[#3D2314] leading-none tabular-nums ${large ? 'text-4xl' : 'text-2xl'}`}>
        ${item.priceSmall}
        <span className="ml-1 font-sans text-[11px] font-semibold text-ink-secondary align-middle">MXN</span>
      </dd>
    </div>
    {item.priceLarge && (
      <div>
        <dt className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
          {item.sizeLargeLabel || 'Grande (420ml)'}
        </dt>
        <dd className={`mt-0.5 font-serif font-bold text-[#3D2314] leading-none tabular-nums ${large ? 'text-4xl' : 'text-2xl'}`}>
          ${item.priceLarge}
          <span className="ml-1 font-sans text-[11px] font-semibold text-ink-secondary align-middle">MXN</span>
        </dd>
      </div>
    )}
    {item.preparationTime && (
      <div className="flex items-center gap-1.5 text-xs text-ink-secondary pt-1">
        <Clock className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
        <span>Listo en {item.preparationTime}</span>
      </div>
    )}
  </dl>
);

interface ItemActionsProps {
  item: MenuItem;
  onSelectItem: MenuSectionProps['onSelectItem'];
  onQuickAdd?: MenuSectionProps['onQuickAdd'];
}

const ItemActions: React.FC<ItemActionsProps> = ({ item, onSelectItem, onQuickAdd }) => {
  const isSpecialty = item.isHouseSpecial;
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onSelectItem(item, 'small')}
        className={`flex-1 sm:flex-none min-h-[44px] px-4 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer ${
          isSpecialty
            ? 'bg-[#A24E2C] hover:bg-[#3D2314] text-white shadow-[0_8px_24px_rgba(184,93,54,0.18)]'
            : 'bg-[#3D2314] hover:bg-[#B85D36] text-white'
        }`}
        id={`order-btn-${item.id}`}
      >
        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{isSpecialty ? 'Pedir Especialidad' : 'Personalizar'}</span>
      </button>
      {onQuickAdd && (
        <button
          type="button"
          onClick={() => onQuickAdd(item)}
          title={`Añadir 1 ${item.name} directamente al pedido`}
          className="relative w-11 h-11 inline-flex items-center justify-center bg-[#FBF7F1] hover:bg-[#B85D36] text-[#3D2314] hover:text-white border border-[#EFE7DE] hover:border-[#B85D36] rounded-lg transition-all duration-200 ease-out cursor-pointer shrink-0"
          aria-label={`Añadir 1 ${item.name} al pedido`}
          id={`quick-add-${item.id}`}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

const TastingLine: React.FC<{ notes?: string[] }> = ({ notes }) =>
  notes && notes.length > 0 ? (
    <p className="mt-4 text-sm text-ink-secondary">
      <span className="text-[10px] uppercase tracking-[0.18em] font-bold mr-2">Notas</span>
      <span className="font-serif italic text-[#3D2314]">{notes.join(', ')}</span>
    </p>
  ) : null;

const ItemBadge: React.FC<{ item: MenuItem }> = ({ item }) =>
  item.badge ? (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] font-bold px-2.5 py-1 rounded-full ${
        item.isHouseSpecial ? 'bg-[#A24E2C] text-white' : 'bg-[#F4ECE1] text-[#3D2314]'
      }`}
    >
      {item.isHouseSpecial && <Sparkles className="w-3 h-3" aria-hidden="true" />}
      {item.badge}
    </span>
  ) : null;

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectItem, onQuickAdd, reducedMotion = false }) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('calientes');
  const prefersReduced = useReducedMotion();
  const shouldReduce = Boolean(reducedMotion || prefersReduced);

  const categories = [
    { id: 'calientes' as ProductCategory, label: 'Cafés Calientes', icon: Coffee },
    { id: 'frios' as ProductCategory, label: 'Bebidas Frías & Frappés', icon: Snowflake },
    { id: 'comida' as ProductCategory, label: 'Comida & Salados', icon: Utensils },
    { id: 'postres' as ProductCategory, label: 'Postres & Repostería', icon: Cake },
  ];

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);
  const featured = filteredItems.find((item) => item.isHouseSpecial);
  const listItems = filteredItems.filter((item) => item !== featured);

  const reveal = (index: number) => ({
    initial: shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
    transition: {
      duration: shouldReduce ? 0.15 : 0.5,
      delay: shouldReduce ? 0 : Math.min(index * 0.07, 0.28),
      ease: EASE,
    },
  });

  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#F9F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header: stacked, left-aligned */}
        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-3xl"
        >
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#3D2314] leading-[1.1] tracking-tight">
            Nuestro Menú Artesanal
          </h2>
          <p className="mt-5 text-base sm:text-lg text-ink-secondary leading-relaxed max-w-[56ch]">
            Granos de estricta altura tostados a la perfección y recetas reconfortantes con sabor a tradición viva.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-ink-secondary">
            <Sparkles className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
            Bebidas elaboradas al momento
          </p>
        </motion.div>

        {/* Category tabs: text with terracotta underline */}
        <div
          role="tablist"
          aria-label="Categorías del menú"
          className="mt-12 flex items-end gap-6 sm:gap-9 overflow-x-auto no-scrollbar border-b border-[#EFE7DE]"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="menu-panel"
                onClick={() => setActiveCategory(cat.id)}
                className={`relative -mb-px inline-flex items-center gap-2 min-h-[48px] pb-3 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'border-[#B85D36] text-[#3D2314]'
                    : 'border-transparent text-ink-secondary hover:text-[#3D2314] hover:border-[#EFE7DE]'
                }`}
                id={`menu-cat-${cat.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B85D36]' : 'text-ink-secondary'}`} aria-hidden="true" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`menu-cat-${activeCategory}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduce ? 0.1 : 0.2 }}
            >
              {/* Featured house special: landscape double-width row */}
              {featured && (
                <motion.article
                  {...reveal(0)}
                  className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  id={`menu-card-${featured.id}`}
                >
                  <div className="lg:col-span-7 overflow-hidden rounded-2xl bg-[#F4ECE1] shadow-[0_8px_24px_rgba(184,93,54,0.12)]">
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out hover:scale-[1.03] motion-reduce:transform-none"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <ItemBadge item={featured} />
                    <h3 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-[#3D2314] leading-[1.15] tracking-tight">
                      {featured.name}
                    </h3>
                    <p className="mt-4 text-base text-ink-secondary leading-relaxed max-w-[48ch]">
                      {featured.description}
                    </p>
                    <TastingLine notes={featured.tastingNotes} />
                    <div className="mt-8 pt-6 border-t border-[#EFE7DE] flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      <PriceSheet item={featured} large />
                      <ItemActions item={featured} onSelectItem={onSelectItem} onQuickAdd={onQuickAdd} />
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Tasting-menu rows */}
              <ul className={`${featured ? 'mt-16' : 'mt-10'} border-b border-[#EFE7DE]`}>
                {listItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    {...reveal(index + (featured ? 1 : 0))}
                    className="grid grid-cols-[88px_1fr] sm:grid-cols-12 gap-x-5 sm:gap-x-8 gap-y-5 py-8 border-t border-[#EFE7DE]"
                    id={`menu-card-${item.id}`}
                  >
                    <div className="sm:col-span-3 lg:col-span-2 overflow-hidden rounded-2xl bg-[#F4ECE1] self-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full aspect-[4/5] object-cover transition-transform duration-700 ease-out hover:scale-[1.04] motion-reduce:transform-none"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="sm:col-span-9 lg:col-span-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3D2314] leading-[1.2] tracking-tight">
                          {item.name}
                        </h3>
                        <ItemBadge item={item} />
                      </div>
                      <p className="mt-2 text-sm text-ink-secondary leading-relaxed max-w-[56ch]">
                        {item.description}
                      </p>
                      <TastingLine notes={item.tastingNotes} />
                    </div>

                    <div className="col-span-2 sm:col-span-12 lg:col-span-4 lg:pl-8 lg:border-l border-[#EFE7DE] flex flex-col sm:flex-row lg:flex-col sm:items-end lg:items-stretch justify-between gap-5">
                      <PriceSheet item={item} />
                      <ItemActions item={item} onSelectItem={onSelectItem} onQuickAdd={onQuickAdd} />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Milk customization as an editorial footnote */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
          <p className="md:col-span-8 flex items-start gap-3 text-sm text-ink-secondary leading-relaxed">
            <SlidersHorizontal className="w-4 h-4 mt-0.5 text-[#B85D36] shrink-0" aria-hidden="true" />
            <span>
              <strong className="text-[#3D2314] font-semibold">Personaliza tu bebida:</strong> Elige leche deslactosada, bebida de almendra o avena orgánica por solo{' '}
              <span className="font-serif font-bold text-[#3D2314] whitespace-nowrap">+$10 MXN</span>.
            </span>
          </p>
          <p className="md:col-span-4 md:text-right text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
            Almendra <span aria-hidden="true" className="mx-1.5 text-[#D9CBBB]">/</span>
            Avena <span aria-hidden="true" className="mx-1.5 text-[#D9CBBB]">/</span>
            Deslactosada
          </p>
        </div>
      </div>
    </section>
  );
};
