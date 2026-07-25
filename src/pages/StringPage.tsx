import { useParams } from 'react-router-dom'
import { ProfileByline } from '../components/profile/ProfileByline'
import { ProfilePageSkeleton } from '../components/shared/PageSkeletons'
import { StringView } from '../components/string/StringView'
import { useStringPage } from '../hooks/useStringPage'
import { parseHandle } from '../lib/routes'

export function StringPage() {
  const { handle: routeHandle, string: routeString } = useParams()
  const handle = parseHandle(routeHandle)
  const { pageData, error } = useStringPage(handle, routeString)

  if (handle === null || routeString === undefined) {
    return <p>Invalid string route</p>
  }

  if (error) {
    return <p role="alert">Could not load string: {error.message}</p>
  }

  if (pageData === null) {
    return <ProfilePageSkeleton />
  }

  const { identity, profile, bskyProfile, stringRecord } = pageData

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <ProfileByline
        miniDoc={identity}
        profile={profile}
        bskyProfile={bskyProfile}
        label={stringRecord.value.filename}
      />
      <section className="mt-8">
        <StringView string={stringRecord} />
      </section>
    </main>
  )
}
