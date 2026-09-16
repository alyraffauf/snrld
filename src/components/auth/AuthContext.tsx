import { createContext } from 'react'
import type { Session } from '@atcute/oauth-browser-client'

type AuthContextValue = {
    session: Session | null
    isLoading: boolean
    error: string | null
    setSession: (session: Session | null) => void
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)