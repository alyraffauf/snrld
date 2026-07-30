import { useParams, useSearchParams } from 'react-router-dom'
import { IconArrowRight, IconGitBranch } from '@tabler/icons-react'
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
          <RepoRecordView
            author={recordAuthor}
            {...pull.value}
            details={<PullBranches pull={pull.value} />}
          />
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
    <div
      className="flex flex-wrap items-center gap-3 rounded bg-ctp-surface-0 px-3 py-2"
      aria-label="Branches"
    >
      <Branch branch={source} label="Source" />
      <IconArrowRight size={18} stroke={1.75} className="text-ctp-overlay-1" aria-hidden="true" />
      <Branch branch={pull.target.branch} label="Target" />
    </div>
  )
}

function Branch({ branch, label }: { branch: string; label: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-ctp-overlay-1">{label}</p>
      <p className="mt-1 flex items-center gap-2 font-mono text-sm text-ctp-text">
        <IconGitBranch
          size={16}
          stroke={1.75}
          className="shrink-0 text-ctp-lavender"
          aria-hidden="true"
        />
        <span className="truncate">{branch}</span>
      </p>
    </div>
  )
}
