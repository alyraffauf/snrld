import { LoginForm } from '../components/auth/LoginForm'
import { PageContainer } from '../components/layout/PageContainer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AuthPage() {
  useDocumentTitle('Log in')

  return (
    <main>
      <PageContainer className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-8">
        <section className="w-full max-w-xl text-center">
          <img src="/catppuccin-logo.png" alt="" className="mx-auto mb-5 size-40" />
          <h1 className="mt-3 font-mono text-2xl font-bold text-ctp-text">snrld</h1>
          <p className="font-mono text-sm text-ctp-overlay-1">
            Log in with your Atmosphere account.
          </p>
          <LoginForm />
        </section>
      </PageContainer>
    </main>
  )
}
