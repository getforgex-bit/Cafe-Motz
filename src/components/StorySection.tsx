import React from 'react';
import { GraduationCap, Sprout, ShieldCheck, Sparkles, HeartHandshake, Mountain, Coffee, Flame } from 'lucide-react';
import { BRAND_INFO, CORE_VALUES } from '../data/coffeeData';
import { StoryParallaxImage } from './StoryParallaxImage';

interface StorySectionProps {
  reducedMotion?: boolean;
}

const VALUE_ICONS = { ShieldCheck, Sparkles, HeartHandshake } as const;

export const StorySection: React.FC<StorySectionProps> = ({ reducedMotion = false }) => {
  return (
    <section id="historia" className="py-20 sm:py-28 bg-[#F9F5F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feature opener */}
        <div className="max-w-3xl">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#3D2314] leading-[1.1] tracking-tight text-balance">
            De Motozintla para el mundo
          </h2>
          <p className="mt-6 text-base sm:text-lg text-ink-secondary leading-relaxed max-w-[60ch]">
            Nacimos con la convicción profunda de poner en alto el café de estricta altura cultivado en las laderas de la Sierra Madre de Chiapas y dignificar el esfuerzo de las manos campesinas que cosechan cada fruto.
          </p>
        </div>

        {/* Staggered triptych: La Travesía del Grano Serrano */}
        <div className="mt-16 lg:mt-20">
          <h3 className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] font-bold text-ink-secondary pb-4 border-b border-[#EFE7DE]">
            <Mountain className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
            La Travesía del Grano Serrano
          </h3>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-14">
            <div className="md:col-span-5">
              <StoryParallaxImage
                src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1000&q=80"
                alt="Manos campesinas recolectando cerezas maduras de café en la Sierra Madre de Chiapas"
                badge="1,450 msnm, cosecha manual"
                title="Cerezas de Estricta Altura"
                subtitle="Cosechadas a mano en las microcuencas de Motozintla bajo la neblina matutina."
                aspectRatio="aspect-[4/5]"
                parallaxSpeed={28}
                direction="up"
                reducedMotion={reducedMotion}
                id="historia-img-cosecha"
              />
              <p className="mt-3 flex items-center gap-2 text-xs text-ink-secondary">
                <Sprout className="w-3.5 h-3.5 text-[#B85D36] shrink-0" aria-hidden="true" />
                100% Arábica Típica y Borbón en suelos volcánicos
              </p>
            </div>

            <div className="md:col-span-4 md:mt-24">
              <StoryParallaxImage
                src="https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1000&q=80"
                alt="Grano de café artesanal tostándose en tambor de bronce con notas a chocolate amargo"
                badge="Tueste medio, pequeños lotes"
                title="Tueste Artesanal de Origen"
                subtitle="Curva de calor calibrada para exaltar notas a chocolate amargo y cítrico dulce."
                aspectRatio="aspect-square"
                parallaxSpeed={36}
                direction="down"
                reducedMotion={reducedMotion}
                id="historia-img-tueste"
              />
              <p className="mt-3 flex items-center gap-2 text-xs text-ink-secondary">
                <Flame className="w-3.5 h-3.5 text-[#B85D36] shrink-0" aria-hidden="true" />
                Desarrollo óptimo de aroma y acidez brillante
              </p>
            </div>

            <div className="md:col-span-3 md:mt-10">
              <StoryParallaxImage
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
                alt="Barista de MOTZ CAFÉ sirviendo una taza humeante de café chiapaneco de especialidad"
                badge="Especialidad, Parque Central"
                title="La Taza en Motozintla"
                subtitle="El fruto del trabajo serrano servido con calidez en el corazón de nuestra tierra."
                aspectRatio="aspect-[3/4]"
                parallaxSpeed={26}
                direction="up"
                reducedMotion={reducedMotion}
                id="historia-img-servicio"
              />
              <p className="mt-3 flex items-center gap-2 text-xs text-ink-secondary">
                <Coffee className="w-3.5 h-3.5 text-[#B85D36] shrink-0" aria-hidden="true" />
                Extracciones de precisión y recetas tradicionales
              </p>
            </div>
          </div>
        </div>

        {/* Two-column spread: prose + origin sheet */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          <article className="lg:col-span-7">
            <h3 className="flex items-start gap-3 font-serif text-2xl sm:text-3xl font-bold text-[#3D2314] leading-[1.2] tracking-tight">
              <GraduationCap className="w-6 h-6 text-[#B85D36] mt-1 shrink-0" aria-hidden="true" />
              Orgullo Estudiantil e Innovación Serrana
            </h3>
            <p className="drop-cap mt-7 text-base text-ink-secondary leading-[1.75] max-w-[62ch]">
              <strong className="text-[#3D2314] font-semibold">MOTZ CAFÉ</strong> fue fundado con pasión y visión por estudiantes del{' '}
              <strong className="text-[#3D2314] font-semibold">{BRAND_INFO.institution}</strong>. Observando cómo el mejor grano de nuestra región se exportaba sin que la comunidad local disfrutara de su verdadero valor y excelencia, decidimos crear un templo del café que cerrara esa brecha.
            </p>
            <p className="mt-5 text-base text-ink-secondary leading-[1.75] max-w-[62ch]">
              Desde los métodos de extracción por goteo hasta nuestras infusiones con cacao y mazapán tradicional, cada receta es un tributo a las familias recolectoras de los parajes serranos de Motozintla.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              <li className="inline-flex items-center gap-1.5 bg-[#F4ECE1] text-[#3D2314] text-xs font-semibold px-3 py-1.5 rounded-full">
                <Sprout className="w-3.5 h-3.5 text-[#3E5A38]" aria-hidden="true" />
                Comercio Justo Directo
              </li>
              <li className="inline-flex items-center gap-1.5 bg-[#F4ECE1] text-[#3D2314] text-xs font-semibold px-3 py-1.5 rounded-full">
                <GraduationCap className="w-3.5 h-3.5 text-[#B85D36]" aria-hidden="true" />
                Emprendimiento Universitario
              </li>
            </ul>
          </article>

          {/* Origin data sheet */}
          <aside className="lg:col-span-5 lg:pl-12 lg:border-l border-[#EFE7DE]" aria-labelledby="perfil-origen">
            <span className="block text-[11px] tracking-[0.18em] uppercase font-bold text-ink-secondary">
              Perfil de origen
            </span>
            <h3 id="perfil-origen" className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#3D2314] leading-[1.2] tracking-tight">
              Sierra Madre de Chiapas
            </h3>
            <p className="mt-4 text-sm text-ink-secondary leading-relaxed">
              Suelos volcánicos ricos en minerales y microclimas de neblina templada que aportan una acidez cítrica brillante y cuerpo sedoso inigualable.
            </p>

            <StoryParallaxImage
              src="/videos/sierra-verde-mesa-poster.jpg"
              alt="Laderas verdes de la Sierra Madre de Chiapas"
              badge="Microclima templado"
              title="Laderas Nubosas"
              aspectRatio="aspect-[16/9]"
              parallaxSpeed={22}
              direction="down"
              reducedMotion={reducedMotion}
              className="mt-7"
              id="historia-img-laderas"
            />

            <dl className="mt-8 grid grid-cols-2 border-t border-[#EFE7DE]">
              <div className="pt-5 pr-4">
                <dt className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                  Altitud promedio
                </dt>
                <dd className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-[#3D2314] leading-none tabular-nums">
                  1,450<span className="text-2xl align-top ml-0.5">m</span>
                </dd>
              </div>
              <div className="pt-5 pl-5 border-l border-[#EFE7DE]">
                <dt className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                  Arábica Típica & Borbón
                </dt>
                <dd className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-[#3D2314] leading-none tabular-nums">
                  100%
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Core values as a manifesto list */}
        <ol className="mt-24 lg:mt-28 border-b border-[#EFE7DE]">
          {CORE_VALUES.map((val) => {
            const Icon = VALUE_ICONS[val.icon as keyof typeof VALUE_ICONS] ?? HeartHandshake;
            return (
              <li
                key={val.number}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-8 md:py-10 border-t border-[#EFE7DE]"
              >
                <div className="md:col-span-5 flex items-baseline gap-4">
                  <span className="font-serif text-base italic text-[#B85D36] tabular-nums" aria-hidden="true">
                    {val.number}.
                  </span>
                  <h4 className="font-serif text-3xl sm:text-4xl font-bold text-[#3D2314] leading-[1.15] tracking-tight">
                    {val.title}
                  </h4>
                </div>
                <div className="md:col-span-7 flex items-start gap-4">
                  <Icon className="w-4 h-4 mt-1 text-[#B85D36] shrink-0" aria-hidden="true" />
                  <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-[60ch]">
                    {val.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
