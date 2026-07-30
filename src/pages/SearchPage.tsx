import { parseResourceUri } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { useSearchParams } from 'react-router-dom'
import { RepoSearch } from '../components/repo/RepoSearch'
import { RepoSearchResult } from '../components/repo/RepoSearchResult'
import { PageContainer } from '../components/layout/PageContainer'
import { useRepoSearch } from '../hooks/useRepoSearch'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useVisibleActor } from '../hooks/useVisibleActor'
import type { Repo } from '../lib/tangled'

const RESULTS_LIMIT = 50

export function SearchPage() {
  useDocumentTitle('Search')

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const { results, isSearching, error } = useRepoSearch(query, {
    limit: RESULTS_LIMIT,
    minimumQueryLength: 1,
  })

  return (
    <main>
      <PageContainer className="py-8">
        <h1 className="font-mono text-2xl font-bold text-ctp-text">Search</h1>
        <div className="mt-5 max-w-xl">
          <RepoSearch initialQuery={query} />
        </div>

        {query.length === 0 ? (
          <p className="mt-8 text-sm text-ctp-subtext-0">
            Enter a search query to find repositories.
          </p>
        ) : isSearching ? (
          <p className="mt-8 text-sm text-ctp-subtext-0" role="status">
            Searching…
          </p>
        ) : error ? (
          <p className="mt-8 text-sm text-ctp-red" role="alert">
            Could not search repositories: {error.message}
          </p>
        ) : results.length === 0 ? (
          <p className="mt-8 text-sm text-ctp-subtext-0">No repositories found for “{query}”.</p>
        ) : (
          <ul className="mt-8 max-w-3xl space-y-3" aria-label="Repository search results">
            {results.map((repo) => (
              <SearchResult key={repo.uri} repo={repo} />
            ))}
          </ul>
        )}
      </PageContainer>
    </main>
  )
}

type SearchResultProps = { repo: Repo }

function SearchResult({ repo }: SearchResultProps) {
  const ownerIdentifier = parseResourceUri(repo.uri).repo
  const { actor, miniDoc, elementRef } = useVisibleActor(
    isDid(ownerIdentifier) ? ownerIdentifier : null,
  )

  return (
    <li ref={elementRef}>
      <RepoSearchResult repo={repo} handle={miniDoc?.handle ?? null} actor={actor} />
    </li>
  )
}
