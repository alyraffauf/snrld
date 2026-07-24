type LoadingPanelProps = {
  label: string
  className?: string
}

export function LoadingPanel({ label, className = 'h-48' }: LoadingPanelProps) {
  return (
    <div
      className={`animate-pulse rounded border border-ctp-surface-1 bg-ctp-mantle ${className}`}
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}
