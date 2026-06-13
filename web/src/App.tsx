import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './modules/post/pages/HomePage'
import CreatePostPage from './modules/post/pages/CreatePostPage'
import LoginPage from './modules/auth/pages/LoginPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 其他路由后续添加 */}
        {/* <Route path="/post/:id" element={<PostDetailPage />} /> */}
        {/* <Route path="/section/:slug" element={<SectionPage />} /> */}
        {/* <Route path="/user/:id" element={<UserPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App