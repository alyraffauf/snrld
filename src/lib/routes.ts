import type { Handle } from '@atcute/lexicons'
import { isHandle } from '@atcute/lexicons/syntax'

export function parseHandle(value: string | undefined): Handle | null {
  return value !== undefined && isHandle(value) ? value : null
}
