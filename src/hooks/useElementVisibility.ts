import { useCallback, useEffect, useState } from 'react'

const DEFAULT_ROOT_MARGIN = '200px'

type UseElementVisibilityOptions = {
  rootMargin?: string
}

export function useElementVisibility({
  rootMargin = DEFAULT_ROOT_MARGIN,
}: UseElementVisibilityOptions = {}) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useCallback((node: HTMLElement | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (element === null) return

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setIsVisible(true)
        observer.disconnect()
      },
      { rootMargin },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [element, rootMargin])

  return { elementRef, isVisible }
}
