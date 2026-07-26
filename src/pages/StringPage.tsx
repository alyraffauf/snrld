import { useParams } from 'react-router-dom'
import { ProfileByline } from '../components/profile/ProfileByline'
import { ProfilePageSkeleton } from '../components/shared/PageSkeletons'
import { ErrorPage } from '../components/shared/ErrorPage'
import { StringView } from '../components/string/StringView'
import { useStringPage } from '../hooks/useStringPage'
import { parseHandle } from '../lib/routes'

export function StringPage() {
  const { handle: routeHandle, string: routeString } = useParams()
  const handle = parseHandle(routeHandle)
  const { pageData, error } = useStringPage(handle, routeString)

  if (handle === null || routeString === undefined) {
    return <ErrorPage title="String not found" message="That string address is not valid." />
  }

  if (error) {
    return (
      <ErrorPage
        title="We couldn't load this string"
        message="The string may not exist, or the service may be temporarily unavailable."
        details={error.message}
      />
    )
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
