import { isHandle } from '@atcute/lexicons/syntax'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActorSearch } from '../../hooks/useActorSearch'
import type { BlueskyActorSearchResult } from '../../lib/bsky/actorSearch'
import { usePointerDownOutside } from '../../hooks/usePointerDownOutside'

type ActorSearchProps = {
  variant: 'compact' | 'prominent'
}

const searchStyles = {
  compact: {
    form: 'ml-auto max-w-sm border-b border-ctp-surface-1',
    input: 'py-1 text-sm',
    button: 'px-2 py-1',
  },
  prominent: {
    form: 'max-w-xl border border-ctp-surface-1 bg-ctp-mantle',
    input: 'px-4 py-3 text-base',
    button: 'px-4 py-3',
  },
}

export function ActorSearch({ variant }: ActorSearchProps) {
  const [handleInput, setHandleInput] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const { results, isSearching } = useActorSearch(handleInput)
  const searchFormRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()
  const styles = searchStyles[variant]

  usePointerDownOutside(searchFormRef, () => setIsSuggestionsOpen(false))

  function selectActor(actor: BlueskyActorSearchResult) {
    setHandleInput('')
    setIsSuggestionsOpen(false)
    navigate(`/${actor.handle}`)
  }

  function submitSearch() {
    setIsSuggestionsOpen(false)

    const handle = handleInput.trim()
    if (!isHandle(handle)) {
      setIsInvalid(true)
      return
    }

    setIsInvalid(false)
    navigate(`/${handle}`)
  }

  return (
    <form
      ref={searchFormRef}
      className={`relative flex w-full min-w-0 items-center ${styles.form}`}
      onSubmit={(event) => {
        event.preventDefault()
        submitSearch()
      }}
    >
      <input
        type="text"
        placeholder="Search"
        aria-label="Profile handle"
        aria-invalid={isInvalid}
        value={handleInput}
        onChange={(event) => {
          setHandleInput(event.target.value)
          setIsInvalid(false)
          setIsSuggestionsOpen(true)
        }}
        className={`min-w-0 flex-1 bg-transparent font-mono text-ctp-text outline-none placeholder:text-ctp-overlay-0 ${styles.input}`}
      />
      <button
        type="submit"
        aria-label="View profile"
        className={`font-mono text-ctp-overlay-1 hover:text-ctp-lavender ${styles.button}`}
      >
        →
      </button>

      {isSuggestionsOpen && (isSearching || results.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded border border-ctp-surface-1 bg-ctp-mantle shadow-lg">
          {isSearching ? (
            <p className="px-3 py-2 text-sm text-ctp-overlay-1" role="status">
              Searching…
            </p>
          ) : (
            <ul aria-label="Profile suggestions" role="listbox">
              {results.map((actor) => (
                <li key={actor.did}>
                  <button
                    type="button"
                    role="option"
                    onClick={() => selectActor(actor)}
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
          )}
        </div>
      )}
    </form>
  )
}
