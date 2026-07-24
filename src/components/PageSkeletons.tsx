import { LoadingPanel } from './LoadingPanel'

export function ProfilePageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <LoadingPanel label="Loading profile" className="h-64" />
        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
          <LoadingPanel label="Loading pinned repository" className="h-48" />
          <LoadingPanel label="Loading pinned repository" className="h-48" />
        </div>
      </div>
      <LoadingPanel label="Loading repositories" className="mt-12 h-96" />
    </main>
  )
}

export function RepoPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <LoadingPanel label="Loading repository owner" className="h-16" />
      <LoadingPanel label="Loading repository" className="mt-8 h-56" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <LoadingPanel label="Loading files" className="h-96" />
        <LoadingPanel label="Loading commits" className="h-96" />
      </div>
    </main>
  )
}
