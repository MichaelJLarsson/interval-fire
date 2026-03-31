import { useRef, useCallback, useState } from 'react';

const HIDE_DELAY_MS = 4000;

/**
 * Manages the timer screen's focus-mode chrome:
 * - Chrome auto-hides after HIDE_DELAY_MS of inactivity
 * - Any interaction (tap, button press) reveals and resets the timer
 * - Returns isVisible state + interaction handlers
 */
export function useChrome() {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY_MS);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  const hide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setIsVisible(false);
  }, []);

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    scheduleHide();
  }, [scheduleHide]);

  /** Call on any screen tap — reveals chrome if hidden, resets timer if visible */
  const handleTap = useCallback(() => {
    if (!isVisible) show();
    else resetHideTimer();
  }, [isVisible, show, resetHideTimer]);

  /** Call on button interactions to prevent auto-hide while user is active */
  const onInteraction = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  return {
    isVisible,
    show,
    hide,
    handleTap,
    onInteraction,
  };
}
