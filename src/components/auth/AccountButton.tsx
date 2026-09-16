import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconLogin, IconLogout, IconUserCircle } from '@tabler/icons-react'
import { useAuth } from '../../hooks/useAuth'
import { useVisibleActor } from '../../hooks/useVisibleActor'
import { ProfileAvatar } from '../profile/ProfileAvatar'

type AccountButtonProps = {
  ariaLabel: string
  to: string
}

export function AccountButton({ ariaLabel, to }: AccountButtonProps) {
  const { session, isLoading, error, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { actor, miniDoc, elementRef } = useVisibleActor(session?.info.sub ?? null)

  const handle = miniDoc && miniDoc.handle !== 'handle.invalid' ? miniDoc.handle : null

  const actionClassName =
    'flex h-full w-9 items-center justify-center transition-colors hover:bg-ctp-surface-0'

  const isSignedIn = session !== null
  const isUnavailable = isLoading || (isSignedIn && handle === null)

  async function handleSignOut() {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  const accountAvatar = actor ? (
    <ProfileAvatar
      miniDoc={actor.miniDoc}
      profile={actor.profile}
      bskyProfile={actor.bskyProfile}
      avatarUrl={actor.avatarUrl}
      loading="eager"
      size="compact"
    />
  ) : (
    <IconUserCircle size={18} stroke={1.75} aria-hidden="true" />
  )

  return (
    <div
      ref={elementRef}
      className="inline-flex h-9 shrink-0 overflow-hidden border border-ctp-surface-1"
    >
      {isUnavailable ? (
        <button
          type="button"
          disabled
          aria-label={isLoading ? 'Checking account' : 'Account profile unavailable'}
          className={`${actionClassName} opacity-50`}
        >
          <IconUserCircle size={18} stroke={1.75} aria-hidden="true" />
        </button>
      ) : isSignedIn ? (
        <Link
          to={`/${handle}`}
          aria-label="View your profile"
          className="flex h-full items-center gap-3 px-3 text-ctp-text transition-colors hover:bg-ctp-surface-0 hover:text-ctp-text"
        >
          <span className="max-w-40 truncate font-mono text-sm">{handle}</span>
          {accountAvatar}
        </Link>
      ) : (
        <Link
          to={to}
          aria-label={error ? 'Try signing in again' : ariaLabel}
          className={actionClassName}
        >
          <IconLogin size={18} stroke={1.75} aria-hidden="true" />
        </Link>
      )}
      {isSignedIn && (
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          aria-label={isSigningOut ? 'Signing out' : 'Sign out'}
          className={`${actionClassName} border-l border-ctp-surface-1 disabled:opacity-50`}
        >
          <IconLogout size={18} stroke={1.75} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
