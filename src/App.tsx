import { Route, Routes } from 'react-router-dom'
import { PageLayout } from './components/PageLayout'
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
      </Routes>
    </PageLayout>
  )
}

export default App
