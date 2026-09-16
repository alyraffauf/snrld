import { useRef, useState } from 'react'
import { useActorSearch } from '../../hooks/useActorSearch'
import { usePointerDownOutside } from '../../hooks/usePointerDownOutside'
import type { BlueskyActorSearchResult } from '../../lib/bsky/actorSearch'

type AccountHandleInputProps = {
  disabled?: boolean
}

export function AccountHandleInput({ disabled = false }: AccountHandleInputProps) {
  const [handleInput, setHandleInput] = useState('')
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const { results, isSearching } = useActorSearch(handleInput)
  const containerRef = useRef<HTMLDivElement>(null)

  usePointerDownOutside(containerRef, () => setIsSuggestionsOpen(false))

  function selectHandle(handle: string) {
    setHandleInput(handle)
    setIsSuggestionsOpen(false)
  }

  return (
    <div ref={containerRef}>
      <input
        id="handle"
        aria-label="Account handle"
        name="handle"
        type="text"
        placeholder="you.bsky.social"
        autoCapitalize="none"
        spellCheck={false}
        required
        disabled={disabled}
        value={handleInput}
        onChange={(event) => {
          setHandleInput(event.target.value)
          setIsSuggestionsOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' || event.key === 'Enter') {
            setIsSuggestionsOpen(false)
          }
        }}
        className="mt-2 w-full rounded border border-ctp-surface-1 bg-ctp-base px-3 py-2 text-ctp-text"
      />
      {isSuggestionsOpen && !disabled && (
        <AccountSuggestions results={results} isSearching={isSearching} onSelect={selectHandle} />
      )}
    </div>
  )
}

type AccountSuggestionsProps = {
  results: BlueskyActorSearchResult[]
  isSearching: boolean
  onSelect: (handle: string) => void
}

function AccountSuggestions({ results, isSearching, onSelect }: AccountSuggestionsProps) {
  if (isSearching) return <p role="status">Searching…</p>
  if (results.length === 0) return null

  return (
    <ul>
      {results.map((actor) => (
        <li key={actor.did}>
          <button
            type="button"
            onClick={() => onSelect(actor.handle)}
            className="w-full px-3 py-2 text-left hover:bg-ctp-surface-0"
          >
            {actor.handle}
          </button>
        </li>
      ))}
    </ul>
  )
}
