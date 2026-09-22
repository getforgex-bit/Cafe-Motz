import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Coffee, CloudRain, Flame, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundscape, SOUNDSCAPE_PRESETS, SoundscapeType } from '../utils/soundscapeEngine';

interface AmbientAudioProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  currentPreset: SoundscapeType;
  onPresetChange: (preset: SoundscapeType) => void;
  hasActiveCart?: boolean;
}

export const AmbientAudio: React.FC<AmbientAudioProps> = ({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  currentPreset,
  onPresetChange,
  hasActiveCart = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Announce state changes to screen readers politely
  useEffect(() => {
    if (isPlaying) {
      const activePresetName = SOUNDSCAPE_PRESETS.find((p) => p.id === currentPreset)?.name || 'Cafetería';
      setAnnouncement(`Música de ${activePresetName} activada al ${Math.round(volume * 100)}% de volumen.`);
    } else {
      setAnnouncement('Música de cafetería pausada.');
    }
  }, [isPlaying, currentPreset]);

  // Close panel if clicked outside
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

  const activePreset = SOUNDSCAPE_PRESETS.find((p) => p.id === currentPreset) || SOUNDSCAPE_PRESETS[0];

  const getPresetIcon = (id: SoundscapeType) => {
    switch (id) {
      case 'chiapas-rain':
        return <CloudRain className="w-4 h-4 text-emerald-600" />;
      case 'roastery':
        return <Flame className="w-4 h-4 text-amber-600" />;
      case 'coffee-shop':
      default:
        return <Coffee className="w-4 h-4 text-[#B85D36]" />;
    }
  };

  return (
    <>
      {/* Invisible Screen Reader Live Region for Accessibility */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div
        ref={containerRef}
        className={`fixed z-40 transition-all duration-300 ${
          hasActiveCart
            ? 'bottom-[78px] left-3 sm:bottom-5 sm:left-6'
            : 'bottom-4 left-3 sm:bottom-5 sm:left-6'
        }`}
        id="ambient-audio-widget"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mb-3 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] max-h-[70vh] overflow-y-auto bg-[#FBF7F1]/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_20px_45px_rgba(61,35,20,0.20)] border border-[#EFE7DE] text-[#3D2314]"
              role="region"
              aria-label="Controles de música de cafetería"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#F4ECE1] flex items-center justify-center text-[#B85D36]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#3D2314] tracking-tight">
                      Música de Cafetería & Atmósfera
                    </h4>
                    <p className="text-[10px] text-ink-secondary">
                      {isPlaying ? 'Reproduciendo música Lo-Fi en vivo' : 'Pausado • Haz clic para reproducir'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-ink-secondary hover:text-[#3D2314] rounded-lg hover:bg-[#F4ECE1]/60 transition-colors"
                  aria-label="Cerrar panel de música"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Presets List */}
              <div className="mt-3 space-y-1.5" role="radiogroup" aria-label="Seleccionar estilo de música">
                <p className="text-[11px] font-semibold text-ink-secondary px-1 uppercase tracking-wider">
                  Estilo Musical & Atmósfera
                </p>
                {SOUNDSCAPE_PRESETS.map((preset) => {
                  const isSelected = currentPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        onPresetChange(preset.id);
                        if (!isPlaying) {
                          onTogglePlay();
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#F4ECE1] border-[#B85D36]/40'
                          : 'bg-[#FBF7F1] hover:bg-[#F9F5F0] border-transparent hover:border-[#EFE7DE]'
                      }`}
                    >
                      <div className="mt-0.5">{getPresetIcon(preset.id)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#3D2314]">
                            {preset.name}
                          </span>
                          {isSelected && isPlaying && (
                            <span className="inline-flex items-center gap-0.5">
                              <span className="w-1 h-2 bg-[#B85D36] rounded-full animate-pulse" />
                              <span className="w-1 h-3 bg-[#B85D36] rounded-full animate-pulse delay-75" />
                              <span className="w-1 h-1.5 bg-[#B85D36] rounded-full animate-pulse delay-150" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-ink-secondary line-clamp-2 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider Control */}
              <div className="mt-4 pt-3 border-t border-[#EFE7DE]">
                <div className="flex items-center justify-between text-xs mb-1.5 px-1">
                  <span className="font-semibold text-ink-secondary flex items-center gap-1.5 text-[11px]">
                    <Volume2 className="w-3.5 h-3.5 text-[#B85D36]" />
                    Volumen de la música
                  </span>
                  <span className="text-[11px] font-sans tabular-nums text-[#3D2314] font-medium">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  disabled={!isPlaying}
                  className="w-full h-1.5 bg-[#EFE7DE] rounded-lg appearance-none cursor-pointer accent-[#B85D36] disabled:opacity-40"
                  aria-label="Ajustar volumen de la música"
                />
              </div>

              {/* Toggle Action button in expanded menu */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#3D2314] text-white hover:bg-[#B85D36]'
                      : 'bg-[#B85D36] text-white hover:bg-[#3D2314]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Pausar Música</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Escuchar Música de Café</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pill Trigger */}
        <div className="flex items-center gap-1 bg-[#FBF7F1]/95 backdrop-blur-md border border-[#EFE7DE] p-1.5 rounded-full shadow-[0_6px_16px_rgba(61,35,20,0.10)] hover:shadow-[0_10px_24px_rgba(61,35,20,0.16)] transition-all duration-300">
          {/* Main Soundscape Toggle Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            aria-pressed={isPlaying}
            aria-label={
              isPlaying
                ? `Pausar música (${activePreset.name}). Volumen actual: ${Math.round(volume * 100)}%`
                : `Reproducir música de cafetería (${activePreset.name})`
            }
            id="ambient-sound-toggle-btn"
            className={`flex items-center gap-2 px-3 py-2 min-h-[44px] min-w-[44px] rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-[#3D2314] text-white hover:bg-[#B85D36]'
                : 'bg-[#F4ECE1] text-[#3D2314] hover:bg-[#EAE0D3]'
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-[#EFE7DE] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-ink-secondary" />
            )}

            <span className="hidden sm:inline">
              {isPlaying ? activePreset.badge : 'Música de Café'}
            </span>

            {/* Visual Equalizer Animation */}
            {isPlaying && (
              <span className="flex items-end gap-0.5 h-3 ml-0.5" aria-hidden="true">
                <span className="w-0.5 h-2.5 bg-[#EFE7DE] rounded-full eq-bar motion-reduce:animate-none [animation-duration:800ms]" />
                <span className="w-0.5 h-3 bg-[#EFE7DE] rounded-full eq-bar motion-reduce:animate-none [animation-duration:650ms]" />
                <span className="w-0.5 h-1.5 bg-[#EFE7DE] rounded-full eq-bar motion-reduce:animate-none [animation-duration:950ms]" />
              </span>
            )}
          </button>

          {/* Quick Settings Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Contraer ajustes de música' : 'Personalizar música y sonido'}
            className="relative p-2 text-ink-secondary hover:text-[#3D2314] hover:bg-[#F4ECE1] rounded-full transition-colors cursor-pointer before:content-[''] before:absolute before:-inset-1.5"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </>
  );
};
