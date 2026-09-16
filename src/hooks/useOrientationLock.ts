import { useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'

/**
 * Unlocks orientation (allowing free rotation) while the owning screen is
 * mounted, and re-locks to portrait when it unmounts. Used by screens that
 * opt into landscape support (currently the Timer and Complete screens);
 * every other screen implicitly stays portrait because nothing else unlocks it.
 */
export function useOrientationLock() {
  useEffect(() => {
    ScreenOrientation.unlockAsync()
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }
  }, [])
}
