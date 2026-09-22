import React from 'react';
import { Sparkles, ShoppingBag, PackageCheck, Plus } from 'lucide-react';
import { COMBOS } from '../data/coffeeData';
import { ComboItem } from '../types';

interface CombosSectionProps {
  onSelectCombo: (combo: ComboItem) => void;
  onQuickAddCombo?: (combo: ComboItem) => void;
}

interface ComboActionsProps {
  combo: ComboItem;
  onSelectCombo: CombosSectionProps['onSelectCombo'];
  onQuickAddCombo?: CombosSectionProps['onQuickAddCombo'];
}

const ComboActions: React.FC<ComboActionsProps> = ({ combo, onSelectCombo, onQuickAddCombo }) => {
  const isPopular = combo.isPopular;
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onSelectCombo(combo)}
        className={`min-h-[44px] px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer ${
          isPopular
            ? 'bg-[#A24E2C] hover:bg-[#3D2314] text-white shadow-[0_8px_24px_rgba(184,93,54,0.18)]'
            : 'bg-[#FBF7F1] hover:bg-[#3D2314] text-[#3D2314] hover:text-white border border-[#EFE7DE] hover:border-[#3D2314]'
        }`}
        id={`combo-btn-${combo.id}`}
      >
        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{isPopular ? 'Pedir Favorito' : 'Pedir Combo'}</span>
      </button>
      {onQuickAddCombo && (
        <button
          type="button"
          onClick={() => onQuickAddCombo(combo)}
          title={`Añadir combo ${combo.title} al pedido`}
          className="w-11 h-11 inline-flex items-center justify-center rounded-lg border border-[#EFE7DE] bg-[#FBF7F1] hover:bg-[#B85D36] hover:border-[#B85D36] text-[#3D2314] hover:text-white transition-all duration-200 ease-out cursor-pointer shrink-0"
          aria-label={`Añadir combo ${combo.title} al pedido`}
          id={`quick-add-combo-${combo.id}`}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export const CombosSection: React.FC<CombosSectionProps> = ({ onSelectCombo, onQuickAddCombo }) => {
  const featured = COMBOS.find((combo) => combo.isPopular);
  const rest = COMBOS.filter((combo) => combo !== featured);

  return (
    <section id="combos" className="py-20 sm:py-28 bg-[#F4ECE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: headline left, featured combo right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#3D2314] leading-[1.1] tracking-tight text-balance">
              Combos Especiales y Promociones
            </h2>
            <p className="mt-5 text-base text-ink-secondary leading-relaxed max-w-[46ch]">
              Las combinaciones preferidas de nuestros visitantes en Motozintla con precios preferenciales para acompañar tu jornada.
            </p>
          </div>

          {featured && (
            <article className="lg:col-span-7 bg-[#FBF7F1] rounded-2xl p-7 sm:p-10 shadow-[0_8px_24px_rgba(61,35,20,0.08)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] font-bold px-2.5 py-1 rounded-full bg-[#A24E2C] text-white">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  {featured.tag}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-terracotta-cta">
                  {featured.savings}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 sm:gap-10 items-end">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-[#3D2314] leading-[1.15] tracking-tight">
                    {featured.title}
                  </h3>
                  <p className="mt-3 text-sm text-ink-secondary leading-relaxed max-w-[44ch]">
                    {featured.description}
                  </p>
                </div>
                <p className="sm:text-right">
                  <span className="block text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                    Precio especial
                  </span>
                  <span className="mt-1 block font-serif text-5xl sm:text-6xl font-bold text-[#3D2314] leading-none tabular-nums">
                    ${featured.price}
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold text-ink-secondary">MXN</span>
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#EFE7DE]">
                <ComboActions combo={featured} onSelectCombo={onSelectCombo} onQuickAddCombo={onQuickAddCombo} />
              </div>
            </article>
          )}
        </div>

        {/* Menu-board price list */}
        <ul className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-16">
          {rest.map((combo) => (
            <li key={combo.id} className="py-8 border-t border-[#E4D6C6]">
              <div className="flex items-baseline gap-3">
                <h3 className="font-serif text-2xl font-bold text-[#3D2314] leading-[1.2] tracking-tight">
                  {combo.title}
                </h3>
                <span className="leader" aria-hidden="true" />
                <span className="font-serif text-2xl font-bold text-[#3D2314] tabular-nums whitespace-nowrap">
                  ${combo.price}
                  <span className="ml-1 font-sans text-[11px] font-semibold text-ink-secondary">MXN</span>
                </span>
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                {combo.tag}
                <span aria-hidden="true" className="mx-2 text-[#C9B8A6]">/</span>
                <span className="text-terracotta-cta">{combo.savings}</span>
              </p>
              <p className="mt-3 text-sm text-ink-secondary leading-relaxed max-w-[52ch]">
                {combo.description}
              </p>
              <div className="mt-5">
                <ComboActions combo={combo} onSelectCombo={onSelectCombo} onQuickAddCombo={onQuickAddCombo} />
              </div>
            </li>
          ))}
        </ul>

        {/* Takeaway footnote */}
        <p className="mt-6 pt-6 border-t border-[#E4D6C6] flex items-start gap-3 text-sm text-ink-secondary leading-relaxed">
          <PackageCheck className="w-4 h-4 mt-0.5 text-[#B85D36] shrink-0" aria-hidden="true" />
          <span>
            <strong className="text-[#3D2314] font-semibold">Opción para llevar disponible:</strong> Por solo{' '}
            <span className="font-serif font-bold text-[#3D2314] whitespace-nowrap">+$5 MXN</span>{' '}
            llevas tus alimentos en empaque térmico ecológico compostable.
          </span>
        </p>
      </div>
    </section>
  );
};
