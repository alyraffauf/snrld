type LoadMoreButtonProps = {
  isLoading: boolean
  label: string
  onClick: () => void
}

export function LoadMoreButton({ isLoading, label, onClick }: LoadMoreButtonProps) {
  return (
    <button
      type="button"
      className="rounded border border-ctp-surface-1 px-3 py-2 font-mono text-sm text-ctp-blue hover:border-ctp-overlay-1 hover:text-ctp-sapphire disabled:cursor-wait disabled:opacity-70"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? `Loading ${label.toLowerCase()}...` : `Load more ${label.toLowerCase()}`}
    </button>
  )
}
