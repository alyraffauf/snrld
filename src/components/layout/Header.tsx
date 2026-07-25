import { Link } from 'react-router-dom'
import { ActorSearch } from '../actor/ActorSearch'
import { PageContainer } from './PageContainer'

export function Header() {
  return (
    <header className="border-b border-ctp-surface-0 bg-ctp-crust">
      <nav aria-label="Main navigation">
        <PageContainer className="flex items-center gap-6 py-4">
          <Link
            to="/"
            className="shrink-0 font-mono text-sm font-semibold tracking-wide text-ctp-text no-underline"
          >
            snrld
          </Link>

          <ActorSearch variant="compact" />
        </PageContainer>
      </nav>
    </header>
  )
}
