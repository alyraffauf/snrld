import { LoadingPanel } from './LoadingPanel'
import { PageContainer } from '../layout/PageContainer'
import { SurfaceCard } from './SurfaceCard'

export function ProfilePageSkeleton() {
  return (
    <PageContainer className="py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <LoadingPanel label="Loading profile" className="h-64" />
        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
          <LoadingPanel label="Loading pinned repository" className="h-48" />
          <LoadingPanel label="Loading pinned repository" className="h-48" />
        </div>
      </div>
      <LoadingPanel label="Loading repositories" className="mt-12 h-96" />
    </PageContainer>
  )
}

export function RepoPageSkeleton() {
  return (
    <PageContainer className="py-8">
      <LoadingPanel label="Loading repository owner" className="h-16" />
      <LoadingPanel label="Loading repository" className="mt-8 h-56" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <LoadingPanel label="Loading files" className="h-96" />
        <LoadingPanel label="Loading commits" className="h-96" />
      </div>
    </PageContainer>
  )
}

export function ProfileRepositorySkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2" aria-busy="true">
      <p className="sr-only" role="status">
        Loading repositories...
      </p>
      {Array.from({ length: count }, (_, index) => (
        <SurfaceCard key={index} as="div" className="animate-pulse p-4" aria-hidden="true">
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-2/5 rounded bg-ctp-surface-1" />
            <div className="h-4 w-10 rounded bg-ctp-surface-1" />
          </div>
          <div className="mt-3 h-3 w-1/4 rounded bg-ctp-surface-1" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-ctp-surface-1" />
            <div className="h-3 w-3/4 rounded bg-ctp-surface-1" />
          </div>
        </SurfaceCard>
      ))}
    </div>
  )
}

export function ProfileStringSkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2" aria-busy="true">
      <p className="sr-only" role="status">
        Loading strings...
      </p>
      {Array.from({ length: count }, (_, index) => (
        <SurfaceCard key={index} as="div" className="animate-pulse p-4" aria-hidden="true">
          <div className="h-4 w-1/2 rounded bg-ctp-surface-1" />
          <div className="mt-3 h-3 w-3/4 rounded bg-ctp-surface-1" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-ctp-surface-1" />
            <div className="h-3 w-full rounded bg-ctp-surface-1" />
            <div className="h-3 w-2/3 rounded bg-ctp-surface-1" />
          </div>
        </SurfaceCard>
      ))}
    </div>
  )
}

export function ProfileVouchSkeletons({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      <p className="sr-only" role="status">
        Loading vouches...
      </p>
      {Array.from({ length: count }, (_, index) => (
        <SurfaceCard
          key={index}
          as="div"
          className="animate-pulse border-l-4 border-l-ctp-surface-1 p-4"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-ctp-surface-1" />
            <div className="h-3 w-28 rounded bg-ctp-surface-1" />
            <div className="ml-auto h-3 w-16 rounded bg-ctp-surface-1" />
          </div>
          <div className="mt-4 h-3 w-4/5 rounded bg-ctp-surface-1" />
        </SurfaceCard>
      ))}
    </div>
  )
}
