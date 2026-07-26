import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileByline } from '../components/profile/ProfileByline'
import { RepoIssues } from '../components/repo/RepoIssues'
import { RepoPulls } from '../components/repo/RepoPulls'
import { RepoReadme } from '../components/repo/RepoReadme'
import { parseRepoSection } from '../components/repo/repoSections'
import { RepoTabs } from '../components/repo/RepoTabs'
import { RepoView } from '../components/repo/RepoView'
import { RepoWorkspace } from '../components/repo/RepoWorkspace'
import { RepoPageSkeleton } from '../components/shared/PageSkeletons'
import { ErrorPage } from '../components/shared/ErrorPage'
import { SurfaceCard } from '../components/shared/SurfaceCard'
import { useRepoPage } from '../hooks/useRepoPage'
import { parseHandle } from '../lib/routes'
import { getRepoName, getRepoRkey } from '../lib/tangled/repo'

export function RepoPage() {
  const { handle: routeHandle, repo: routeRepo } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  const [hasVisitedCode, setHasVisitedCode] = useState(false)
  const { pageData, error } = useRepoPage(handle, routeRepo)

  const requestedSection = searchParams.get('view')

  useEffect(() => {
    const defaultIsCode =
      requestedSection === null && pageData !== null && pageData.rootTree.readme === undefined

    if (requestedSection === 'code' || defaultIsCode) {
      setHasVisitedCode(true)
    }
  }, [requestedSection, pageData])

  if (handle === null || routeRepo === undefined) {
    return (
      <ErrorPage title="Repository not found" message="That repository address is not valid." />
    )
  }

  if (error) {
    return (
      <ErrorPage
        title="We couldn't load this repository"
        message="The repository may not exist, or the service may be temporarily unavailable."
        details={error.message}
      />
    )
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
      <PageContainer className="py-6 sm:py-8">
        <ProfileByline
          miniDoc={identity}
          profile={profile}
          bskyProfile={bskyProfile}
          label={getRepoName(repo)}
        />

        <section className="mt-6 min-w-0 space-y-6 sm:mt-8">
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
          {activeSection === 'issues' && repo.value.repoDid !== undefined && (
            <RepoIssues repoDid={repo.value.repoDid} />
          )}
          {activeSection === 'pulls' && repo.value.repoDid !== undefined && (
            <RepoPulls repoDid={repo.value.repoDid} />
          )}
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
