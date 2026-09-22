import React, { useState } from 'react';
import { Store, ShoppingBag, Bike, Gift, Award, Coffee, Copy, Check } from 'lucide-react';
import { BRAND_INFO } from '../data/coffeeData';

const STAMP_CELLS = Array.from({ length: 10 }, (_, i) => i + 1);

const ORDER_MODES = [
  {
    id: 'local',
    icon: Store,
    title: 'En el Local',
    description:
      'Disfruta de nuestro espacio cálido frente al Parque Central de Motozintla. Servicio amable en barra y a tu mesa con Wi-Fi para trabajar o charlar.',
    fee: '$0',
    feeNote: 'Sin costo adicional',
  },
  {
    id: 'pickup',
    icon: ShoppingBag,
    title: 'Para Llevar (Pick-up)',
    description:
      'Pide con anticipación por WhatsApp y recoge en barra en minutos sin filas. Incluye vaso y empaque térmico con sello anti-derrame.',
    fee: '+$5',
    feeNote: 'MXN empaque ecológico',
  },
  {
    id: 'domicilio',
    icon: Bike,
    title: 'A Domicilio',
    description:
      'Llegamos hasta tu casa, oficina o negocio con cobertura local rápida y segura en toda la zona urbana de Motozintla de Mendoza.',
    fee: '+$20',
    feeNote: 'MXN tarifa local fija',
  },
];

export const OrderModesAndLoyalty: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(BRAND_INFO.barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="fidelidad" className="py-20 sm:py-28 bg-[#F9F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#3D2314] leading-[1.1] tracking-tight max-w-2xl text-balance">
          Modalidades de Pedido & Fidelidad
        </h2>

        {/* Order modes as a typographic table */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 border-t border-[#EFE7DE]">
          {ORDER_MODES.map((mode, i) => {
            const Icon = mode.icon;
            return (
              <article
                key={mode.id}
                className={`pt-8 pb-10 md:pb-2 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-[#EFE7DE] md:pl-8' : ''} ${
                  i < ORDER_MODES.length - 1 ? 'md:pr-8' : ''
                }`}
              >
                <p className="font-serif text-5xl font-bold text-[#3D2314] leading-none tabular-nums">
                  {mode.fee}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] font-bold text-terracotta-cta">
                  {mode.feeNote}
                </p>
                <h3 className="mt-8 flex items-center gap-2 font-serif text-xl font-bold text-[#3D2314]">
                  <Icon className="w-4 h-4 text-[#B85D36]" aria-hidden="true" />
                  {mode.title}
                </h3>
                <p className="mt-3 text-sm text-ink-secondary leading-relaxed max-w-[40ch]">
                  {mode.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Loyalty: copy beside the physical stamp card */}
        <div className="mt-24 lg:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="block text-[11px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
              Programa de lealtad
            </span>
            <h3 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#3D2314] leading-[1.15] tracking-tight text-balance">
              Cada taza te acerca a tu próxima cortesía
            </h3>
            <p className="mt-5 text-base text-ink-secondary leading-relaxed max-w-[46ch]">
              Pide que sellemos tu cartilla en caja en cada visita. Junta sellos y obtén bebidas y postres de cortesía en tu 5ta y 10ma visita.
            </p>

            <dl className="mt-8 border-t border-[#EFE7DE]">
              <div className="flex items-center gap-3 py-4 border-b border-[#EFE7DE]">
                <Gift className="w-4 h-4 text-[#B85D36] shrink-0" aria-hidden="true" />
                <dt className="font-serif text-lg font-bold text-[#3D2314] w-28 shrink-0 whitespace-nowrap">5to sello</dt>
                <dd className="text-sm text-ink-secondary">Café Chico Gratis</dd>
              </div>
              <div className="flex items-center gap-3 py-4 border-b border-[#EFE7DE]">
                <Award className="w-4 h-4 text-[#B85D36] shrink-0" aria-hidden="true" />
                <dt className="font-serif text-lg font-bold text-[#3D2314] w-28 shrink-0 whitespace-nowrap">10mo sello</dt>
                <dd className="text-sm text-ink-secondary">Postre Artesanal Gratis</dd>
              </div>
            </dl>
          </div>

          {/* The physical stamp card: the section's only elevated surface */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[#FBF7F1] rounded-2xl border border-[#EFE7DE] shadow-[0_16px_36px_rgba(61,35,20,0.12)] p-6 sm:p-7 lg:rotate-[-1.5deg] motion-reduce:rotate-0">
              <div className="flex items-center justify-between border-b border-dashed border-[#E4D6C6] pb-4 mb-5">
                <div>
                  <span className="font-serif text-lg font-bold text-[#3D2314] tracking-tight block">
                    MOTZ CAFÉ
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                    Cartilla de la Casa
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-botanical-deep border border-dashed border-botanical-deep/40 px-2.5 py-1 rounded-full">
                  Motozintla
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2.5 sm:gap-3" aria-hidden="true">
                {STAMP_CELLS.map((n) => {
                  if (n === 5 || n === 10) {
                    const RewardIcon = n === 5 ? Gift : Award;
                    return (
                      <div
                        key={n}
                        className="aspect-square rounded-full border-2 border-[#B85D36] bg-[#B85D36]/10 text-[#A24E2C] flex items-center justify-center"
                      >
                        <RewardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    );
                  }
                  return (
                    <div
                      key={n}
                      className="aspect-square rounded-full border border-dashed border-[#D9CBBB] text-[#C9B8A6] flex items-center justify-center"
                    >
                      <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-[#EFE7DE] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary block mb-1">
                    Número de Pase
                  </span>
                  <span className="font-sans tabular-nums text-base sm:text-lg font-bold tracking-[0.2em] text-[#3D2314]">
                    {BRAND_INFO.barcode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBarcode}
                  className="relative inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg text-xs font-semibold text-terracotta-cta hover:bg-[#F4ECE1] transition-colors duration-200 cursor-pointer"
                  title="Copiar número de pase"
                  aria-live="polite"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-botanical" aria-hidden="true" />
                      <span className="text-botanical">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods footnote */}
        <div className="mt-20 pt-6 border-t border-[#EFE7DE] flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary shrink-0">
            Formas de pago aceptadas
          </span>
          <p className="text-sm text-[#3D2314]">
            Efectivo <span aria-hidden="true" className="mx-2 text-[#D9CBBB]">/</span>
            Tarjeta de crédito y débito <span aria-hidden="true" className="mx-2 text-[#D9CBBB]">/</span>
            Transferencia SPEI <span aria-hidden="true" className="mx-2 text-[#D9CBBB]">/</span>
            CoDi
          </p>
        </div>
      </div>
    </section>
  );
};
