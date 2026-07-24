import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { RepoPage } from './pages/RepoPage'
import { PageLayout } from './components/PageLayout'

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path=":handle" element={<ProfilePage />} />
        <Route path=":handle/:repo" element={<RepoPage />} />
      </Routes>
    </PageLayout>
  )
}

export default App
