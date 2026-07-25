import { ActorSearch } from '../components/actor/ActorSearch'
import { PageContainer } from '../components/layout/PageContainer'

export function HomePage() {
  return (
    <main>
      <PageContainer className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-8">
        <section className="w-full max-w-xl text-center">
          <img src="/catppuccin-logo.png" alt="" className="mx-auto mb-5 size-20" />
          <p className="font-mono text-sm text-ctp-overlay-1">An experimental Tangled client.</p>
          <h1 className="mt-3 font-mono text-2xl font-bold text-ctp-text">snrld</h1>
          <div className="mt-6 flex justify-center">
            <ActorSearch variant="prominent" />
          </div>
        </section>
      </PageContainer>
    </main>
  )
}
