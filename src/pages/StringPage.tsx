import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { Handle } from '@atcute/lexicons'
import { isHandle } from '@atcute/lexicons/syntax'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProfilePageSkeleton } from '../components/PageSkeletons'
import { ProfileByline } from '../components/ProfileByline'
import { StringView } from '../components/StringView'
import { getProfile as getBskyProfile } from '../lib/bsky/actor'
import { getMiniDoc } from '../lib/microcosm'
import { getProfile, getString, type Profile, type StringRecord } from '../lib/tangled'

export function StringPage() {
  const { handle: routeHandle, string: routeString } = useParams()
  const handle = parseHandle(routeHandle)
  const [identity, setIdentity] = useState<MiniDoc | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bskyProfile, setBskyProfile] = useState<AppBskyActorProfile.Main | null>(null)
  const [stringRecord, setStringRecord] = useState<StringRecord | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (handle === null || routeString === undefined) return
    let cancelled = false

    async function loadPage(handle: Handle, stringKey: string) {
      try {
        setError(null)
        const miniDoc = await getMiniDoc(handle)
        const [profile, stringRecord, bskyProfile] = await Promise.all([
          getProfile(miniDoc.did),
          getString(miniDoc.did, stringKey),
          getBskyProfile(miniDoc).catch(() => null),
        ])

        if (!cancelled) {
          setIdentity(miniDoc)
          setProfile(profile)
          setBskyProfile(bskyProfile)
          setStringRecord(stringRecord)
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load string'))
        }
      }
    }

    void loadPage(handle, routeString)

    return () => {
      cancelled = true
    }
  }, [handle, routeString])

  if (handle === null || routeString === undefined) {
    return <p>Invalid string route</p>
  }

  if (error) {
    return <p role="alert">Could not load string: {error.message}</p>
  }

  if (profile === null || identity === null || stringRecord === null) {
    return <ProfilePageSkeleton />
  }

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

function parseHandle(value: string | undefined): Handle | null {
  if (value === undefined || !isHandle(value)) {
    return null
  }

  return value
}
