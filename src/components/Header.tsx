import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isHandle } from '@atcute/lexicons/syntax'
import { searchBlueskyActors, type BlueskyActorSearchResult } from '../lib/bsky/actorSearch'

export function Header() {
  const [handleInput, setHandleInput] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [results, setResults] = useState<BlueskyActorSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const query = handleInput.trim()
    if (query.length < 2) {
      setResults([])
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsSearching(true)

      try {
        const actors = await searchBlueskyActors(query, controller.signal)
        setResults(actors)
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setResults([])
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 180)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [handleInput])

  function selectActor(actor: BlueskyActorSearchResult) {
    setHandleInput(actor.handle)
    setResults([])
    navigate(`/${actor.handle}`)
  }

  return (
    <header className="border-b border-ctp-surface-0 bg-ctp-crust">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-4"
      >
        <Link
          to="/"
          className="shrink-0 font-mono text-sm font-semibold tracking-wide text-ctp-text no-underline"
        >
          snrld
        </Link>

        <form
          className="relative ml-auto flex w-full max-w-sm min-w-0 items-center border-b border-ctp-surface-1"
          onSubmit={(event) => {
            event.preventDefault()

            const handle = handleInput.trim()
            if (!isHandle(handle)) {
              setIsInvalid(true)
              return
            }

            setIsInvalid(false)
            navigate(`/${handle}`)
          }}
        >
          <input
            type="text"
            placeholder="handle"
            aria-label="Profile handle"
            aria-invalid={isInvalid}
            value={handleInput}
            onChange={(event) => {
              setHandleInput(event.target.value)
              setIsInvalid(false)
            }}
            className="min-w-0 flex-1 bg-transparent py-1 font-mono text-sm text-ctp-text outline-none placeholder:text-ctp-overlay-0"
          />
          <button
            type="submit"
            aria-label="View profile"
            className="px-2 py-1 font-mono text-ctp-overlay-1 hover:text-ctp-lavender"
          >
            →
          </button>

          {(isSearching || results.length > 0) && (
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
      </nav>
    </header>
  )
}
