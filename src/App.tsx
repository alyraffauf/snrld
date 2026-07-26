import { Route, Routes } from 'react-router-dom'
import { PageLayout } from './components/layout/PageLayout'
import { ErrorPage } from './components/shared/ErrorPage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { RepoPage } from './pages/RepoPage'
import { StringPage } from './pages/StringPage'

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route index element={<HomePage />} />
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

export default App
