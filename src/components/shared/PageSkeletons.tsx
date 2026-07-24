import { LoadingPanel } from './LoadingPanel'
import { PageContainer } from '../layout/PageContainer'

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
