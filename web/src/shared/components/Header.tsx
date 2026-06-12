import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'

interface Section {
  name: string
  path: string
  icon?: string
}

interface HeaderProps {
  user?: {
    id: string
    nickname: string
    avatar?: string
  }
  sections?: Section[]
  onSearch?: (keyword: string) => void
  onCreatePost?: () => void
}

/**
 * 顶部导航栏组件
 * @param user - 用户信息（未登录时为 undefined）
 * @param sections - 版块列表
 * @param onSearch - 搜索回调
 * @param onCreatePost - 发帖回调
 * @param onLogout - 登出回调
 */
const Header: React.FC<HeaderProps> = ({
  user,
  sections = [
    { name: '讨论区', path: '/section/discussion' },
    { name: '问题反馈', path: '/section/feedback' },
    { name: '项目展示', path: '/section/showcase' },
    { name: '公告', path: '/section/announcement' }
  ],
  onSearch,
  onCreatePost
}) => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchKeyword.trim() && onSearch) {
      onSearch(searchKeyword.trim())
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo 和版块导航 */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">TeamAgentX</span>
            </Link>

            {/* Desktop 版块导航 */}
            <div className="hidden md:flex space-x-6">
              {sections.map((s) => (
                <Link
                  key={s.name}
                  to={s.path}
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  {s.icon && <span className="mr-1">{s.icon}</span>}
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 搜索框和用户操作 */}
          <div className="flex items-center space-x-4">
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索帖子..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>

            {/* 用户状态 */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/create-post"
                  onClick={onCreatePost}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  发帖
                </Link>
                <Link to={`/user/${user.id}`} className="flex items-center space-x-2">
                  <Avatar src={user.avatar} alt={user.nickname} size="sm" seed={user.id} />
                  <span className="text-sm text-gray-700 hidden lg:block">{user.nickname}</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                登录 / 注册
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {sections.map((s) => (
                <Link
                  key={s.name}
                  to={s.path}
                  className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                >
                  {s.icon && <span className="mr-2">{s.icon}</span>}
                  {s.name}
                </Link>
              ))}
            </div>
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mt-4 px-4">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索帖子..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header