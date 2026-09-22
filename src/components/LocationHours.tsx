import React from 'react';
import { MapPin, Clock, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { BRAND_INFO } from '../data/coffeeData';

export const LocationHours: React.FC = () => {
  return (
    <section id="ubicacion" className="py-20 sm:py-28 bg-[#F9F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Ubicación y Horarios</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          {/* Colophon headline + directions */}
          <div className="lg:col-span-7">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
              <MapPin className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
              Cómo Llegar
            </p>
            <p className="mt-5 font-serif text-5xl sm:text-6xl lg:text-[4.25rem] font-bold text-[#3D2314] leading-[1.05] tracking-tight max-w-[12ch] text-balance">
              Frente al Parque Central de Motozintla
            </p>
            <p className="mt-8 text-base text-ink-secondary leading-relaxed max-w-[52ch]">
              Esquina de la 2a. Avenida Norte y Calle Central Oriente, esquina noreste del parque, junto al kiosco municipal. Acceso peatonal fácil, con estacionamiento cercano en la periferia del Parque Central.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${BRAND_INFO.phoneClean}?text=${encodeURIComponent(
                  '¡Hola Motz Café! Deseo hacer una consulta sobre su ubicación y menú.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-[#3D2314] hover:bg-[#B85D36] text-white text-sm font-semibold px-6 rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none"
                id="location-whatsapp-btn"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span>Enviar Mensaje por WhatsApp</span>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Parque+Central+Motozintla+Chiapas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-[#FBF7F1] hover:bg-[#F4ECE1] text-[#3D2314] text-sm font-semibold px-6 rounded-lg border border-[#EFE7DE] transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none"
              >
                <span>Abrir en Google Maps</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Data sheet */}
          <dl className="lg:col-span-5 lg:pl-12 lg:border-l border-[#EFE7DE] self-end">
            <div className="pb-7">
              <dt className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                <MapPin className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                Dirección
              </dt>
              <dd className="mt-3">
                <span className="block font-serif text-lg font-bold text-[#3D2314]">
                  Motozintla de Mendoza, Chiapas
                </span>
                <span className="mt-1.5 block text-sm text-ink-secondary leading-relaxed">
                  {BRAND_INFO.address}
                </span>
              </dd>
            </div>

            <div className="py-7 border-t border-[#EFE7DE]">
              <dt className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                <Clock className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                Horarios de Atención
              </dt>
              <dd className="mt-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <th scope="row" className="py-1.5 text-left font-normal text-ink-secondary">
                        Lunes a Viernes
                      </th>
                      <td className="py-1.5 text-right font-serif text-lg font-bold text-[#3D2314] tabular-nums whitespace-nowrap">
                        7:00 a.m. a 9:00 p.m.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-1.5 text-left font-normal text-ink-secondary">
                        Sábados y Domingos
                      </th>
                      <td className="py-1.5 text-right font-serif text-lg font-bold text-[#3D2314] tabular-nums whitespace-nowrap">
                        8:00 a.m. a 10:00 p.m.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </dd>
            </div>

            <div className="pt-7 border-t border-[#EFE7DE]">
              <dt className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                <Phone className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                Teléfono de Pedidos
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${BRAND_INFO.phoneClean}`}
                  className="inline-flex items-center min-h-[44px] font-serif text-3xl font-bold text-[#3D2314] hover:text-[#B85D36] transition-colors duration-200 tabular-nums"
                >
                  {BRAND_INFO.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};
