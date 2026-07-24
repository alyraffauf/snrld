import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isHandle } from '@atcute/lexicons/syntax'

export function Header() {
  const [handleInput, setHandleInput] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="border-b border-ctp-surface-0 bg-ctp-crust">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-4"
      >
        <Link
          to="/"
          className="shrink-0 font-mono text-sm font-semibold tracking-wide text-ctp-text no-underline"
        >
          snrld
        </Link>

        <form
          className="ml-auto flex w-full max-w-sm min-w-0 items-center border-b border-ctp-surface-1"
          onSubmit={(event) => {
            event.preventDefault()

            const handle = handleInput.trim()
            if (!isHandle(handle)) {
              setIsInvalid(true)
              return
            }

            setIsInvalid(false)
            navigate(`/${handle}`)
          }}
        >
          <input
            type="text"
            placeholder="handle"
            aria-label="Profile handle"
            aria-invalid={isInvalid}
            value={handleInput}
            onChange={(event) => {
              setHandleInput(event.target.value)
              setIsInvalid(false)
            }}
            className="min-w-0 flex-1 bg-transparent py-1 font-mono text-sm text-ctp-text outline-none placeholder:text-ctp-overlay-0"
          />
          <button
            type="submit"
            aria-label="View profile"
            className="px-2 py-1 font-mono text-ctp-overlay-1 hover:text-ctp-lavender"
          >
            →
          </button>
        </form>
      </nav>
    </header>
  )
}
