import { useEffect, useState, type ReactNode } from 'react'
import {
  restoreSession,
  signOut as endSession,
} from '../../lib/auth/oauth'
import type { Session } from '@atcute/oauth-browser-client'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (window.location.pathname === '/auth/callback') {
      setIsLoading(false)
      return
    }

    let active = true

    restoreSession()
      .then((restoredSession) => {
        if (active) setSession(restoredSession)
      })
      .catch(() => {
        if (active) setError('Could not restore your session.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function signOut(): Promise<void> {
    if (session === null) return

    setError(null)

    try {
      await endSession(session)
    } catch {
      setError('Signed out locally, but could not revoke the session with the provider.')
    } finally {
      setSession(null)
    }
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, error, setSession, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}