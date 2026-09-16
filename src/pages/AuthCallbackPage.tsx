import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
            <PageContainer className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-8">
                <section className="w-full max-w-xl text-center">
                    <img src="/catppuccin-logo.png" alt="" className="mx-auto mb-5 size-40" />
                    <h1 className="mt-3 font-mono text-2xl font-bold text-ctp-text">snrld</h1>
                    {error ? (
                        <div>
                            <p role="alert" className="font-mono text-sm text-ctp-overlay-1 text-ctp-red">
                                {error}
                            </p>
                        </div>
                    ) : (
                        <p className="font-mono text-sm text-ctp-overlay-1" role="status">Finishing sign-in…</p>
                    )}
                </section>
            </PageContainer>
        </main>
    )
}
