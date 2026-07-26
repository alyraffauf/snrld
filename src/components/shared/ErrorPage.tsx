import { Link } from 'react-router-dom'
import { PageContainer } from '../layout/PageContainer'
import { SurfaceCard } from './SurfaceCard'

type ErrorPageProps = {
  title: string
  message: string
  details?: string
}

export function ErrorPage({ title, message, details }: ErrorPageProps) {
  return (
    <main>
      <PageContainer className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-8">
        <section className="w-full max-w-xl" role="alert">
          <SurfaceCard className="p-8 text-center">
            <h1 className="font-mono text-2xl text-ctp-text">{title}</h1>
            <p className="mt-3">{message}</p>

            {details !== undefined && (
              <details className="mt-5 rounded border border-ctp-surface-1 bg-ctp-crust p-3 text-left text-sm">
                <summary className="cursor-pointer font-mono text-ctp-subtext-0">
                  Technical details
                </summary>
                <p className="mt-3 break-words font-mono text-xs text-ctp-subtext-1">{details}</p>
              </details>
            )}

            <Link to="/" className="mt-6 inline-block font-mono text-sm">
              Go home
            </Link>
          </SurfaceCard>
        </section>
      </PageContainer>
    </main>
  )
}
