import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { finishSignIn } from '../lib/auth/oauth'
import { PageContainer } from '../components/layout/PageContainer'
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
            <PageContainer className="py-8">
                {error ? (
                    <div>
                        <p role="alert" className="text-ctp-red">
                            {error}
                        </p>
                        <Link
                            to="/auth/login"
                            className="mt-4 inline-block text-ctp-lavender underline"
                        >
                            Try signing in again
                        </Link>
                    </div>
                ) : (
                    <p role="status">Finishing sign-in…</p>
                )}
            </PageContainer>
        </main>
    )
}