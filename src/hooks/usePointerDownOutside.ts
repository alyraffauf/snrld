import type { RefObject } from 'react'
import { useEffect } from 'react'

export function usePointerDownOutside<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!elementRef.current?.contains(event.target as Node)) {
        onOutside()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [elementRef, onOutside])
}
