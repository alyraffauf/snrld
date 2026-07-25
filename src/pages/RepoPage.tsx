import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { Handle, ResourceUri } from '@atcute/lexicons'
import { isHandle } from '@atcute/lexicons/syntax'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { RepoPageSkeleton } from '../components/shared/PageSkeletons'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileByline } from '../components/profile/ProfileByline'
import { RepoReadme } from '../components/repo/RepoReadme'
import { RepoTabs } from '../components/repo/RepoTabs'
import { parseRepoSection } from '../components/repo/repoSections'
import { RepoView } from '../components/repo/RepoView'
import { RepoWorkspace } from '../components/repo/RepoWorkspace'
import { SurfaceCard } from '../components/shared/SurfaceCard'
import { getProfile as getBskyProfile } from '../lib/bsky/actor'
import { getMiniDoc } from '../lib/microcosm'
import { getProfile, type Profile } from '../lib/tangled'
import { getRepo, getRepoName, getRepoRkey, getRepoTree, type Repo } from '../lib/tangled/repo'

export function RepoPage() {
  const { handle: routeHandle, repo: routeRepo } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  const [identity, setIdentity] = useState<MiniDoc | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bskyProfile, setBskyProfile] = useState<AppBskyActorProfile.Main | null>(null)
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

        const [profile, bskyProfile, repo] = await Promise.all([
          getProfile(miniDoc.did),
          getBskyProfile(miniDoc).catch(() => null),
          getRepo(repoUri),
        ])
        const rootTree = await getRepoTree(repo)

        if (!cancelled) {
          setIdentity(miniDoc)
          setProfile(profile)
          setBskyProfile(bskyProfile)
          setRepo(repo)
          setRootTree(rootTree)
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

  if (profile === null || identity === null || repo === null || rootTree === null) {
    return <RepoPageSkeleton />
  }

  const activeSection = parseRepoSection(searchParams.get('view'), rootTree.readme !== undefined)

  return (
    <main>
      <PageContainer className="py-8">
        <ProfileByline
          miniDoc={identity}
          profile={profile}
          bskyProfile={bskyProfile}
          label={getRepoName(repo)}
        />

        <section className="mt-8 space-y-6">
          <RepoView repo={repo} />
          <RepoTabs
            activeSection={activeSection}
            handle={identity.handle}
            hasReadme={rootTree.readme !== undefined}
            repoKey={getRepoRkey(repo)}
          />

          {activeSection === 'readme' && <RepoReadme readme={rootTree.readme} />}
          {activeSection === 'code' && <RepoWorkspace repo={repo} initialTree={rootTree} />}
          {activeSection === 'issues' && <RepoPlaceholder title="Issues" />}
          {activeSection === 'pulls' && <RepoPlaceholder title="Pulls" />}
          {activeSection === 'pipelines' && <RepoPlaceholder title="Pipelines" />}
        </section>
      </PageContainer>
    </main>
  )
}

type RepoPlaceholderProps = {
  title: string
}

function RepoPlaceholder({ title }: RepoPlaceholderProps) {
  return (
    <SurfaceCard as="section" className="p-8 text-center">
      <h2 className="font-mono text-lg font-semibold text-ctp-text">{title}</h2>
      <p className="mt-2 text-sm text-ctp-subtext-0">{title} will be available here soon.</p>
    </SurfaceCard>
  )
}

function parseHandle(value: string | undefined): Handle | null {
  if (value === undefined || !isHandle(value)) {
    return null
  }

  return value
}
