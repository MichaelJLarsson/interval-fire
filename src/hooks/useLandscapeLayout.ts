import { useRef, useState } from 'react'
import { useWindowDimensions } from 'react-native'

/**
 * Tracks whether the window is currently landscape. Once `freezeLandscape()`
 * is called, the value stops following live window-dimension changes.
 *
 * Screens that support landscape re-lock orientation to portrait on unmount
 * (see useOrientationLock). If a screen keeps reading live dimensions while
 * it navigates away, that re-lock's rotation can flip isLandscape mid-fade
 * and swap the whole layout branch while the outgoing screen is still
 * visible, tearing the transition. Call freezeLandscape() right before
 * navigating away to keep rendering the current layout untouched instead.
 */
export function useLandscapeLayout() {
  const { width, height } = useWindowDimensions()
  const [frozen, setFrozen] = useState(false)
  const isLandscapeRef = useRef(width > height)

  if (!frozen) {
    isLandscapeRef.current = width > height
  }

  return { isLandscape: isLandscapeRef.current, freezeLandscape: () => setFrozen(true) }
}
