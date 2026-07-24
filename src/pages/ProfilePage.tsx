import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { Did, Handle } from '@atcute/lexicons'
import { isHandle } from '@atcute/lexicons/syntax'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { IconPin } from '@tabler/icons-react'
import { type ReactNode, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ProfilePageSkeleton } from '../components/shared/PageSkeletons'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileOverview } from '../components/profile/ProfileOverview'
import { ProfileTabs } from '../components/profile/ProfileTabs'
import { RepoListItem } from '../components/repo/RepoListItem'
import { StringListItem } from '../components/string/StringListItem'
import { getProfile as getBskyProfile } from '../lib/bsky/actor'
import { getMiniDoc } from '../lib/microcosm'
import { getProfile, listStrings, type Profile, type StringList } from '../lib/tangled'
import { getRepoByRepoDid, listRepos, type Repo, type RepoList } from '../lib/tangled/repo'

export function ProfilePage() {
  const { handle: routeHandle } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  const [identity, setIdentity] = useState<MiniDoc | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [repos, setRepos] = useState<RepoList | null>(null)
  const [strings, setStrings] = useState<StringList | null>(null)
  const [pinnedRepos, setPinnedRepos] = useState<Repo[] | null>(null)
  const [bskyProfile, setBskyProfile] = useState<AppBskyActorProfile.Main | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (handle === null) return
    let cancelled = false

    async function loadPage(handle: Handle) {
      try {
        setError(null)
        const miniDoc = await getMiniDoc(handle)

        const [profile, repos, strings, bskyProfile] = await Promise.all([
          getProfile(miniDoc.did),
          listRepos(miniDoc.did),
          listStrings(miniDoc.did),
          getBskyProfile(miniDoc).catch(() => null),
        ])

        const pinnedResults = await Promise.allSettled(
          (profile.value.pinnedRepositories ?? []).map((repoDid) =>
            getRepoByRepoDid(repoDid as Did),
          ),
        )
        const pinnedRepos = pinnedResults.flatMap((result) =>
          result.status === 'fulfilled' ? [result.value] : [],
        )

        if (!cancelled) {
          setIdentity(miniDoc)
          setProfile(profile)
          setRepos(repos)
          setPinnedRepos(pinnedRepos)
          setStrings(strings)
          setBskyProfile(bskyProfile)
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

  if (identity === null || profile === null || repos === null || strings === null) {
    return <ProfilePageSkeleton />
  }

  const activeSection = parseProfileSection(searchParams.get('view'))

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <ProfileHeader miniDoc={identity} profile={profile} blueskyProfile={bskyProfile} />
      <ProfileTabs handle={identity.handle} />

      <div className="mt-8">
        {activeSection === 'overview' && (
          <ProfileOverview>
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
          </ProfileOverview>
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
                  <StringListItem key={string.uri} handle={identity.handle} stringRecord={string} />
                ))}
              </div>
            )}
          </ProfileCollection>
        )}
      </div>
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

function parseProfileSection(value: string | null): 'overview' | 'repos' | 'strings' {
  if (value === 'repos' || value === 'strings') {
    return value
  }

  return 'overview'
}

function parseHandle(value: string | undefined): Handle | null {
  if (value === undefined || !isHandle(value)) {
    return null
  }

  return value
}
