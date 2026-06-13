import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './modules/post/pages/HomePage'
import CreatePostPage from './modules/post/pages/CreatePostPage'
import PostDetailPage from './modules/post/pages/PostDetailPage'
import UserPage from './modules/user/pages/UserPage'
import LoginPage from './modules/auth/pages/LoginPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 其他路由后续添加 */}
        {/* <Route path="/section/:slug" element={<SectionPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App