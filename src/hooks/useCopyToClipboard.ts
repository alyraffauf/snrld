import { useEffect, useState } from 'react'

export type ClipboardStatus = 'idle' | 'copied' | 'failed'

const STATUS_RESET_DELAY_MS = 2000

export function useCopyToClipboard() {
  const [status, setStatus] = useState<ClipboardStatus>('idle')

  useEffect(() => {
    if (status === 'idle') return

    const timeoutId = window.setTimeout(() => setStatus('idle'), STATUS_RESET_DELAY_MS)
    return () => window.clearTimeout(timeoutId)
  }, [status])

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return { copy, status, reset: () => setStatus('idle') }
}
