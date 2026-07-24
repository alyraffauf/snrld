import type { Handle, ResourceUri } from '@atcute/lexicons'
import { isHandle } from '@atcute/lexicons/syntax'
import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProfileByline } from '../components/ProfileByline'
import { RepoPageSkeleton } from '../components/PageSkeletons'
import { RepoReadme } from '../components/RepoReadme'
import { RepoWorkspace } from '../components/RepoWorkspace'
import { RepoView } from '../components/RepoView'
import { getMiniDoc } from '../lib/microcosm'
import { getProfile, type Profile } from '../lib/tangled'
import { getRepo, type Repo } from '../lib/tangled/repo'

export function RepoPage() {
  const { handle: routeHandle, repo: routeRepo } = useParams()
  const handle = parseHandle(routeHandle)
  const [identity, setIdentity] = useState<MiniDoc | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [repo, setRepo] = useState<Repo | null>(null)
  const [rootTree, setRootTree] = useState<RepoTreeResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (handle === null || routeRepo === undefined) return
    let cancelled = false

    async function loadPage(handle: Handle) {
      try {
        setError(null)
        const miniDoc = await getMiniDoc(handle)
        const repoUri = `at://${miniDoc.did}/sh.tangled.repo/${routeRepo}` as ResourceUri

        const [profile, repo] = await Promise.all([getProfile(miniDoc.did), getRepo(repoUri)])

        if (!cancelled) {
          setIdentity(miniDoc)
          setProfile(profile)
          setRepo(repo)
          setRootTree(null)
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load repository'))
        }
      }
    }

    void loadPage(handle)

    return () => {
      cancelled = true
    }
  }, [handle, routeRepo])

  if (handle === null || routeRepo === undefined) {
    return <p>Invalid repository route</p>
  }

  if (error) {
    return <p role="alert">Could not load repository: {error.message}</p>
  }

  if (profile === null || identity === null || repo === null) {
    return <RepoPageSkeleton />
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <ProfileByline miniDoc={identity} profile={profile} repo={repo} />

      <section className="mt-8 space-y-6">
        <RepoView repo={repo} />
        <RepoReadme readme={rootTree?.readme} />

        <RepoWorkspace repo={repo} onRootTree={setRootTree} />
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
