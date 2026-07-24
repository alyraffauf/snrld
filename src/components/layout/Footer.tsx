import { PageContainer } from './PageContainer'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ctp-surface-0 bg-ctp-crust">
      <PageContainer className="flex items-center justify-between gap-4 py-4 text-xs text-ctp-overlay-1">
        <span className="font-mono">snrld</span>
        <a
          href="https://bobbin.klbr.net"
          target="_blank"
          rel="noreferrer"
          className="hover:text-ctp-text"
        >
          powered by Bobbin
        </a>
      </PageContainer>
    </footer>
  )
}
