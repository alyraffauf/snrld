import { useCallback } from 'react'
import { useDeferredResource } from '../../hooks/useDeferredResource'
import { loadStringContent } from '../../lib/tangled/string/content'
import type { StringRecord } from '../../lib/tangled/string/types'
export function StringContent({ record }: { record: StringRecord }) {
  const load = useCallback(() => loadStringContent(record), [record])
  const { data, error } = useDeferredResource(record.uri, true, load)
  if (error) return <span role="alert">Could not load contents: {error.message}</span>
  return <>{data ?? 'Loading contents...'}</>
}
