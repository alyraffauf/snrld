import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { finishSignIn } from '../lib/auth/oauth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAuth } from '../hooks/useAuth'

export function AuthCallbackPage() {
    useDocumentTitle('Signing in')
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const { setSession } = useAuth()

    useEffect(() => {
        let active = true

        finishSignIn().then(
            (session) => {
                if (active) {
                    setSession(session)
                    navigate('/', { replace: true })
                }
            },
            () => {
                if (active) {
                    setError('Could not finish sign-in. Please try again.')
                }
            }
        )

        return () => {
            active = false
        }
    }, [navigate])

    return (
        <main>
            {error ? (
                <div>
                    <p role="alert" className="font-mono text-sm text-ctp-overlay-1 text-ctp-red">
                        {error}
                    </p>
                </div>
            ) : (
                <p className="font-mono text-sm text-ctp-overlay-1" role="status">Finishing sign-in…</p>
            )}
        </main>
    )
}
