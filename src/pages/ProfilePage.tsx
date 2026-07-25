import { IconPin, IconThumbUp } from '@tabler/icons-react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ProfilePageSkeleton } from '../components/shared/PageSkeletons'
import { PageContainer } from '../components/layout/PageContainer'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileSection } from '../components/profile/ProfileSection'
import { ProfileTabs } from '../components/profile/ProfileTabs'
import { RepoListItem } from '../components/repo/RepoListItem'
import { StringListItem } from '../components/string/StringListItem'
import { VouchList } from '../components/vouch/VouchList'
import { useProfilePage } from '../hooks/useProfilePage'
import { parseProfileSection } from '../lib/profile'
import { parseHandle } from '../lib/routes'

const MAX_RECENT_VOUCHES = 4

export function ProfilePage() {
  const { handle: routeHandle } = useParams()
  const [searchParams] = useSearchParams()
  const handle = parseHandle(routeHandle)
  const { pageData, error } = useProfilePage(handle)

  if (handle === null) {
    return <p>Invalid handle</p>
  }

  if (error) {
    return <p role="alert">Could not load profile: {error.message}</p>
  }

  if (pageData === null) {
    return <ProfilePageSkeleton />
  }

  const { identity, profile, repos, strings, pinnedRepos, starredRepos, vouches, bskyProfile } =
    pageData
  const activeSection = parseProfileSection(searchParams.get('view'))
  const recentVouches = vouches.items.slice(0, MAX_RECENT_VOUCHES)

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
                {pinnedRepos?.length === 0 && <p>No repos found.</p>}
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
                {recentVouches.length === 0 && <p>No vouches yet.</p>}
                {recentVouches.length > 0 && <VouchList vouches={recentVouches} />}
              </ProfileSection>
            </div>
          )}

          {activeSection === 'repos' && (
            <ProfileSection title="Repositories">
              {repos.items.length === 0 && <p>No repositories found.</p>}
              {repos.items.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {repos.items.map((repo) => (
                    <RepoListItem key={repo.uri} handle={identity.handle} repo={repo} />
                  ))}
                </div>
              )}
            </ProfileSection>
          )}

          {activeSection === 'strings' && (
            <ProfileSection title="Strings">
              {strings.items.length === 0 && <p>No strings found.</p>}
              {strings.items.length > 0 && (
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
            </ProfileSection>
          )}

          {activeSection === 'stars' && (
            <ProfileSection title="Stars">
              {starredRepos.length === 0 && <p>No stars found.</p>}

              {starredRepos.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {starredRepos.map(({ repo, handle }) => (
                    <RepoListItem key={repo.uri} handle={handle} repo={repo} />
                  ))}
                </div>
              )}
            </ProfileSection>
          )}

          {activeSection === 'vouches' && (
            <ProfileSection title="Vouches">
              {vouches.items.length === 0 && <p>No vouches yet.</p>}
              {vouches.items.length > 0 && <VouchList vouches={vouches.items} />}
            </ProfileSection>
          )}
        </div>
      </PageContainer>
    </main>
  )
}
