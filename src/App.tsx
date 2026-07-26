import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { PageLayout } from './components/layout/PageLayout'
import { ErrorPage } from './components/shared/ErrorPage'
import { HomePage } from './pages/HomePage'
import { IssuePage } from './pages/IssuePage'
import { ProfilePage } from './pages/ProfilePage'
import { PullPage } from './pages/PullPage'
import { RepoPage } from './pages/RepoPage'
import { StringPage } from './pages/StringPage'

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path=":repoOwner/:repo/issues/:issueOwner/:issue" element={<IssuePage />} />
        <Route path=":repoOwner/:repo/pulls/:pullOwner/:pull" element={<PullPage />} />
        <Route path=":handle/:repo/issues" element={<RepoSectionRedirect section="issues" />} />
        <Route path=":handle/:repo/pulls" element={<RepoSectionRedirect section="pulls" />} />
        <Route path=":handle" element={<ProfilePage />} />
        <Route path=":handle/:repo" element={<RepoPage />} />
        <Route path="strings/:handle/:string" element={<StringPage />} />
        <Route
          path="*"
          element={
            <ErrorPage title="Page not found" message="This address doesn't point to a page." />
          }
        />
      </Routes>
    </PageLayout>
  )
}

type RepoSectionRedirectProps = {
  section: 'issues' | 'pulls'
}

function RepoSectionRedirect({ section }: RepoSectionRedirectProps) {
  const { handle, repo } = useParams()

  if (handle === undefined || repo === undefined) {
    return <Navigate to="/" replace />
  }

  return <Navigate to={`/${handle}/${repo}?view=${section}`} replace />
}

export default App
