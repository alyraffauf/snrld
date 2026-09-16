import { Link, Outlet } from 'react-router-dom'
import { PageContainer } from './PageContainer'
import { SurfaceCard } from '../shared/SurfaceCard'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <PageContainer className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-8">
          <SurfaceCard className="w-full max-w-xl p-8">
            <section className="w-full max-w-xl text-center">
              <Link to="/" aria-label="Home" className="mx-auto mb-5 block w-fit">
                <img src="/catppuccin-logo.png" alt="" className="size-40" />
              </Link>
              <h1 className="font-mono text-2xl font-bold text-ctp-text">snrld</h1>
              <Outlet />
            </section>
          </SurfaceCard>
        </PageContainer>
      </div>
    </div>
  )
}
