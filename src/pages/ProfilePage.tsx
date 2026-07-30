import { IconPin, IconThumbUp } from '@tabler/icons-react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  ProfilePageSkeleton,
  ProfileRepositorySkeletons,
  ProfileStringSkeletons,
  ProfileVouchSkeletons,
} from '../components/shared/PageSkeletons'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileSection } from '../components/profile/ProfileSection'
import { ProfileTabs } from '../components/profile/ProfileTabs'
import { RepoListItem } from '../components/repo/RepoListItem'
import { ErrorPage } from '../components/shared/ErrorPage'
import { LoadMoreButton } from '../components/shared/LoadMoreButton'
import { StringListItem } from '../components/string/StringListItem'
import { VouchList } from '../components/vouch/VouchList'
import { useProfilePage } from '../hooks/useProfilePage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  usePinnedRepos,
  useProfileRepos,
  useProfileStrings,
  useProfileVouches,
  useStarredRepos,
} from '../hooks/useProfileSections'
import { parseProfileSection } from '../lib/profile'
import { parseHandle } from '../lib/routes'

const MAX_RECENT_VOUCHES = 4

export function ProfilePage() {
  const { handle: routeHandle } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  useDocumentTitle(handle ?? undefined)
  const { pageData, error } = useProfilePage(handle)

  if (handle === null) {
    return <ErrorPage title="Profile not found" message="That profile address is not valid." />
  }

  if (error) {
    return (
      <ErrorPage
        title="We couldn't load this profile"
        message="The profile may not exist, or the service may be temporarily unavailable."
        details={error.message}
      />
    )
  }

  if (pageData === null) {
    return <ProfilePageSkeleton />
  }

  return (
    <ProfileContent
      pageData={pageData}
      activeSection={parseProfileSection(searchParams.get('view'))}
    />
  )
}

type ProfileContentProps = {
  activeSection: ReturnType<typeof parseProfileSection>
  pageData: NonNullable<ReturnType<typeof useProfilePage>['pageData']>
}

function ProfileContent({ activeSection, pageData }: ProfileContentProps) {
  const { identity, profile, bskyProfile } = pageData
  const isOverview = activeSection === 'overview'
  const pinnedRepoDids = (profile.value.pinnedRepositories ?? []).map(
    (did) => did as `did:${string}:${string}`,
  )
  const { data: pinnedRepos, error: pinnedReposError } = usePinnedRepos(
    pinnedRepoDids,
    isOverview && pinnedRepoDids.length > 0,
  )
  const {
    data: repos,
    error: reposError,
    hasMore: hasMoreRepos,
    isLoadingMore: isLoadingMoreRepos,
    loadMore: loadMoreRepos,
  } = useProfileRepos(identity.did, activeSection === 'repos')
  const {
    data: strings,
    error: stringsError,
    hasMore: hasMoreStrings,
    isLoadingMore: isLoadingMoreStrings,
    loadMore: loadMoreStrings,
  } = useProfileStrings(identity.did, activeSection === 'strings')
  const {
    data: starredRepos,
    error: starredReposError,
    hasMore: hasMoreStars,
    isLoadingMore: isLoadingMoreStars,
    loadMore: loadMoreStars,
  } = useStarredRepos(identity.did, activeSection === 'stars')
  const {
    data: vouches,
    error: vouchesError,
    hasMore: hasMoreVouches,
    isLoadingMore: isLoadingMoreVouches,
    loadMore: loadMoreVouches,
  } = useProfileVouches(identity.did, isOverview || activeSection === 'vouches')
  const recentVouches = vouches?.items.slice(0, MAX_RECENT_VOUCHES) ?? []

  return (
    <main>
      <PageContainer className="py-8">
        <ProfileHeader miniDoc={identity} profile={profile} blueskyProfile={bskyProfile} />
        <ProfileTabs handle={identity.handle} />

        <div className="mt-8">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <ProfileSection
                title="Pinned"
                icon={<IconPin size={14} stroke={1.75} aria-hidden="true" />}
              >
                {pinnedReposError && <SectionError error={pinnedReposError} />}
                {pinnedRepos === null && pinnedReposError === null && pinnedRepoDids.length > 0 && (
                  <ProfileRepositorySkeletons count={2} />
                )}
                {(pinnedRepos?.length === 0 || pinnedRepoDids.length === 0) && (
                  <p>No repos found.</p>
                )}
                {pinnedRepos && pinnedRepos.length > 0 && (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {pinnedRepos.map((repo) => (
                      <RepoListItem key={repo.uri} handle={identity.handle} repo={repo} />
                    ))}
                  </div>
                )}
              </ProfileSection>

              <ProfileSection
                title="Recent Vouches"
                icon={<IconThumbUp size={14} stroke={1.75} aria-hidden="true" />}
              >
                {vouchesError && <SectionError error={vouchesError} />}
                {vouches === null && vouchesError === null && <ProfileVouchSkeletons count={2} />}
                {vouches !== null && recentVouches.length === 0 && <p>No vouches yet.</p>}
                {recentVouches.length > 0 && <VouchList vouches={recentVouches} />}
              </ProfileSection>
            </div>
          )}

          {activeSection === 'repos' && (
            <ProfileSection title="Repositories">
              {reposError && <SectionError error={reposError} />}
              {repos === null && reposError === null && <ProfileRepositorySkeletons />}
              {repos?.items.length === 0 && <p>No repositories found.</p>}
              {repos && repos.items.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {repos.items.map((repo) => (
                    <RepoListItem key={repo.uri} handle={identity.handle} repo={repo} />
                  ))}
                </div>
              )}
              {hasMoreRepos && (
                <LoadMoreButton
                  label="Repositories"
                  isLoading={isLoadingMoreRepos}
                  onClick={() => void loadMoreRepos()}
                />
              )}
            </ProfileSection>
          )}

          {activeSection === 'strings' && (
            <ProfileSection title="Strings">
              {stringsError && <SectionError error={stringsError} />}
              {strings === null && stringsError === null && <ProfileStringSkeletons />}
              {strings?.items.length === 0 && <p>No strings found.</p>}
              {strings && strings.items.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {strings.items.map((string) => (
                    <StringListItem
                      key={string.uri}
                      handle={identity.handle}
                      stringRecord={string}
                    />
                  ))}
                </div>
              )}
              {hasMoreStrings && (
                <LoadMoreButton
                  label="Strings"
                  isLoading={isLoadingMoreStrings}
                  onClick={() => void loadMoreStrings()}
                />
              )}
            </ProfileSection>
          )}

          {activeSection === 'stars' && (
            <ProfileSection title="Stars">
              {starredReposError && <SectionError error={starredReposError} />}
              {starredRepos === null && starredReposError === null && (
                <ProfileRepositorySkeletons />
              )}
              {starredRepos?.items.length === 0 && <p>No stars found.</p>}

              {starredRepos && starredRepos.items.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {starredRepos.items.map(({ repo, handle }) => (
                    <RepoListItem key={repo.uri} handle={handle} repo={repo} />
                  ))}
                </div>
              )}
              {hasMoreStars && (
                <LoadMoreButton
                  label="Stars"
                  isLoading={isLoadingMoreStars}
                  onClick={() => void loadMoreStars()}
                />
              )}
            </ProfileSection>
          )}

          {activeSection === 'vouches' && (
            <ProfileSection title="Vouches">
              {vouchesError && <SectionError error={vouchesError} />}
              {vouches === null && vouchesError === null && <ProfileVouchSkeletons />}
              {vouches?.items.length === 0 && <p>No vouches yet.</p>}
              {vouches && vouches.items.length > 0 && <VouchList vouches={vouches.items} />}
              {hasMoreVouches && (
                <LoadMoreButton
                  label="Vouches"
                  isLoading={isLoadingMoreVouches}
                  onClick={() => void loadMoreVouches()}
                />
              )}
            </ProfileSection>
          )}
        </div>
      </PageContainer>
    </main>
  )
}

function SectionError({ error }: { error: Error }) {
  return <p role="alert">Could not load this section: {error.message}</p>
}
