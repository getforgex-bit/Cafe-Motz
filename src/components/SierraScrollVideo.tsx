import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, MotionValue } from 'motion/react';

interface SierraScrollVideoProps {
  scrollYProgress?: MotionValue<number>;
  range?: [number, number]; // progress range in Scrollytelling, default [0, 0.22]
  isReducedMotion?: boolean;
  className?: string;
  mistOpacity?: MotionValue<number>;
  videoMp4?: string;
  videoWebm?: string;
  poster?: string;
  alt?: string;
}

export const SierraScrollVideo: React.FC<SierraScrollVideoProps> = ({
  scrollYProgress,
  range = [0, 0.22],
  isReducedMotion = false,
  className = '',
  mistOpacity,
  videoMp4 = '/videos/sierra-madre.mp4',
  videoWebm = '/videos/sierra-madre.webm',
  poster = '/videos/sierra-madre-poster.jpg',
  alt = 'Video panorámico de la Sierra Madre de Chiapas que responde a la velocidad y dirección del scroll',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(20.0);
  const isLoadedRef = useRef<boolean>(true); // default true with fallback duration
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Speed and direction trackers
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const lastTimeRef = useRef<number>(performance.now());
  const lastProgressRef = useRef<number>(0);
  const lastProgressTimeRef = useRef<number>(performance.now());
  const currentDirectionRef = useRef<'forward' | 'reverse' | 'static'>('static');
  const currentSpeedRef = useRef<number>(0);
  const lastSeekTimeRef = useRef<number>(0);
  const lastHudUpdateTimeRef = useRef<number>(0);

  // User visible state indicators
  const [scrollState, setScrollState] = useState<{
    isScrolling: boolean;
    direction: 'forward' | 'reverse' | 'static';
    speed: number;
    currentTime: number;
    duration: number;
  }>({
    isScrolling: false,
    direction: 'static',
    speed: 0,
    currentTime: 0,
    duration: 20,
  });

  // Mode: 'scroll' (syncs with scroll) or 'auto' (continuous ambient playback)
  const [playbackMode, setPlaybackMode] = useState<'scroll' | 'auto'>('scroll');

  // Sync video duration when metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        durationRef.current = dur;
        isLoadedRef.current = true;
        setScrollState((prev) => ({ ...prev, duration: dur }));
      }
    }
  };

  const handleCanPlay = () => {
    isLoadedRef.current = true;
    if (videoRef.current?.duration) {
      durationRef.current = videoRef.current.duration;
    }
  };

  // Update target time and playback response to scroll activity
  const triggerScrollUpdate = useCallback(
    (direction: 'forward' | 'reverse', speedPxPerSec: number, newTargetTime?: number) => {
      if (playbackMode !== 'scroll') return;

      const video = videoRef.current;
      if (!video) return;

      isScrollingRef.current = true;
      currentDirectionRef.current = direction;
      currentSpeedRef.current = speedPxPerSec;

      if (newTargetTime !== undefined) {
        targetTimeRef.current = Math.max(0, Math.min(durationRef.current - 0.05, newTargetTime));
      }

      const now = performance.now();

      // Throttle HUD state updates to at most once every 100ms to preserve 60fps
      if (now - lastHudUpdateTimeRef.current > 100) {
        lastHudUpdateTimeRef.current = now;
        setScrollState((prev) => ({
          ...prev,
          isScrolling: true,
          direction,
          speed: speedPxPerSec,
        }));
      }

      // Active playback control (ultra-smooth hardware-accelerated playback)
      const target = targetTimeRef.current;
      // Seek video directly to target position, throttled to ~30ms for 60fps responsiveness
      if (Math.abs(video.currentTime - target) > 0.04 && now - lastSeekTimeRef.current > 30) {
        lastSeekTimeRef.current = now;
        if ('fastSeek' in video && typeof (video as unknown as { fastSeek: (t: number) => void }).fastSeek === 'function') {
          try {
            (video as unknown as { fastSeek: (t: number) => void }).fastSeek(target);
          } catch {
            video.currentTime = target;
          }
        } else {
          video.currentTime = target;
        }
      }

      if (direction === 'forward') {
        const speedRate = Math.max(0.75, Math.min(3.5, speedPxPerSec / 280 || 1.2));
        video.playbackRate = speedRate;
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else if (direction === 'reverse') {
        if (!video.paused) {
          video.pause();
        }
      }

      // Reset to static/pause when user stops scrolling
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        currentDirectionRef.current = 'static';
        currentSpeedRef.current = 0;

        // Snap to exact target time when stopped
        if (videoRef.current && playbackMode === 'scroll') {
          if (!videoRef.current.paused) {
            videoRef.current.pause();
          }
          const finalTarget = targetTimeRef.current;
          if (Math.abs(videoRef.current.currentTime - finalTarget) > 0.02) {
            videoRef.current.currentTime = finalTarget;
          }
        }

        setScrollState((prev) => ({
          ...prev,
          isScrolling: false,
          direction: 'static',
          speed: 0,
        }));
      }, 150);
    },
    [playbackMode]
  );

  // 1. Mobile touch & window scroll listener
  useEffect(() => {
    const handleScrollOrTouch = () => {
      const currentY = window.scrollY;
      const now = performance.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      const dy = currentY - lastScrollYRef.current;
      const speed = Math.round((Math.abs(dy) / dt) * 1000);

      lastScrollYRef.current = currentY;
      lastTimeRef.current = now;

      // Calculate progress in current scene
      let targetTime: number | undefined;
      if (scrollYProgress) {
        const progress = scrollYProgress.get();
        const [startRange, endRange] = range;
        if (progress < startRange - 0.05 || progress > endRange + 0.05) {
          return;
        }
        const normalized = Math.max(0, Math.min(1, (progress - startRange) / (endRange - startRange)));
        targetTime = normalized * durationRef.current;
      }

      if (dy > 0.5) {
        triggerScrollUpdate('forward', Math.max(120, speed), targetTime);
      } else if (dy < -0.5) {
        triggerScrollUpdate('reverse', Math.max(120, speed), targetTime);
      }
    };

    window.addEventListener('scroll', handleScrollOrTouch, { passive: true });
    window.addEventListener('wheel', handleScrollOrTouch, { passive: true });
    window.addEventListener('touchmove', handleScrollOrTouch, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrTouch);
      window.removeEventListener('wheel', handleScrollOrTouch);
      window.removeEventListener('touchmove', handleScrollOrTouch);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [triggerScrollUpdate, scrollYProgress, range]);

  // 2. Framer Motion scrollYProgress listener (100% reliable on mobile momentum & touch scroll)
  useEffect(() => {
    if (!scrollYProgress) return;

    const unsubscribe = scrollYProgress.on('change', (latestProgress) => {
      // Pause video when out of range to save battery and avoid background rendering
      if (
        (latestProgress < range[0] - 0.04 || latestProgress > range[1] + 0.04) &&
        videoRef.current &&
        !videoRef.current.paused &&
        playbackMode === 'scroll'
      ) {
        videoRef.current.pause();
        return;
      }

      const now = performance.now();
      const dt = Math.max(1, now - lastProgressTimeRef.current);
      const dP = latestProgress - lastProgressRef.current;

      lastProgressRef.current = latestProgress;
      lastProgressTimeRef.current = now;

      const [startRange, endRange] = range;
      const normalized = Math.max(0, Math.min(1, (latestProgress - startRange) / (endRange - startRange)));
      const newTargetTime = normalized * durationRef.current;
      const speedNormalized = Math.round((Math.abs(dP) / dt) * 120000);

      if (dP >= 0) {
        triggerScrollUpdate('forward', Math.max(150, speedNormalized), newTargetTime);
      } else {
        triggerScrollUpdate('reverse', Math.max(150, speedNormalized), newTargetTime);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, range, triggerScrollUpdate, playbackMode]);

  // 3. Mobile video initialization & autoplay unlock policy
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    try {
      video.load();
    } catch {
      // Ignored
    }

    // Silent play to unlock media engine on mobile
    const unlockMedia = () => {
      if (video && video.paused) {
        video
          .play()
          .then(() => {
            if (!isScrollingRef.current && playbackMode === 'scroll') {
              video.pause();
            }
          })
          .catch(() => {});
      }
    };

    unlockMedia();

    window.addEventListener('touchstart', unlockMedia, { passive: true });
    window.addEventListener('pointerdown', unlockMedia, { passive: true });
    window.addEventListener('scroll', unlockMedia, { passive: true });

    return () => {
      window.removeEventListener('touchstart', unlockMedia);
      window.removeEventListener('pointerdown', unlockMedia);
      window.removeEventListener('scroll', unlockMedia);
    };
  }, [playbackMode, videoMp4]);

  // 3b. Repaint recovery: when the page is hidden/shown, enters or leaves fullscreen, or is resized,
  // Chrome may drop the decoded frame of a paused video, leaving a transparent <video>
  // (only the scene's background color shows). Re-seek, or reload if needed, to restore the frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let resizeTimer: number | null = null;

    const restoreFrame = () => {
      const v = videoRef.current;
      if (!v || document.visibilityState !== 'visible') return;
      const target = Math.max(0, Math.min(durationRef.current - 0.05, targetTimeRef.current));
      if (v.readyState < 2) {
        const onLoaded = () => {
          v.currentTime = target;
        };
        v.addEventListener('loadeddata', onLoaded, { once: true });
        try {
          v.load();
        } catch {
          // Ignored
        }
        return;
      }
      // Tiny offset forces the compositor to paint a fresh frame even when the time is unchanged
      v.currentTime = target > 0.01 ? target - 0.001 : target + 0.001;
    };

    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(restoreFrame, 200);
    };

    document.addEventListener('visibilitychange', restoreFrame);
    document.addEventListener('fullscreenchange', restoreFrame);
    window.addEventListener('resize', onResize);
    window.addEventListener('pageshow', restoreFrame);

    return () => {
      document.removeEventListener('visibilitychange', restoreFrame);
      document.removeEventListener('fullscreenchange', restoreFrame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pageshow', restoreFrame);
      if (resizeTimer) window.clearTimeout(resizeTimer);
    };
  }, [videoMp4]);

  // 4. Update UI telemetry time indicator periodically
  useEffect(() => {
    let animId: number;
    const updateTimeLoop = () => {
      if (videoRef.current) {
        const time = videoRef.current.currentTime;
        setScrollState((prev) => {
          if (Math.abs(prev.currentTime - time) > 0.15) {
            return { ...prev, currentTime: time };
          }
          return prev;
        });
      }
      animId = requestAnimationFrame(updateTimeLoop);
    };
    animId = requestAnimationFrame(updateTimeLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 5. Handle manual switch to continuous 'auto' mode
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackMode === 'auto') {
      video.playbackRate = 0.75;
      video.play().catch(() => {});
    } else {
      if (!isScrollingRef.current) {
        video.pause();
      }
    }
  }, [playbackMode]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none bg-cover bg-center ${className}`}
      // Poster as a painted safety net: if the video frame is ever dropped, the landscape still shows
      style={{ backgroundImage: `url(${poster})` }}
    >
      {/* Optimized Video Element with Mobile Inline Hardware Playback */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        loop={playbackMode === 'auto'}
        preload="auto"
        poster={poster}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        aria-label={alt}
        className="w-full h-full object-cover filter saturate-[1.20] contrast-[1.06] brightness-[0.98] transition-opacity duration-300 pointer-events-none"
      >
        <source src={videoMp4} type="video/mp4" />
        {videoWebm && <source src={videoWebm} type="video/webm" />}
        <img
          src={poster}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </video>

      {/* Atmospheric Mountain Mist Layer (delicate, soft, non-intrusive) */}
      {mistOpacity ? (
        <motion.div
          style={{ opacity: mistOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent pointer-events-none"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none" />
      )}

      {/* Cinematic Edge Vignette to preserve typography contrast without washing out the video */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C2C1D]/40 via-transparent to-[#1C2C1D]/35 pointer-events-none" />
    </div>
  );
};
