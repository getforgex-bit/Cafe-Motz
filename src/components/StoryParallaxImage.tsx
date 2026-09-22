import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface StoryParallaxImageProps {
  src: string;
  alt: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: string;
  parallaxSpeed?: number;
  className?: string;
  direction?: 'up' | 'down';
  id?: string;
  reducedMotion?: boolean;
  /** Caption color set; 'light' is for captions sitting on a dark surface. */
  captionTone?: 'ink' | 'light';
}

export const StoryParallaxImage: React.FC<StoryParallaxImageProps> = ({
  src,
  alt,
  badge,
  title,
  subtitle,
  aspectRatio = 'aspect-[4/3]',
  parallaxSpeed = 32,
  className = '',
  direction = 'up',
  id,
  reducedMotion = false,
  captionTone = 'ink',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const shouldReduce = Boolean(reducedMotion || prefersReduced);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const delta = direction === 'up' ? [-parallaxSpeed, parallaxSpeed] : [parallaxSpeed, -parallaxSpeed];
  const y = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : delta);

  const light = captionTone === 'light';

  return (
    <figure id={id} className={className}>
      <div
        ref={containerRef}
        className={`group relative overflow-hidden rounded-2xl bg-[#F4ECE1] ${aspectRatio}`}
      >
        <motion.div
          style={{ y }}
          className="absolute -top-[14%] -bottom-[14%] -left-[4%] -right-[4%] w-[108%] h-[128%] will-change-transform"
        >
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>

      {(badge || title || subtitle) && (
        <figcaption className="mt-4 max-w-[38ch]">
          {badge && (
            <span
              className={`block text-[10px] uppercase tracking-[0.18em] font-bold ${
                light ? 'text-[#E9BDA7]' : 'text-ink-secondary'
              }`}
            >
              {badge}
            </span>
          )}
          {title && (
            <span
              className={`mt-1.5 block font-serif text-lg font-bold leading-snug ${
                light ? 'text-[#F9F5F0]' : 'text-[#3D2314]'
              }`}
            >
              {title}
            </span>
          )}
          {subtitle && (
            <span
              className={`mt-1 block font-serif italic text-sm leading-relaxed ${
                light ? 'text-[#E4D6CB]' : 'text-ink-secondary'
              }`}
            >
              {subtitle}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};
