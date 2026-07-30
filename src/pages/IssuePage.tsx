import { useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileByline } from '../components/profile/ProfileByline'
import { IssueComments } from '../components/repo/IssueComments'
import { ErrorPage } from '../components/shared/ErrorPage'
import { RepoRecordView } from '../components/repo/RepoRecordView'
import { RepoPageSkeleton } from '../components/shared/PageSkeletons'
import { useRepoRecordPage } from '../hooks/useRepoRecordPage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { loadIssuePage } from '../lib/issuePage'
import { parseHandle } from '../lib/routes'
import { getRepoName, getRepoRkey } from '../lib/tangled/repo'

export function IssuePage() {
  const {
    repoOwner: routeRepoOwner,
    repo: repoKey,
    issueOwner: routeIssueOwner,
    issue: issueKey,
  } = useParams()
  const repoOwnerHandle = parseHandle(routeRepoOwner)
  const issueOwnerHandle = parseHandle(routeIssueOwner)
  const { pageData, error } = useRepoRecordPage({
    loadPage: loadIssuePage,
    recordKey: issueKey,
    recordOwnerHandle: issueOwnerHandle,
    repoKey,
    repoOwnerHandle,
  })
  useDocumentTitle(
    pageData ? `${pageData.record.value.title} · ${getRepoName(pageData.repo)}` : undefined,
  )

  if (
    repoOwnerHandle === null ||
    issueOwnerHandle === null ||
    repoKey === undefined ||
    issueKey === undefined
  ) {
    return <ErrorPage title="Issue not found" message="That issue address is not valid." />
  }

  if (error) {
    return (
      <ErrorPage
        title="We couldn't load this issue"
        message="The issue may not exist, belong to this repository, or the service may be temporarily unavailable."
        details={error.message}
      />
    )
  }

  if (pageData === null) {
    return <RepoPageSkeleton />
  }

  const { record: issue, recordAuthor, repo, repositoryOwner } = pageData
  const repositoryUrl = `/${repositoryOwner.miniDoc.handle}/${getRepoRkey(repo)}`
  const repoUrl = `${repositoryUrl}?view=issues`

  return (
    <main>
      <PageContainer className="py-6 sm:py-8">
        <ProfileByline
          miniDoc={repositoryOwner.miniDoc}
          profile={repositoryOwner.profile}
          bskyProfile={repositoryOwner.bskyProfile}
          breadcrumbs={[
            { label: getRepoName(repo), to: repositoryUrl },
            { label: 'issues', to: repoUrl },
            { label: issue.value.title },
          ]}
        />
        <section className="space-y-6">
          <RepoRecordView author={recordAuthor} {...issue.value} />
          <IssueComments issueUri={issue.uri} />
        </section>
      </PageContainer>
    </main>
  )
}
