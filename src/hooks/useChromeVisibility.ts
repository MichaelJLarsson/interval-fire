import { useState, useRef, useCallback } from 'react';

const HIDE_AFTER_MS = 4000;

/**
 * Manages the focus-mode chrome visibility on the Timer screen.
 * Chrome is hidden by default. Tap anywhere → reveal → auto-hide after 4s.
 */
export function useChromeVisibility() {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => setVisible(false), HIDE_AFTER_MS);
  }, []);

  const show = useCallback(() => {
    setVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  const resetTimer = useCallback(() => {
    if (visible) scheduleHide();
  }, [visible, scheduleHide]);

  const dismiss = useCallback(() => {
    clearHideTimer();
    setVisible(false);
  }, []);

  return { visible, show, resetTimer, dismiss };
}
