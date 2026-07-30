import { Link } from 'react-router-dom'
import { RepoSearch } from '../repo/RepoSearch'
import { PageContainer } from './PageContainer'

export function Header() {
  return (
    <header className="border-b border-ctp-surface-0 bg-ctp-crust">
      <nav aria-label="Main navigation">
        <PageContainer className="flex items-center gap-6 py-4">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 font-mono text-sm font-semibold tracking-wide text-ctp-text no-underline"
          >
            <img src="/catppuccin-logo.png" alt="" className="size-6" />
            snrld
          </Link>

          <RepoSearch size="header" />
        </PageContainer>
      </nav>
    </header>
  )
}
