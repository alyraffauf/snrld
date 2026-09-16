import { useState, type SubmitEvent } from 'react'
import { isHandle } from '@atcute/lexicons/syntax'
import { signIn } from '../../lib/auth/oauth'
import { AccountHandleInput } from './AccountHandleInput'

export function LoginForm() {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSigningIn) return

    setError(null)

    const value = new FormData(event.currentTarget).get('handle')
    const handle = typeof value === 'string' ? value.trim().toLowerCase() : ''

    if (!isHandle(handle)) {
      setError('Enter a valid account handle.')
      return
    }

    setIsSigningIn(true)

    try {
      await signIn(handle)
    } catch {
      setError('Could not start sign-in. Check your handle and try again.')
      setIsSigningIn(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-6 flex w-full min-w-0 items-center border border-ctp-surface-1 bg-ctp-mantle text-left"
    >
      <AccountHandleInput disabled={isSigningIn} />
      {error && (
        <p role="alert" className="absolute left-0 top-full mt-2 text-sm text-ctp-red">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSigningIn}
        aria-label={isSigningIn ? 'Signing in' : 'Sign in'}
        className="shrink-0 px-4 py-3 font-mono text-ctp-overlay-1 hover:text-ctp-lavender disabled:opacity-50"
      >
        →
      </button>
    </form>
  )
}
