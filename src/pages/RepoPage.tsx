import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileByline } from '../components/profile/ProfileByline'
import { RepoReadme } from '../components/repo/RepoReadme'
import { parseRepoSection } from '../components/repo/repoSections'
import { RepoTabs } from '../components/repo/RepoTabs'
import { RepoView } from '../components/repo/RepoView'
import { RepoWorkspace } from '../components/repo/RepoWorkspace'
import { RepoPageSkeleton } from '../components/shared/PageSkeletons'
import { SurfaceCard } from '../components/shared/SurfaceCard'
import { parseHandle } from '../lib/routes'
import { loadRepoPage, type RepoPageData } from '../lib/repoPage'
import { getRepoName, getRepoRkey } from '../lib/tangled/repo'

export function RepoPage() {
  const { handle: routeHandle, repo: routeRepo } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  const [pageData, setPageData] = useState<RepoPageData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [hasVisitedCode, setHasVisitedCode] = useState(false)

  const requestedSection = searchParams.get('view')

  useEffect(() => {
    const defaultIsCode =
      requestedSection === null && pageData !== null && pageData.rootTree.readme === undefined

    if (requestedSection === 'code' || defaultIsCode) {
      setHasVisitedCode(true)
    }
  }, [requestedSection, pageData])

  useEffect(() => {
    if (handle === null || routeRepo === undefined) return
    const ownerHandle = handle
    const repoKey = routeRepo
    let cancelled = false

    async function loadPage() {
      try {
        setError(null)
        const data = await loadRepoPage(ownerHandle, repoKey)

        if (!cancelled) {
          setPageData(data)
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load repository'))
        }
      }
    }

    void loadPage()

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

  if (pageData === null) {
    return <RepoPageSkeleton />
  }

  const { actor, repo, rootTree } = pageData
  const { miniDoc: identity, profile, bskyProfile } = actor
  const activeSection = parseRepoSection(requestedSection, rootTree.readme !== undefined)
  const shouldRenderWorkspace = hasVisitedCode || activeSection === 'code'

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
          <RepoView handle={handle} repo={repo} />
          <RepoTabs
            activeSection={activeSection}
            handle={identity.handle}
            hasReadme={rootTree.readme !== undefined}
            repoKey={getRepoRkey(repo)}
          />

          {activeSection === 'readme' && <RepoReadme readme={rootTree.readme} />}
          {shouldRenderWorkspace && (
            <div hidden={activeSection !== 'code'}>
              <RepoWorkspace repo={repo} initialTree={rootTree} />
            </div>
          )}
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
