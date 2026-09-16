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
    <form onSubmit={handleSubmit} className="mt-6 text-left">
      <AccountHandleInput disabled={isSigningIn} />
      {error && (
        <p role="alert" className="mt-3 text-sm text-ctp-red">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSigningIn}
        className="mt-4 w-full rounded bg-ctp-lavender px-3 py-2 font-medium text-ctp-base"
      >
        {isSigningIn ? 'Connecting…' : 'Continue'}
      </button>
    </form>
  )
}
