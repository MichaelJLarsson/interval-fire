import { useEffect, useRef } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'

/**
 * Unlocks orientation (allowing free rotation) while the owning screen is
 * mounted, and re-locks to portrait when it unmounts. Used by screens that
 * opt into landscape support (currently the Timer and Complete screens);
 * every other screen implicitly stays portrait because nothing else unlocks it.
 *
 * Call the returned `skipRelock()` before navigating to another screen that
 * also unlocks orientation (e.g. Timer -> Complete) so the two don't fight:
 * without it, this screen's unmount would force a portrait relock right
 * before the next screen immediately unlocks again, flashing portrait for
 * a frame in between.
 */
export function useOrientationLock() {
  const skipRelockRef = useRef(false)

  useEffect(() => {
    ScreenOrientation.unlockAsync()
    return () => {
      if (!skipRelockRef.current) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      }
    }
  }, [])

  return {
    skipRelock: () => {
      skipRelockRef.current = true
    },
  }
}
