import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Mountain, Flame, Coffee, Users, UtensilsCrossed, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { SierraScrollVideo } from './SierraScrollVideo';
import { SceneScrollIndicator } from './SceneScrollIndicator';

interface ScrollytellingProps {
  reducedMotion: boolean;
  onExploreMenu: () => void;
}

/** Ultra-thin typographic stamp that replaces the old pill eyebrows. */
const SceneStamp: React.FC<{ children: React.ReactNode; tone?: 'light' | 'ink'; align?: 'start' | 'center' }> = ({
  children,
  tone = 'light',
  align = 'start',
}) => (
  <p
    className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] font-bold ${
      align === 'center' ? 'justify-center' : 'justify-center md:justify-start'
    } ${tone === 'light' ? 'text-[#FBF7F1]/85' : 'text-[#A24E2C]'}`}
  >
    <span aria-hidden="true" className={`h-px w-8 ${tone === 'light' ? 'bg-[#FBF7F1]/40' : 'bg-[#A24E2C]/40'}`} />
    <span>{children}</span>
  </p>
);

const SCENE_TOOLTIPS: Record<string, string> = {
  shot: 'Extracción de 36g de café Arábica de 1,450 msnm con notas florales y chocolate.',
  leche: 'Texturizada a 65°C para una microespuma sedosa y brillo natural sin burbujas gruesas.',
  mazapan: 'Cacahuate seleccionado y tostado en Motozintla con un toque ligero de azúcar de caña.',
};

export const Scrollytelling: React.FC<ScrollytellingProps> = ({ reducedMotion, onExploreMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeScene, setActiveScene] = useState(1);

  // Smooth scroll navigator to advance to next scene when tapping the indicator
  const handleScrollToNextScene = (sceneIndex: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const sceneTargets = [0.24, 0.48, 0.72, 0.92, 1.05];
    const targetProgress = sceneTargets[sceneIndex - 1] ?? sceneIndex * 0.22;

    if (sceneIndex >= 5) {
      onExploreMenu();
      return;
    }

    const targetY = containerTop + (containerHeight - window.innerHeight) * targetProgress;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  // Hook to track the scroll through the 5 scenes container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Scene 1: Heights & Mist (0.0 to 0.18, completely hidden beyond 0.19)
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 1], [1, 0.85, 0, 0]);
  const scene1Visibility = useTransform(scrollYProgress, (v) => (v >= 0.19 ? 'hidden' : 'visible'));
  const scene1Display = useTransform(scrollYProgress, (v) => (v >= 0.19 ? 'none' : 'flex'));
  const scene1Y = useTransform(scrollYProgress, [0, 0.18, 1], ['0px', '-40px', '-40px']);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.12, 1], [0.30, 0.0, 0.0]);
  const mountainScale = useTransform(scrollYProgress, [0, 0.2, 1], [1, 1.15, 1.15]);
  const mountainY = useTransform(scrollYProgress, [0, 0.2, 1], ['0%', '10%', '10%']);

  // Scene 2: Harvest & Roast (0.12 to 0.42)
  const scene2Opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.18, 0.36, 0.42, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const scene2Visibility = useTransform(scrollYProgress, (v) =>
    v >= 0.10 && v <= 0.44 ? 'visible' : 'hidden'
  );
  const scene2Display = useTransform(scrollYProgress, (v) =>
    v >= 0.10 && v <= 0.44 ? 'flex' : 'none'
  );
  const roastProgress = useTransform(scrollYProgress, [0, 0.16, 0.34, 1], [0, 0, 1, 1]);
  const roastLineHeight = useTransform(scrollYProgress, [0, 0.16, 0.34, 1], ['0%', '0%', '100%', '100%']);

  // Scene 3: Extraction & Latte Art (0.36 to 0.66)
  const scene3Opacity = useTransform(
    scrollYProgress,
    [0, 0.36, 0.42, 0.60, 0.66, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const scene3Visibility = useTransform(scrollYProgress, (v) =>
    v >= 0.34 && v <= 0.68 ? 'visible' : 'hidden'
  );
  const scene3Display = useTransform(scrollYProgress, (v) =>
    v >= 0.34 && v <= 0.68 ? 'flex' : 'none'
  );
  const espressoStreamHeight = useTransform(scrollYProgress, [0, 0.40, 0.48, 1], ['0%', '0%', '100%', '100%']);
  const milkFillHeight = useTransform(scrollYProgress, [0, 0.46, 0.54, 1], ['20%', '20%', '85%', '85%']);
  const latteArtScale = useTransform(scrollYProgress, [0, 0.50, 0.58, 1], [0, 0, 1, 1]);
  const tooltipsOpacity = useTransform(scrollYProgress, [0, 0.51, 0.56, 1], [0, 0, 1, 1]);

  // Scene 4: Motozintla Central Park Community (0.60 to 0.86)
  const scene4Opacity = useTransform(
    scrollYProgress,
    [0, 0.60, 0.66, 0.82, 0.86, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const scene4Visibility = useTransform(scrollYProgress, (v) =>
    v >= 0.58 && v <= 0.88 ? 'visible' : 'hidden'
  );
  const scene4Display = useTransform(scrollYProgress, (v) =>
    v >= 0.58 && v <= 0.88 ? 'flex' : 'none'
  );
  const warmLightIntensity = useTransform(scrollYProgress, [0, 0.62, 0.74, 1], [0.3, 0.3, 0.95, 0.95]);

  // Scene 5: Table Served & Release into Menu (0.76 to 1.0)
  const scene5Opacity = useTransform(scrollYProgress, [0, 0.76, 0.84, 1], [0, 0, 1, 1]);
  const scene5Visibility = useTransform(scrollYProgress, (v) => (v >= 0.75 ? 'visible' : 'hidden'));
  const scene5PointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.76 ? 'auto' : 'none'));
  const cupFloatingY = useTransform(scrollYProgress, [0, 0.84, 1], ['0%', '0%', '-40%']);
  const cupFloatingScale = useTransform(scrollYProgress, [0, 0.84, 1], [1, 1, 0.5]);

  // Global background color transformation (same stops as before):
  // opens in deep sierra shadow (hidden behind the Scene 1 video, so no cream flash when it fades),
  // holds espresso during the roast, warms into sunset amber, then settles on Leche Vaporizada
  // (#F9F5F0) so the prologue hands off to <Hero /> without a seam.
  const dynamicBg = useTransform(
    scrollYProgress,
    [0, 0.22, 0.32, 0.44, 0.64, 0.78, 0.90, 1],
    ['#2A180D', '#2A180D', '#3D2314', '#3D2314', '#2B150A', '#4A2514', '#F9F5F0', '#F9F5F0']
  );

  // Read-only presentation values (do not drive any scene logic)
  const navigatorOpacity = useTransform(scrollYProgress, [0, 0.84, 0.9, 1], [1, 1, 0, 0]);
  const canvasHandoffOpacity = useTransform(scrollYProgress, [0, 0.92, 0.99, 1], [0, 0, 1, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = v < 0.15 ? 1 : v < 0.39 ? 2 : v < 0.63 ? 3 : v < 0.84 ? 4 : 5;
    setActiveScene((prev) => (prev === next ? prev : next));
  });

  const scenes = [
    { id: 1, label: 'La Sierra', icon: Mountain },
    { id: 2, label: 'Cosecha & Tueste', icon: Flame },
    { id: 3, label: 'Extracción & Arte', icon: Coffee },
    { id: 4, label: 'Comunidad', icon: Users },
    { id: 5, label: 'Menú Vivo', icon: UtensilsCrossed },
  ];

  // If user has reduced motion enabled or toggled, show the static editorial prologue
  if (reducedMotion) {
    const chapters = [
      {
        stamp: 'Escena I · 1,450 msnm',
        title: 'El Origen en las Alturas',
        body: 'Nacidos a más de 1,200 metros de altura en la Sierra Madre de Chiapas. Suelos volcánicos ricos en minerales, bosques de niebla y microclimas ideales.',
      },
      {
        stamp: 'Escena II · Tueste a 210°C',
        title: 'Cosecha & Tueste Medio',
        body: 'Recolectamos y tostamos en pequeños lotes para capturar las notas dulces y achocolatadas de nuestra región con comercio justo.',
      },
      {
        stamp: 'Escena III · Servido a 65°C',
        title: 'Mazapán Latte de la Casa',
        body: 'Doble shot chiapaneco, leche vaporizada sedosa a 65°C y mazapán artesanal de cacahuate tostado servido en cerámica local.',
      },
    ];

    return (
      <section id="scrollytelling-static" className="pt-28 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#3D2314] leading-[1.1] tracking-tight">
                El Viaje de MOTZ CAFÉ
              </h2>
              <p className="mt-5 text-base text-ink-secondary leading-relaxed max-w-[44ch]">
                Desde las cumbres nebulosas de Motozintla hasta la extracción artesanal en tu taza.
              </p>
            </div>
            <figure className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl bg-[#F4ECE1]">
                <img
                  src="/videos/sierra-madre-poster.jpg"
                  alt="Verdes montañas de la Sierra Madre de Chiapas cubiertas de niebla"
                  className="w-full aspect-[16/9] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.18em] font-bold text-ink-secondary">
                1,450 msnm, Sierra Madre de Chiapas
              </figcaption>
            </figure>
          </div>

          <ol className="mt-14 grid grid-cols-1 md:grid-cols-3 border-t border-[#EFE7DE]">
            {chapters.map((chapter, i) => (
              <li
                key={chapter.title}
                className={`pt-7 pb-8 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-[#EFE7DE] md:pl-8' : ''} ${
                  i < chapters.length - 1 ? 'md:pr-8' : ''
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#A24E2C]">
                  {chapter.stamp}
                </span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#3D2314] leading-[1.2] tracking-tight">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-sm text-ink-secondary leading-relaxed max-w-[40ch]">{chapter.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6">
            <button
              type="button"
              onClick={onExploreMenu}
              className="inline-flex items-center gap-2 min-h-[48px] bg-[#3D2314] hover:bg-[#B85D36] text-white text-sm font-semibold px-6 rounded-lg transition-colors duration-200"
            >
              <span>Ir Directo al Menú Digital</span>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="scrollytelling-container"
      className="relative h-[480vh] w-full"
      aria-label="Experiencia de Scrollytelling de Motz Café"
    >
      {/* Sticky Viewport Pin (Height: 100vh, top: 0) */}
      <motion.div
        style={{ backgroundColor: dynamicBg }}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none"
      >
        {/* Scene micro-timeline: a breath over the horizon, fades out before the light Scene 5 */}
        <motion.nav
          style={{ opacity: navigatorOpacity }}
          aria-label="Escenas del recorrido"
          className="absolute top-20 left-0 right-0 z-30 px-4 max-w-2xl mx-auto pointer-events-none"
        >
          <div className="relative bg-[#3D2314]/30 backdrop-blur-md border border-white/10 rounded-full px-3 sm:px-4 overflow-hidden">
            <ol className="flex items-center justify-between h-7">
              {scenes.map((scene) => {
                const Icon = scene.icon;
                const isActive = activeScene === scene.id;
                return (
                  <li
                    key={scene.id}
                    aria-current={isActive ? 'step' : undefined}
                    className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 ${
                      isActive ? 'text-[#FBF7F1]' : 'text-[#FBF7F1]/60'
                    }`}
                  >
                    <Icon
                      className={`w-3 h-3 transition-colors duration-300 ${isActive ? 'text-[#E9BDA7]' : 'text-[#FBF7F1]/50'}`}
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">{scene.label}</span>
                    <span className="sm:hidden sr-only">{scene.label}</span>
                  </li>
                );
              })}
            </ol>
            <motion.span
              aria-hidden="true"
              style={{ scaleX: scrollYProgress }}
              className="absolute left-0 right-0 bottom-0 h-px bg-[#E9BDA7] origin-left"
            />
          </div>
        </motion.nav>

        {/* ---------------------------------------------------- */}
        {/* ESCENA 1: EL ORIGEN EN LAS ALTURAS (LA SIERRA)       */}
        {/* ---------------------------------------------------- */}
        <motion.div
          style={{
            opacity: scene1Opacity,
            visibility: scene1Visibility,
            display: scene1Display,
          }}
          className="absolute inset-0 z-10 flex items-end justify-center md:justify-start px-6 sm:px-12 lg:px-20 pb-32 sm:pb-36 pointer-events-none"
        >
          {/* Panoramic Mountain Landscape Background (Video Interactivo Sincronizado con Scroll) */}
          <motion.div
            style={{ scale: mountainScale, y: mountainY }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <SierraScrollVideo
              scrollYProgress={scrollYProgress}
              range={[0, 0.22]}
              isReducedMotion={reducedMotion}
              mistOpacity={mistOpacity}
            />
          </motion.div>

          {/* Lens scrim + soft vignette: legibility without boxes, sky left clear */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-[#2A180D]/80 via-[#2A180D]/10 to-[#2A180D]/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(42,24,13,0.35)_100%)]"
          />

          {/* Documentary lower-third title card */}
          <motion.div style={{ y: scene1Y }} className="relative z-10 max-w-3xl text-center md:text-left">
            <SceneStamp>
              Escena I<span className="hidden sm:inline"> · La Sierra Madre de Chiapas</span> · 1,450 msnm
            </SceneStamp>
            <h2 className="mt-5 font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#FBF7F1] leading-[1.05] tracking-tight drop-shadow-[0_2px_12px_rgba(30,15,8,0.7)] text-balance">
              El Origen en las Alturas
            </h2>
            <blockquote className="relative mt-8 mx-auto md:mx-0 max-w-[34ch] md:pl-8">
              <span
                aria-hidden="true"
                className="hidden md:block absolute -left-1 -top-3 font-serif text-6xl leading-none text-[#E9BDA7]/80"
              >
                &ldquo;
              </span>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#FBF7F1]/90 leading-relaxed drop-shadow-[0_1px_8px_rgba(30,15,8,0.6)]">
                <span className="md:hidden">&ldquo;</span>
                Nacidos a más de 1,200 metros de altura en la Sierra Madre de Chiapas. Aquí empieza nuestro viaje.&rdquo;
              </p>
            </blockquote>
            <button
              type="button"
              onClick={onExploreMenu}
              id="hero-access-menu-btn"
              className="mt-9 md:ml-8 inline-flex items-center gap-2 min-h-[44px] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#FBF7F1] bg-[#2A180D]/20 hover:bg-[#FBF7F1]/15 backdrop-blur-sm border border-white/20 hover:border-white/40 px-4 rounded-full transition-all duration-200 ease-out cursor-pointer pointer-events-auto"
              title="Acceder al menú"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#E9BDA7]" aria-hidden="true" />
              <span>Saltar directo al menú</span>
            </button>
          </motion.div>

          {/* Subtle pulsating chevron arrow guide for Scene 1 */}
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <SceneScrollIndicator
              id="scroll-guide-scene-1"
              label="desliza"
              variant="white"
              reducedMotion={reducedMotion}
              onClick={() => handleScrollToNextScene(1)}
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------- */}
        {/* ESCENA 2: LA COSECHA Y EL TOSTADO ARTESANAL          */}
        {/* ---------------------------------------------------- */}
        <motion.div
          style={{
            opacity: scene2Opacity,
            visibility: scene2Visibility,
            display: scene2Display,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-12 pt-24 sm:pt-28 pb-24 pointer-events-none"
        >
          <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 items-center">
            {/* Cherry → roast micro-detail */}
            <figure className="md:col-span-5 flex flex-col items-center md:items-start">
              <div className="relative w-36 h-36 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-[#2A180D] shadow-[0_16px_36px_rgba(20,10,4,0.35)]">
                <img
                  src="https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=700&q=80"
                  alt="Cerezas maduras de café en Chiapas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <motion.div style={{ opacity: roastProgress }} className="absolute inset-0 bg-[#3D2314]">
                  <img
                    src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=700&q=80"
                    alt="Granos tostados artesanalmente"
                    className="w-full h-full object-cover filter brightness-90"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              </div>

              <div className="mt-3 sm:mt-4 flex items-start gap-3 sm:gap-4 w-64 sm:w-72">
                {/* Roast progress hairline */}
                <div className="w-px h-9 sm:h-12 bg-[#FBF7F1]/15 relative overflow-hidden shrink-0" aria-hidden="true">
                  <motion.div style={{ height: roastLineHeight }} className="w-full bg-[#E9BDA7]" />
                </div>
                <figcaption className="text-xs text-[#DCCBBE] leading-relaxed">
                  Cerezas de Estricta Altura
                  <ArrowRight className="inline w-3 h-3 mx-1.5 text-[#E9BDA7] -mt-0.5" aria-hidden="true" />
                  Tueste Medio con Aromas de Cacao
                </figcaption>
              </div>
            </figure>

            {/* Editorial text directly on the espresso field */}
            <div className="md:col-span-7 text-center md:text-left">
              <SceneStamp>Escena II · El Fuego y la Tradición</SceneStamp>
              <h2 className="mt-4 sm:mt-5 font-serif text-3xl sm:text-5xl font-bold text-[#FBF7F1] leading-[1.1] tracking-tight text-balance">
                La Cosecha & El Tostado Artesanal
              </h2>
              <p className="mt-4 sm:mt-5 font-serif italic text-base sm:text-xl text-[#DCCBBE] leading-relaxed max-w-[44ch] mx-auto md:mx-0">
                &ldquo;Honestidad y respeto por nuestra tierra: recolectamos y tostamos en pequeños lotes para capturar las notas dulces y achocolatadas de nuestra región.&rdquo;
              </p>

              <dl className="mt-6 sm:mt-8 grid grid-cols-2 max-w-md mx-auto md:mx-0 border-t border-[#FBF7F1]/15 text-left">
                <div className="pt-4 pr-4">
                  <dt className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E9BDA7]">Tueste</dt>
                  <dd className="mt-1.5">
                    <span className="block font-serif text-4xl font-bold text-[#FBF7F1] leading-none tabular-nums">210°C</span>
                    <span className="mt-1.5 block text-xs text-[#DCCBBE]">En lotes pequeños</span>
                  </dd>
                </div>
                <div className="pt-4 pl-5 border-l border-[#FBF7F1]/15">
                  <dt className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E9BDA7]">Cosecha</dt>
                  <dd className="mt-1.5">
                    <span className="block font-serif text-2xl font-bold text-[#FBF7F1] leading-tight">Selectiva</span>
                    <span className="mt-1.5 block text-xs text-[#DCCBBE]">A mano, fruto por fruto</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Subtle pulsating chevron arrow guide for Scene 2 */}
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <SceneScrollIndicator
              id="scroll-guide-scene-2"
              label="desliza"
              darkTheme={true}
              reducedMotion={reducedMotion}
              onClick={() => handleScrollToNextScene(2)}
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------- */}
        {/* ESCENA 3: LA EXTRACCIÓN Y EL ARTE BARISTA            */}
        {/* ---------------------------------------------------- */}
        <motion.div
          style={{
            opacity: scene3Opacity,
            visibility: scene3Visibility,
            display: scene3Display,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-12 pt-24 sm:pt-28 pb-24"
        >
          <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
            <SceneStamp align="center">Escena III · El Ritual Barista</SceneStamp>
            <h2 className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FBF7F1] leading-[1.1] tracking-tight">
              La Extracción y el Arte Barista
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#DCCBBE] max-w-lg">
              El ensamble perfecto: Mazapán Latte insignia de Motozintla servido a{' '}
              <span className="font-serif text-lg sm:text-xl font-bold text-[#FBF7F1] tabular-nums">65°C</span>.
            </p>

            {/* Central Ceramic Cup with Liquid Extraction Simulation */}
            <div className="relative mt-8 w-72 sm:w-80 h-64 sm:h-72 flex items-center justify-center">
              <div className="relative w-56 sm:w-64 h-48 sm:h-56 bg-gradient-to-b from-[#F4ECE1] to-[#E5D7C6] rounded-b-[4.5rem] rounded-t-[1.5rem] border-4 border-[#EFE7DE] shadow-[0_20px_40px_rgba(20,10,4,0.35)] p-4 flex flex-col items-center justify-end overflow-hidden">
                {/* Cup Handle */}
                <div className="absolute -right-7 top-10 w-12 h-24 rounded-r-3xl border-4 border-[#EFE7DE] bg-transparent -z-10" />

                {/* Animated Rising Steam */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none z-30">
                  <span className="w-1.5 h-8 bg-white/60 rounded-full blur-[2px] animate-steam-1" />
                  <span className="w-2 h-10 bg-white/70 rounded-full blur-[2px] animate-steam-2" />
                  <span className="w-1.5 h-8 bg-white/50 rounded-full blur-[2px] animate-steam-3" />
                </div>

                {/* Falling Espresso Stream */}
                <motion.div
                  style={{ height: espressoStreamHeight }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 bg-gradient-to-b from-[#3D2314] to-[#4A1B00] rounded-b-full z-20"
                />

                {/* Cup Liquid Base (Espresso turning into textured milk) */}
                <motion.div
                  style={{ height: milkFillHeight }}
                  className="w-full bg-gradient-to-t from-[#3D2314] via-[#7B3814] to-[#C99E7A] rounded-b-[3.8rem] rounded-t-2xl relative overflow-hidden flex items-center justify-center p-2 transition-all duration-300"
                >
                  {/* Latte Art & Mazapán Rosette */}
                  <motion.div
                    style={{ scale: latteArtScale }}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-[#FFF8E7]/80 bg-radial from-[#FFF8E7] via-[#DFB892] to-transparent flex items-center justify-center"
                  >
                    <span className="text-[9px] font-serif font-bold text-[#3D2314] tracking-tight">MOTZ</span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Micro-interaction annotations (ghost chips, dot = ingredient color key) */}
              <motion.div style={{ opacity: tooltipsOpacity }} className="absolute inset-0 pointer-events-auto">
                {[
                  { key: 'shot', label: 'Doble shot chiapaneco', dot: 'bg-[#3D2314] border border-[#E9BDA7]/60', pos: '-top-2 -left-4 sm:left-0' },
                  { key: 'leche', label: 'Leche vaporizada cremosa', dot: 'bg-[#FFF8E7]', pos: 'top-24 -right-6 sm:-right-8' },
                  { key: 'mazapan', label: 'Mazapán artesanal de cacahuate', dot: 'bg-[#B85D36]', pos: '-bottom-3 left-2 sm:left-8' },
                ].map((tip) => (
                  <button
                    key={tip.key}
                    type="button"
                    aria-pressed={activeTooltip === tip.key}
                    onClick={() => setActiveTooltip(activeTooltip === tip.key ? null : tip.key)}
                    className={`absolute ${tip.pos} inline-flex items-center gap-1.5 min-h-[32px] px-3 rounded-full text-[11px] font-semibold backdrop-blur-sm border transition-colors duration-200 cursor-pointer ${
                      activeTooltip === tip.key
                        ? 'bg-[#FBF7F1]/15 border-[#E9BDA7]/70 text-[#FBF7F1]'
                        : 'bg-[#2A180D]/40 border-white/20 text-[#FBF7F1] hover:border-white/40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full inline-block ${tip.dot}`} aria-hidden="true" />
                    <span>{tip.label}</span>
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Active annotation detail: a hairline note, no box */}
            <div className="mt-8 min-h-[3rem] max-w-sm" aria-live="polite">
              <AnimatePresence mode="wait">
                {activeTooltip && (
                  <motion.p
                    key={activeTooltip}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="pt-3 border-t border-[#FBF7F1]/20 text-xs sm:text-sm text-[#DCCBBE] leading-relaxed"
                  >
                    {SCENE_TOOLTIPS[activeTooltip]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Subtle pulsating chevron arrow guide for Scene 3 */}
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <SceneScrollIndicator
              id="scroll-guide-scene-3"
              label="desliza"
              darkTheme={true}
              reducedMotion={reducedMotion}
              onClick={() => handleScrollToNextScene(3)}
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------- */}
        {/* ESCENA 4: EL PUNTO DE ENCUENTRO EN MOTOZINTLA        */}
        {/* ---------------------------------------------------- */}
        <motion.div
          style={{
            opacity: scene4Opacity,
            visibility: scene4Visibility,
            display: scene4Display,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-12 pt-24 sm:pt-28 pb-24 pointer-events-none"
        >
          <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 items-center">
            <figure className="md:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(20,10,4,0.35)] aspect-[16/9] sm:aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"
                  alt="Cafetería cálida e iluminada al atardecer frente al Parque Central"
                  className="w-full h-full object-cover filter contrast-[1.05]"
                  loading="lazy"
                  decoding="async"
                />
                {/* Sunset glow effect */}
                <motion.div
                  style={{ opacity: warmLightIntensity }}
                  className="absolute inset-0 bg-gradient-to-tr from-[#3D2314]/70 via-[#B85D36]/30 to-[#C08A42]/20 mix-blend-color-dodge"
                />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.2em] font-bold text-[#E9BDA7] text-center md:text-left">
                Esquina 2a. Av. Norte y Calle Central Ote. · Parque Central
              </figcaption>
            </figure>

            <div className="md:col-span-6 text-center md:text-left">
              <SceneStamp>Escena IV · Raíces & Comunidad</SceneStamp>
              <h2 className="mt-4 sm:mt-5 font-serif text-3xl sm:text-5xl font-bold text-[#FBF7F1] leading-[1.1] tracking-tight text-balance">
                El Punto de Encuentro en Motozintla
              </h2>
              <p className="mt-4 sm:mt-5 font-serif italic text-base sm:text-xl text-[#DCCBBE] leading-relaxed max-w-[40ch] mx-auto md:mx-0">
                &ldquo;Un espacio de comunidad. Creado por manos jóvenes para que cada sorbo se sienta como estar en casa.&rdquo;
              </p>
              <p className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#FBF7F1]/15 text-xs sm:text-sm text-[#E9BDA7] leading-relaxed max-w-[48ch] mx-auto md:mx-0">
                Fundada por estudiantes del TecNM Campus Frontera Comalapa para honrar el trabajo de las familias campesinas de la Sierra.
              </p>
            </div>
          </div>

          {/* Subtle pulsating chevron arrow guide for Scene 4 */}
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <SceneScrollIndicator
              id="scroll-guide-scene-4"
              label="desliza"
              darkTheme={true}
              reducedMotion={reducedMotion}
              onClick={() => handleScrollToNextScene(4)}
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------- */}
        {/* ESCENA 5: LA CARTA VIVA Y LA MESA ESTÁ SERVIDA       */}
        {/* ---------------------------------------------------- */}
        <motion.div
          style={{
            opacity: scene5Opacity,
            visibility: scene5Visibility,
            pointerEvents: scene5PointerEvents,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-end px-6 pb-28 sm:pb-32 text-center"
        >
          {/* Sierra Verde video, visible in the upper half; canvas rises from below */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <SierraScrollVideo
              scrollYProgress={scrollYProgress}
              range={[0.76, 1.0]}
              isReducedMotion={reducedMotion}
              videoMp4="/videos/sierra-verde-mesa.mp4"
              videoWebm="/videos/sierra-verde-mesa.webm"
              poster="/videos/sierra-verde-mesa-poster.jpg"
              alt="Video de la Sierra Verde de Chiapas interactivo con scroll"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#F9F5F0] via-[#F9F5F0]/60 to-[#F9F5F0]/10"
            />
            {/* Final handoff: the last frame is exactly Leche Vaporizada, matching <Hero /> */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: canvasHandoffOpacity }}
              className="absolute inset-0 bg-[#F9F5F0]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-3xl pointer-events-auto">
            {/* Gliding cup transforming into header emblem */}
            <motion.div
              style={{ y: cupFloatingY, scale: cupFloatingScale }}
              className="w-14 h-14 rounded-full bg-[#3D2314] text-[#F9F5F0] flex items-center justify-center shadow-[0_12px_28px_rgba(61,35,20,0.14)] mb-7"
            >
              <Coffee className="w-7 h-7 text-[#EFE7DE]" aria-hidden="true" />
            </motion.div>

            <SceneStamp tone="ink" align="center">Escena V · La Mesa Está Servida</SceneStamp>
            <h2 className="mt-5 font-serif text-4xl sm:text-6xl font-bold text-[#3D2314] leading-[1.05] tracking-tight max-w-2xl text-balance">
              La Carta Viva de MOTZ CAFÉ
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#6B5644] leading-relaxed max-w-[48ch]">
              Explora las creaciones de estricta altura, bebidas frías, combos serranos y repostería artesanal recién horneada.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 items-center">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 min-h-[48px] bg-[#3D2314] hover:bg-[#B85D36] text-white text-sm font-semibold px-7 rounded-lg shadow-[0_8px_24px_rgba(61,35,20,0.14)] transition-all duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer"
                id="scrolly-explore-menu-btn"
              >
                <UtensilsCrossed className="w-4 h-4" aria-hidden="true" />
                <span>Ver Menú Completo & Ordenar</span>
              </button>
              <a
                href="#historia"
                className="inline-flex items-center gap-2 min-h-[48px] bg-[#F9F5F0]/60 hover:bg-[#FBF7F1] backdrop-blur-sm text-[#3D2314] text-sm font-semibold px-6 rounded-lg border border-[#3D2314]/15 transition-colors duration-200 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#B85D36]" aria-hidden="true" />
                <span>Conoce Nuestra Historia</span>
              </a>
            </div>
          </div>

          {/* Subtle pulsating chevron arrow guide for Scene 5 */}
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <SceneScrollIndicator
              id="scroll-guide-scene-5"
              label="explorar"
              reducedMotion={reducedMotion}
              onClick={() => handleScrollToNextScene(5)}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
