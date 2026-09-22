import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface SceneScrollIndicatorProps {
  id?: string;
  label?: string;
  sublabel?: string;
  variant?: 'white' | 'dark' | 'coffee';
  darkTheme?: boolean; // backwards-compatible
  reducedMotion?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SceneScrollIndicator: React.FC<SceneScrollIndicatorProps> = ({
  id,
  label = 'desliza',
  sublabel,
  variant,
  darkTheme = false,
  reducedMotion = false,
  onClick,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();
  const shouldReduce = Boolean(reducedMotion || prefersReduced);

  // Resolve effective style variant:
  // 'white' = ivory over the Sierra footage (Scene 1)
  // 'dark' = ivory/linen over the espresso fields (Scenes 2-4)
  // 'coffee' = roasted ink over Leche Vaporizada (Scene 5)
  const resolvedVariant: 'white' | 'dark' | 'coffee' = variant ?? (darkTheme ? 'dark' : 'coffee');

  const textClass = {
    white: 'text-[#FBF7F1]/90 group-hover:text-[#FBF7F1] drop-shadow-[0_1px_6px_rgba(42,24,13,0.7)]',
    dark: 'text-[#FBF7F1]/80 group-hover:text-[#FBF7F1] drop-shadow-[0_1px_6px_rgba(20,10,4,0.6)]',
    coffee: 'text-[#3D2314]/80 group-hover:text-[#3D2314]',
  }[resolvedVariant];

  const chevronClass = {
    white: 'text-[#FBF7F1] drop-shadow-[0_2px_8px_rgba(42,24,13,0.7)]',
    dark: 'text-[#E9BDA7] group-hover:text-[#FBF7F1] drop-shadow-[0_2px_8px_rgba(20,10,4,0.6)]',
    coffee: 'text-[#A24E2C] group-hover:text-[#3D2314]',
  }[resolvedVariant];

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className={`group flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] bg-transparent border-0 p-2 rounded-lg cursor-pointer transition-all duration-200 ease-out select-none active:scale-95 motion-reduce:transform-none ${className}`}
      title={sublabel ? `${label} • ${sublabel}` : label}
      aria-label={sublabel ? `${label} hacia ${sublabel}` : label}
    >
      {label && (
        <span
          className={`text-[10px] tracking-[0.3em] uppercase font-semibold transition-colors duration-200 ${textClass}`}
        >
          {label}
        </span>
      )}

      <motion.div
        animate={shouldReduce ? {} : { y: [0, 4, 0], opacity: [0.75, 1, 0.75] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        <ChevronDown
          strokeWidth={1.75}
          className={`w-6 h-6 transition-colors duration-200 ${chevronClass}`}
          aria-hidden="true"
        />
      </motion.div>
    </button>
  );
};
