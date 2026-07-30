import { useEffect } from 'react'

const APP_NAME = 'snrld'

export function useDocumentTitle(label?: string): void {
  useEffect(() => {
    document.title = label ? `${label} · ${APP_NAME}` : APP_NAME
  }, [label])
}
