/**
 * Cinematic Multi-Phase Smooth Scroll Utility
 *
 * Implements a dynamic displacement curve:
 * - Phase 1: Glides steadily through the scrollytelling section so the Sierra scroll
 *   video & origin scenes can be appreciated like in fast-forward / time-lapse ("cámara rápida perceptible").
 * - Phase 2: Once the scrollytelling section ends ("al acabar esa sección"), accelerates
 *   swiftly through the rest of the page and decelerates smoothly into the target (#menu).
 * - Includes user-interruption detection (wheel, touch, keydown) to immediately yield control.
 */

let activeAnimationId: number | null = null;
let abortListenersCleanup: (() => void) | null = null;

export interface CinematicScrollOptions {
  headerOffset?: number;
  onComplete?: () => void;
  reducedMotion?: boolean;
}

export function cinematicScrollToMenu(options?: CinematicScrollOptions): void {
  cinematicScrollToElement('menu', options);
}

export function cinematicScrollToElement(
  targetElementId: string,
  options?: CinematicScrollOptions
): void {
  // Cancel any ongoing programmatic scroll
  if (activeAnimationId !== null) {
    cancelAnimationFrame(activeAnimationId);
    activeAnimationId = null;
  }
  if (abortListenersCleanup) {
    abortListenersCleanup();
    abortListenersCleanup = null;
  }

  const targetEl = document.getElementById(targetElementId);
  if (!targetEl) return;

  const headerOffset = options?.headerOffset ?? 75;
  const startY = window.scrollY;
  const targetRect = targetEl.getBoundingClientRect();
  const targetY = Math.max(0, Math.round(targetRect.top + window.scrollY - headerOffset));

  // If already at or very close to target
  if (Math.abs(targetY - startY) < 15) {
    options?.onComplete?.();
    return;
  }

  // If reduced motion is requested by user or system
  const prefersReduced =
    options?.reducedMotion ||
    (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  if (prefersReduced) {
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    options?.onComplete?.();
    return;
  }

  // Locate the scrollytelling container to determine Phase 1 boundary
  const scrollyContainer = document.getElementById('scrollytelling-container');
  const scrollyStart = scrollyContainer ? scrollyContainer.offsetTop : 0;
  // In Scrollytelling, all 5 scenes conclude when sticky pin finishes: (height - viewport)
  const scrollyHeight = scrollyContainer ? scrollyContainer.offsetHeight : 0;
  const scrollyPinDistance = Math.max(0, scrollyHeight - window.innerHeight);
  const scrollyScenesEnd = scrollyStart + scrollyPinDistance;

  const isMovingDown = targetY > startY;
  const passesThroughScrolly =
    isMovingDown && scrollyContainer && startY < scrollyScenesEnd && targetY > scrollyStart;

  // CRITICAL: Disable CSS 'scroll-behavior: smooth' during rAF scroll
  // Otherwise, 60fps window.scrollTo calls fight the browser's native smooth-scroll engine,
  // causing the page to stutter/jerk at the start without advancing.
  const htmlEl = document.documentElement;
  const originalHtmlScrollBehavior = htmlEl.style.scrollBehavior;
  const originalBodyScrollBehavior = document.body.style.scrollBehavior;

  htmlEl.style.scrollBehavior = 'auto';
  document.body.style.scrollBehavior = 'auto';

  // Cleanup & abort function
  const abort = () => {
    if (activeAnimationId !== null) {
      cancelAnimationFrame(activeAnimationId);
      activeAnimationId = null;
    }
    if (abortListenersCleanup) {
      abortListenersCleanup();
      abortListenersCleanup = null;
    }
    // Restore CSS scroll behavior
    htmlEl.style.scrollBehavior = originalHtmlScrollBehavior;
    document.body.style.scrollBehavior = originalBodyScrollBehavior;
  };

  const startTime = performance.now();

  // Allow a 350ms initial grace period so the user's initial click / touch tap
  // doesn't trigger false-positive interrupt cancellation
  let interruptListening = false;
  const interruptTimer = window.setTimeout(() => {
    interruptListening = true;
  }, 350);

  const onUserInterrupt = (e: Event) => {
    if (!interruptListening) return;
    if (e.isTrusted) {
      abort();
    }
  };

  window.addEventListener('wheel', onUserInterrupt, { passive: true });
  window.addEventListener('touchstart', onUserInterrupt, { passive: true });
  window.addEventListener('keydown', onUserInterrupt, { passive: true });

  abortListenersCleanup = () => {
    window.clearTimeout(interruptTimer);
    window.removeEventListener('wheel', onUserInterrupt);
    window.removeEventListener('touchstart', onUserInterrupt);
    window.removeEventListener('keydown', onUserInterrupt);
  };

  if (!passesThroughScrolly) {
    // Standard direct smooth ease-out scroll when outside scrollytelling
    const distance = Math.abs(targetY - startY);
    const duration = Math.min(650, Math.max(350, distance * 0.45));

    const stepDirect = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentY = Math.round(startY + (targetY - startY) * ease);

      window.scrollTo({ top: currentY, left: 0, behavior: 'auto' });

      if (progress < 1) {
        activeAnimationId = requestAnimationFrame(stepDirect);
      } else {
        abort();
        options?.onComplete?.();
      }
    };

    activeAnimationId = requestAnimationFrame(stepDirect);
    return;
  }

  // --- Multi-Phase Cinematic Scroll ---
  // Phase 1: From startY through scrollytelling scenes (smooth, perceptible fast-forward timelapse)
  // Phase 2: Accelerates past scrollytelling into the menu
  const boundaryY = Math.min(scrollyScenesEnd, targetY);
  const distancePhase1 = boundaryY - startY;
  const distancePhase2 = Math.max(0, targetY - boundaryY);

  // Calibrate Phase 1 duration: ~1.8s for a full 5-scene run (~360ms per scene)
  // allows user to clearly perceive each scene in fast motion without blurring by
  const fullPinHeight = Math.max(1000, scrollyPinDistance);
  const phase1Ratio = Math.min(1, Math.max(0.2, distancePhase1 / fullPinHeight));
  const durationPhase1 = Math.round(1800 * phase1Ratio);

  // Phase 2 duration: fast swoop (~420ms)
  const durationPhase2 = distancePhase2 > 0 ? Math.min(460, Math.max(360, distancePhase2 * 0.25)) : 0;
  const totalDuration = durationPhase1 + durationPhase2;

  // Velocity at end of Phase 1 (px/ms):
  // f1(u) = 0.55 * u + 0.45 * u^2 -> f1'(1) = 0.55 + 2 * 0.45 = 1.45
  const endVelocityPhase1 = (distancePhase1 / durationPhase1) * 1.45;

  // Hermite interpolation parameter for Phase 2 continuity:
  const kHermite = distancePhase2 > 0
    ? Math.min(2.0, Math.max(1.0, (endVelocityPhase1 * durationPhase2) / distancePhase2))
    : 1.45;

  const stepCinematic = (now: number) => {
    const elapsed = now - startTime;

    if (elapsed <= durationPhase1) {
      // --- PHASE 1: Immediate steady motion, fast-forward timelapse through 5 scenes ---
      const u = Math.min(1, elapsed / durationPhase1);
      // Starts with steady slope (0.55) so scroll moves noticeably on frame 1 without delay,
      // and smoothly accelerates up to 1.45 by the end of Scene 5
      const ease1 = 0.55 * u + 0.45 * (u * u);
      const currentY = Math.round(startY + distancePhase1 * ease1);

      window.scrollTo({ top: currentY, left: 0, behavior: 'auto' });
      activeAnimationId = requestAnimationFrame(stepCinematic);
    } else if (elapsed < totalDuration && distancePhase2 > 0) {
      // --- PHASE 2: Accelerated descent past scrollytelling landing gently at #menu ---
      const tau = elapsed - durationPhase1;
      const w = Math.min(1, tau / durationPhase2);

      // Hermite cubic spline matching entry velocity and coming to rest at w = 1
      const ease2 = (3 - 2 * w) * (w * w) + kHermite * w * Math.pow(1 - w, 2);
      const currentY = Math.round(boundaryY + distancePhase2 * ease2);

      window.scrollTo({ top: currentY, left: 0, behavior: 'auto' });
      activeAnimationId = requestAnimationFrame(stepCinematic);
    } else {
      // Target reached
      window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
      abort();
      options?.onComplete?.();
    }
  };

  activeAnimationId = requestAnimationFrame(stepCinematic);
}
