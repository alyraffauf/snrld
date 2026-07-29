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
import { ErrorPage } from '../components/shared/ErrorPage'
import { LoadingPanel } from '../components/shared/LoadingPanel'
import { RepoPageSkeleton } from '../components/shared/PageSkeletons'
import { SurfaceCard } from '../components/shared/SurfaceCard'
import { useRepoPage } from '../hooks/useRepoPage'
import { parseHandle } from '../lib/routes'
import { getRepoName, getRepoRkey } from '../lib/tangled/repo'

export function RepoPage() {
  const { handle: routeHandle, repo: routeRepo } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  const [hasVisitedCode, setHasVisitedCode] = useState(false)
  const requestedSection = searchParams.get('view')
  const shouldLoadTree =
    requestedSection !== 'issues' &&
    requestedSection !== 'pulls' &&
    requestedSection !== 'pipelines'
  const { pageData, error, rootTree, rootTreeError } = useRepoPage(
    handle,
    routeRepo,
    shouldLoadTree,
  )

  useEffect(() => {
    const defaultIsCode =
      requestedSection === null && rootTree !== null && rootTree.readme === undefined

    if (requestedSection === 'code' || defaultIsCode) {
      setHasVisitedCode(true)
    }
  }, [requestedSection, rootTree])

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

  const { actor, repo } = pageData
  const { miniDoc: identity, profile, bskyProfile } = actor
  const hasReadme = rootTree === null || rootTree.readme !== undefined
  const activeSection = parseRepoSection(requestedSection, hasReadme)
  const shouldRenderWorkspace = hasVisitedCode || activeSection === 'code'
  const isContentSection = activeSection === 'readme' || activeSection === 'code'
  const shouldShowContentLoading = isContentSection && rootTree === null && rootTreeError === null
  const shouldShowContentError = isContentSection && rootTreeError !== null

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
            hasReadme={hasReadme}
            repoKey={getRepoRkey(repo)}
          />

          {activeSection === 'readme' && rootTree !== null && (
            <RepoReadme
              readme={rootTree.readme}
              repositoryName={getRepoRkey(repo)}
              repositoryOwner={identity.handle}
              repositoryRef={rootTree.ref}
            />
          )}
          {shouldRenderWorkspace && rootTree !== null && (
            <div hidden={activeSection !== 'code'}>
              <RepoWorkspace repo={repo} initialTree={rootTree} />
            </div>
          )}
          {shouldShowContentLoading && (
            <LoadingPanel label="Loading repository contents" className="h-96" />
          )}
          {shouldShowContentError && rootTreeError !== null && (
            <p role="alert">Could not load repository contents: {rootTreeError.message}</p>
          )}
          {activeSection === 'issues' && repo.value.repoDid !== undefined && (
            <RepoIssues
              repoOwnerHandle={identity.handle}
              repoDid={repo.value.repoDid}
              repoKey={getRepoRkey(repo)}
            />
          )}
          {activeSection === 'pulls' && repo.value.repoDid !== undefined && (
            <RepoPulls
              repoOwnerHandle={identity.handle}
              repoDid={repo.value.repoDid}
              repoKey={getRepoRkey(repo)}
            />
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
