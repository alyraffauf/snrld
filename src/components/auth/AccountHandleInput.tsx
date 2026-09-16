import { useRef, useState, type ReactNode } from 'react'
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
    <div ref={containerRef} className="min-w-0 flex-1">
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
        className="w-full min-w-0 bg-transparent px-4 py-3 font-mono text-base text-ctp-text outline-none placeholder:text-ctp-overlay-0"
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
  if (isSearching) {
    return (
      <SuggestionPanel>
        <p className="px-3 py-2 text-sm text-ctp-overlay-1" role="status">
          Searching…
        </p>
      </SuggestionPanel>
    )
  }
  if (results.length === 0) return null

  return (
    <SuggestionPanel>
      <ul aria-label="Account suggestions" role="listbox">
        {results.map((actor) => (
          <li key={actor.did}>
            <button
              type="button"
              role="option"
              onClick={() => onSelect(actor.handle)}
              className="flex w-full flex-col px-3 py-2 text-left hover:bg-ctp-surface-0"
            >
              <span className="font-mono text-sm text-ctp-text">{actor.handle}</span>
              {actor.displayName && (
                <span className="text-xs text-ctp-overlay-1">{actor.displayName}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </SuggestionPanel>
  )
}

function SuggestionPanel({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded border border-ctp-surface-1 bg-ctp-mantle shadow-lg">
      {children}
    </div>
  )
}
