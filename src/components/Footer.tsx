export function Footer() {
  return (
    <footer className="mt-auto border-t border-ctp-surface-0 bg-ctp-crust">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 text-xs text-ctp-overlay-1">
        <span className="font-mono">snrld</span>
        <a
          href="https://bobbin.klbr.net"
          target="_blank"
          rel="noreferrer"
          className="hover:text-ctp-text"
        >
          powered by Bobbin
        </a>
      </div>
    </footer>
  )
}
