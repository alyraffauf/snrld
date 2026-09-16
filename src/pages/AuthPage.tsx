import { LoginForm } from '../components/auth/LoginForm'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AuthPage() {
  useDocumentTitle('Log in')

  return (
    <main>
      <p className="font-mono text-sm text-ctp-overlay-1">
        Log in with your Atmosphere account.
      </p>
      <LoginForm />
    </main>
  )
}
