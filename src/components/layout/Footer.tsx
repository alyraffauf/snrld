import { Link } from 'react-router-dom'
import { PageContainer } from './PageContainer'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ctp-surface-0 bg-ctp-crust">
      <PageContainer className="flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-ctp-text">
            <span>
              © 2026{' '}
              <a href="https://aly.codes" target="_blank" rel="noreferrer">
                aly.codes
              </a>
            </span>
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/aly.codes/snrld">Code</Link>
          <a href="https://bobbin.klbr.net" target="_blank" rel="noreferrer">
            Bobbin
          </a>
        </nav>
      </PageContainer>
    </footer>
  )
}
