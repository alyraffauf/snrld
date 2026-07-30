import { useParams, useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileByline } from '../components/profile/ProfileByline'
import { PullChanges } from '../components/repo/PullChanges'
import { RepoRecordView } from '../components/repo/RepoRecordView'
import { IssueComments } from '../components/repo/IssueComments'
import { ErrorPage } from '../components/shared/ErrorPage'
import { RepoPageSkeleton } from '../components/shared/PageSkeletons'
import { Tabs } from '../components/shared/Tabs'
import { useRepoRecordPage } from '../hooks/useRepoRecordPage'
import { loadPullPage, type PullPageData } from '../lib/pullPage'
import { parseHandle } from '../lib/routes'
import { getRepoName, getRepoRkey } from '../lib/tangled/repo'

export function PullPage() {
  const {
    repoOwner: routeRepoOwner,
    repo: repoKey,
    pullOwner: routePullOwner,
    pull: pullKey,
  } = useParams()
  const [searchParams] = useSearchParams()
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
  const activeTab = searchParams.get('view') === 'changes' ? 'changes' : 'conversation'
  const pullUrl = `/${repositoryOwner.miniDoc.handle}/${getRepoRkey(repo)}/pulls/${recordAuthor.miniDoc.handle}/${pullKey}`

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
        <section className="space-y-6">
          <PullBranches pull={pull.value} />
          <RepoRecordView author={recordAuthor} {...pull.value} />
          <Tabs
            ariaLabel="Pull request sections"
            items={[
              { label: 'Conversation', href: pullUrl, isActive: activeTab === 'conversation' },
              {
                label: 'Changes',
                href: `${pullUrl}?view=changes`,
                isActive: activeTab === 'changes',
              },
            ]}
          />
          {activeTab === 'conversation' && <IssueComments issueUri={pull.uri} />}
          {activeTab === 'changes' && (
            <PullChanges
              pull={pull.value}
              pullAuthorDid={recordAuthor.miniDoc.did}
              pullAuthorPds={recordAuthor.miniDoc.pds}
            />
          )}
        </section>
      </PageContainer>
    </main>
  )
}

function PullBranches({ pull }: { pull: PullPageData['record']['value'] }) {
  const source = pull.source?.branch ?? 'unknown source'
  return (
    <p className="font-mono text-sm text-ctp-subtext-0">
      {source} <span aria-hidden="true">→</span> {pull.target.branch}
    </p>
  )
}
