import { useEffect, useRef, useState } from 'react'
import { parseResourceUri } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { useNavigate } from 'react-router-dom'
import { useRepoSearch } from '../../hooks/useRepoSearch'
import { useVisibleActor } from '../../hooks/useVisibleActor'
import { resolveMiniDoc } from '../../lib/actor'
import { getRepoName, getRepoRkey, type Repo } from '../../lib/tangled'
import { usePointerDownOutside } from '../../hooks/usePointerDownOutside'
import { ProfileAvatar } from '../profile/ProfileAvatar'

type RepoSearchProps = {
  initialQuery?: string
  size?: 'header' | 'page'
}

const searchStyles = {
  header: {
    form: 'ml-auto h-9 max-w-sm border border-ctp-surface-1 bg-ctp-mantle',
    input: 'h-full px-3 text-sm',
    button: 'h-full px-3',
  },
  page: {
    form: 'max-w-xl border border-ctp-surface-1 bg-ctp-mantle',
    input: 'px-4 py-3 text-base',
    button: 'px-4 py-3',
  },
}

export function RepoSearch({ initialQuery = '', size = 'page' }: RepoSearchProps) {
  const [query, setQuery] = useState('')
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [openError, setOpenError] = useState<Error | null>(null)
  const { results, isSearching, error } = useRepoSearch(query)
  const searchFormRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()
  const styles = searchStyles[size]

  usePointerDownOutside(searchFormRef, () => setIsSuggestionsOpen(false))

  useEffect(() => setQuery(initialQuery), [initialQuery])

  function submitSearch() {
    const normalizedQuery = query.trim()
    if (normalizedQuery.length === 0) return

    setIsSuggestionsOpen(false)
    navigate(`/search?q=${encodeURIComponent(normalizedQuery)}`)
  }

  async function selectRepo(repo: Repo) {
    setIsOpening(true)
    setOpenError(null)
    try {
      const owner = await resolveMiniDoc(parseResourceUri(repo.uri).repo)
      setQuery('')
      setIsSuggestionsOpen(false)
      navigate(`/${owner.handle}/${encodeURIComponent(getRepoRkey(repo))}`)
    } catch (error) {
      setOpenError(error instanceof Error ? error : new Error('Could not open repository.'))
    } finally {
      setIsOpening(false)
    }
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
        type="search"
        placeholder="Search..."
        aria-label="Search repositories"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpenError(null)
          setIsSuggestionsOpen(true)
        }}
        className={`min-w-0 flex-1 bg-transparent font-mono text-ctp-text outline-none placeholder:text-ctp-overlay-0 ${styles.input}`}
      />
      <button
        type="submit"
        aria-label="Search repositories"
        className={`font-mono text-ctp-overlay-1 hover:text-ctp-lavender ${styles.button}`}
      >
        →
      </button>

      {isSuggestionsOpen &&
        (isSearching || isOpening || error || openError || results.length > 0) && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded border border-ctp-surface-1 bg-ctp-mantle shadow-lg">
            {isSearching || isOpening ? (
              <p className="px-3 py-2 text-sm text-ctp-overlay-1" role="status">
                {isOpening ? 'Opening…' : 'Searching…'}
              </p>
            ) : error || openError ? (
              <p className="px-3 py-2 text-sm text-ctp-red" role="alert">
                {error?.message ?? openError?.message}
              </p>
            ) : (
              <ul aria-label="Repository suggestions" role="listbox">
                {results.map((repo) => (
                  <RepoSearchResult key={repo.uri} repo={repo} onSelect={selectRepo} />
                ))}
              </ul>
            )}
          </div>
        )}
    </form>
  )
}

type RepoSearchResultProps = {
  repo: Repo
  onSelect: (repo: Repo) => Promise<void>
}

function RepoSearchResult({ repo, onSelect }: RepoSearchResultProps) {
  const ownerIdentifier = parseResourceUri(repo.uri).repo
  const { actor, elementRef } = useVisibleActor(isDid(ownerIdentifier) ? ownerIdentifier : null)
  const ownerLabel = actor?.miniDoc.handle ?? ownerIdentifier

  return (
    <li ref={elementRef}>
      <button
        type="button"
        role="option"
        onClick={() => void onSelect(repo)}
        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-ctp-surface-0"
      >
        {actor ? (
          <ProfileAvatar
            miniDoc={actor.miniDoc}
            profile={actor.profile}
            bskyProfile={actor.bskyProfile}
            avatarUrl={actor.avatarUrl}
            size="small"
          />
        ) : (
          <span aria-hidden="true" className="size-8 shrink-0 rounded-full bg-ctp-surface-1" />
        )}

        <span className="min-w-0">
          <span className="block truncate font-mono text-sm text-ctp-text">
            {getRepoName(repo)}
          </span>
          <span className="block truncate text-xs text-ctp-overlay-1">{ownerLabel}</span>
          {repo.value.description && (
            <span className="line-clamp-1 block text-xs text-ctp-overlay-1">
              {repo.value.description}
            </span>
          )}
        </span>
      </button>
    </li>
  )
}
