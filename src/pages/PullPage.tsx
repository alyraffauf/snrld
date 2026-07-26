import { useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileByline } from '../components/profile/ProfileByline'
import { RepoRecordView } from '../components/repo/RepoRecordView'
import { ErrorPage } from '../components/shared/ErrorPage'
import { RepoPageSkeleton } from '../components/shared/PageSkeletons'
import { useRepoRecordPage } from '../hooks/useRepoRecordPage'
import { loadPullPage } from '../lib/pullPage'
import { parseHandle } from '../lib/routes'
import { getRepoName, getRepoRkey } from '../lib/tangled/repo'

export function PullPage() {
  const {
    repoOwner: routeRepoOwner,
    repo: repoKey,
    pullOwner: routePullOwner,
    pull: pullKey,
  } = useParams()
  const repoOwnerHandle = parseHandle(routeRepoOwner)
  const pullOwnerHandle = parseHandle(routePullOwner)
  const { pageData, error } = useRepoRecordPage({
    loadPage: loadPullPage,
    recordKey: pullKey,
    recordOwnerHandle: pullOwnerHandle,
    repoKey,
    repoOwnerHandle,
  })

  if (
    repoOwnerHandle === null ||
    pullOwnerHandle === null ||
    repoKey === undefined ||
    pullKey === undefined
  ) {
    return (
      <ErrorPage title="Pull request not found" message="That pull request address is not valid." />
    )
  }

  if (error) {
    return (
      <ErrorPage
        title="We couldn't load this pull request"
        message="The pull request may not exist, belong to this repository, or the service may be temporarily unavailable."
        details={error.message}
      />
    )
  }

  if (pageData === null) {
    return <RepoPageSkeleton />
  }

  const { record: pull, recordAuthor, repo, repositoryOwner } = pageData
  const repositoryUrl = `/${repositoryOwner.miniDoc.handle}/${getRepoRkey(repo)}`

  return (
    <main>
      <PageContainer className="py-6 sm:py-8">
        <ProfileByline
          miniDoc={repositoryOwner.miniDoc}
          profile={repositoryOwner.profile}
          bskyProfile={repositoryOwner.bskyProfile}
          breadcrumbs={[
            { label: getRepoName(repo), to: repositoryUrl },
            { label: 'pulls', to: `${repositoryUrl}?view=pulls` },
            { label: pull.value.title },
          ]}
        />
        <section>
          <RepoRecordView author={recordAuthor} {...pull.value} />
        </section>
      </PageContainer>
    </main>
  )
}
