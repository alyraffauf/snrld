import { type Handle } from '@atcute/lexicons'
import { isHandle } from '@atcute/lexicons/syntax'
import { IconPin, IconThumbUp } from '@tabler/icons-react'
import { type ReactNode, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ProfilePageSkeleton } from '../components/shared/PageSkeletons'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileTabs } from '../components/profile/ProfileTabs'
import { RepoListItem } from '../components/repo/RepoListItem'
import { StringListItem } from '../components/string/StringListItem'
import { VouchList } from '../components/vouch/VouchList'
import { parseProfileSection } from '../lib/profile'
import { loadProfilePage, type ProfilePageData } from '../lib/profilePage'

const MAX_RECENT_VOUCHES = 4

export function ProfilePage() {
  const { handle: routeHandle } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  const [pageData, setPageData] = useState<ProfilePageData | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (handle === null) return
    let cancelled = false

    async function loadPage(handle: Handle) {
      try {
        setError(null)
        const data = await loadProfilePage(handle)

        if (!cancelled) {
          setPageData(data)
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load profile'))
        }
      }
    }

    void loadPage(handle)

    return () => {
      cancelled = true
    }
  }, [handle])

  if (handle === null) {
    return <p>Invalid handle</p>
  }

  if (error) {
    return <p role="alert">Could not load profile: {error.message}</p>
  }

  if (pageData === null) {
    return <ProfilePageSkeleton />
  }

  const { identity, profile, repos, strings, pinnedRepos, starredRepos, vouches, bskyProfile } =
    pageData
  const activeSection = parseProfileSection(searchParams.get('view'))
  const recentVouches = vouches.items.slice(0, MAX_RECENT_VOUCHES)

  return (
    <main>
      <PageContainer className="py-8">
        <ProfileHeader miniDoc={identity} profile={profile} blueskyProfile={bskyProfile} />
        <ProfileTabs handle={identity.handle} />

        <div className="mt-8">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <section aria-labelledby="pinned-repos" className="space-y-4">
                <h2
                  id="pinned-repos"
                  className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-ctp-overlay-1"
                >
                  <IconPin size={14} stroke={1.75} aria-hidden="true" />
                  Pinned
                </h2>
                {pinnedRepos?.length === 0 && <p>No repos found.</p>}
                {pinnedRepos && pinnedRepos.length > 0 && (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {pinnedRepos.map((repo) => (
                      <RepoListItem key={repo.uri} handle={identity.handle} repo={repo} />
                    ))}
                  </div>
                )}
              </section>

              <section aria-labelledby="recent-vouches" className="space-y-4">
                <h2
                  id="recent-vouches"
                  className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-ctp-overlay-1"
                >
                  <IconThumbUp size={14} stroke={1.75} aria-hidden="true" />
                  Recent Vouches
                </h2>
                {recentVouches.length === 0 && <p>No vouches yet.</p>}
                {recentVouches.length > 0 && <VouchList vouches={recentVouches} />}
              </section>
            </div>
          )}

          {activeSection === 'repos' && (
            <ProfileCollection title="Repositories">
              {repos.items.length === 0 && <p>No repositories found.</p>}
              {repos.items.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {repos.items.map((repo) => (
                    <RepoListItem key={repo.uri} handle={identity.handle} repo={repo} />
                  ))}
                </div>
              )}
            </ProfileCollection>
          )}

          {activeSection === 'strings' && (
            <ProfileCollection title="Strings">
              {strings.items.length === 0 && <p>No strings found.</p>}
              {strings.items.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {strings.items.map((string) => (
                    <StringListItem
                      key={string.uri}
                      handle={identity.handle}
                      stringRecord={string}
                    />
                  ))}
                </div>
              )}
            </ProfileCollection>
          )}

          {activeSection === 'stars' && (
            <ProfileCollection title="Stars">
              {starredRepos.length === 0 && <p>No stars found.</p>}

              {starredRepos.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {starredRepos.map(({ repo, handle }) => (
                    <RepoListItem key={repo.uri} handle={handle} repo={repo} />
                  ))}
                </div>
              )}
            </ProfileCollection>
          )}

          {activeSection === 'vouches' && (
            <ProfileCollection title="Vouches">
              {vouches.items.length === 0 && <p>No vouches yet.</p>}
              {vouches.items.length > 0 && <VouchList vouches={vouches.items} />}
            </ProfileCollection>
          )}
        </div>
      </PageContainer>
    </main>
  )
}

type ProfileCollectionProps = {
  title: string
  children: ReactNode
}

function ProfileCollection({ title, children }: ProfileCollectionProps) {
  const headingId = `${title.toLowerCase()}-heading`

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <h2 id={headingId} className="sr-only">
        {title}
      </h2>
      {children}
    </section>
  )
}

function parseHandle(value: string | undefined): Handle | null {
  if (value === undefined || !isHandle(value)) {
    return null
  }

  return value
}
