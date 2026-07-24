import type { Did, Handle } from '@atcute/lexicons'
import { isHandle } from '@atcute/lexicons/syntax'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileOverview } from '../components/ProfileOverview'
import { RepoListItem } from '../components/RepoListItem'
import { getMiniDoc } from '../lib/microcosm'
import { getProfile, type Profile } from '../lib/tangled'
import { getRepoByRepoDid, listRepos, type Repo, type RepoList } from '../lib/tangled/repo'

export function ProfilePage() {
  const { handle: routeHandle } = useParams()
  const handle = parseHandle(routeHandle)
  const [identity, setIdentity] = useState<MiniDoc | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [repos, setRepos] = useState<RepoList | null>(null)
  const [pinnedRepos, setPinnedRepos] = useState<Repo[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (handle === null) return
    let cancelled = false

    async function loadPage(handle: Handle) {
      try {
        setError(null)
        const miniDoc = await getMiniDoc(handle)

        const [profile, repos] = await Promise.all([
          getProfile(miniDoc.did),
          listRepos(miniDoc.did),
        ])

        const pinnedResults = await Promise.allSettled(
          (profile.value.pinnedRepositories ?? []).map((repoDid) =>
            getRepoByRepoDid(repoDid as Did),
          ),
        )
        const failedPinnedRepos = pinnedResults.filter((result) => result.status === 'rejected')
        if (failedPinnedRepos.length > 0) {
          throw new Error(`Unable to resolve ${failedPinnedRepos.length} pinned repos`)
        }

        const pinnedRepos = pinnedResults.flatMap((result) =>
          result.status === 'fulfilled' ? [result.value] : [],
        )

        if (!cancelled) {
          setIdentity(miniDoc)
          setProfile(profile)
          setRepos(repos)
          setPinnedRepos(pinnedRepos)
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

  if (identity === null) {
    return <p>Loading identity…</p>
  }

  if (profile === null || repos === null) {
    return <p>Loading profile…</p>
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <ProfileOverview
        profile={<ProfileHeader miniDoc={identity} profile={profile} />}
        pinnedRepos={
          <>
            <h2 className="text-xl font-bold">Pinned Repos</h2>
            {pinnedRepos?.length === 0 && <p>No repos found.</p>}
            {pinnedRepos && pinnedRepos.length > 0 && (
              <div className="grid gap-4">
                {pinnedRepos.map((repo) => (
                  <RepoListItem key={repo.uri} handle={identity.handle} repo={repo} />
                ))}
              </div>
            )}
          </>
        }
      />

      <section className="mt-12 gap-4">
        <h2 className="text-xl font-bold">Repos</h2>
        {repos.items.length === 0 && <p>No repos found.</p>}
        {repos.items.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {repos.items.map((repo) => (
              <RepoListItem key={repo.uri} handle={identity.handle} repo={repo} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function parseHandle(value: string | undefined): Handle | null {
  if (value === undefined || !isHandle(value)) {
    return null
  }

  return value
}
