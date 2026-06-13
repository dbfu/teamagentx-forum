import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../../shared/components/Header'
import Avatar from '../../../shared/components/Avatar'
import PostList from '../../../shared/components/PostList'
import Modal from '../../../shared/components/Modal'
import Loading from '../../../shared/components/Loading'

interface User {
  id: string
  nickname: string
  avatar?: string
  email: string
  level: string
  registerTime: string
  postsCount: number
  repliesCount: number
  collectionCount: number
  likesReceived: number
}

interface Post {
  id: string
  title: string
  author: string
  time: string
  section: string
  views: number
  replies: number
  isEssence?: boolean
}

interface Collection {
  id: string
  title: string
  author: string
  section: string
  time: string
  isEssence?: boolean
}

function UserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'settings'>('posts')
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [userCollections, setUserCollections] = useState<Collection[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    nickname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Mock current user (实际应该从全局状态获取)
  const currentUser = {
    id: 'user-123',
    nickname: '测试用户',
    avatar: undefined
  }

  const isCurrentUser = currentUser.id === id

  useEffect(() => {
    // TODO: 调用 API 获取用户信息
    // 这里使用 mock 数据
    const mockUser: User = {
      id: id || 'user-123',
      nickname: '测试用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
      email: 'user@example.com',
      level: 'Lv.3 活跃用户',
      registerTime: '2026-05-01',
      postsCount: 12,
      repliesCount: 45,
      collectionCount: 8,
      likesReceived: 89
    }

    const mockPosts: Post[] = [
      {
        id: '1',
        title: '分享一下我的自动化工作流',
        author: '测试用户',
        time: '2026-06-12',
        section: '项目展示',
        views: 123,
        replies: 8
      },
      {
        id: '2',
        title: '求助：如何配置群聊规则？',
        author: '测试用户',
        time: '2026-06-11',
        section: '问题反馈',
        views: 256,
        replies: 15,
        isEssence: true
      },
      {
        id: '3',
        title: '界面交互体验改进建议',
        author: '测试用户',
        time: '2026-06-10',
        section: '问题反馈',
        views: 156,
        replies: 7
      }
    ]

    const mockCollections: Collection[] = [
      {
        id: '1',
        title: '多助手协作的最佳实践分享',
        author: '资深用户',
        section: '讨论区',
        time: '2026-06-12',
        isEssence: true
      },
      {
        id: '2',
        title: 'API 调用优化技巧总结',
        author: '技术达人',
        section: '讨论区',
        time: '2026-06-10',
        isEssence: true
      },
      {
        id: '3',
        title: 'TeamAgentX 2.0 正式发布！',
        author: '官方团队',
        section: '公告',
        time: '2026-06-08'
      }
    ]

    setTimeout(() => {
      setUser(mockUser)
      setUserPosts(mockPosts)
      setUserCollections(mockCollections)
      setEditFormData({
        nickname: mockUser.nickname,
        email: mockUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setLoading(false)
    }, 500)
  }, [id])

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    if (editFormData.newPassword && editFormData.newPassword !== editFormData.confirmPassword) {
      alert('新密码和确认密码不一致')
      return
    }

    // TODO: 调用 API 更新用户信息
    alert('个人信息更新成功！')
    setShowEditModal(false)
  }

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  const handleCollectionClick = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={currentUser} />
        <div className="flex justify-center py-20">
          <Loading text="加载用户信息..." />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={currentUser} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-4">用户不存在</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* User info card */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <Avatar src={user.avatar} alt={user.nickname} size="xl" seed={user.id} />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.nickname}</h1>
                    <p className="text-gray-500 mt-1">{user.level}</p>
                    <p className="text-sm text-gray-500 mt-2">注册时间：{user.registerTime}</p>
                  </div>
                </div>
                {isCurrentUser && (
                  <button
                    onClick={handleEditProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    编辑资料
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{user.postsCount}</p>
                  <p className="text-sm text-gray-500">发帖数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{user.repliesCount}</p>
                  <p className="text-sm text-gray-500">回复数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{user.collectionCount}</p>
                  <p className="text-sm text-gray-500">收藏数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{user.likesReceived}</p>
                  <p className="text-sm text-gray-500">收到点赞</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'posts'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    我的帖子
                  </button>
                  <button
                    onClick={() => setActiveTab('collections')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'collections'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    我的收藏
                  </button>
                  {isCurrentUser && (
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'settings'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      个人设置
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'posts' && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-4">
                      {isCurrentUser ? '我的帖子' : `${user.nickname}的帖子`}
                    </h2>
                    <PostList
                      posts={userPosts}
                      onPostClick={handlePostClick}
                      emptyTitle="暂无帖子"
                      emptyDescription={isCurrentUser ? '快来发布第一篇帖子吧！' : '该用户还没有发布帖子'}
                    />
                  </div>
                )}

                {activeTab === 'collections' && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-4">
                      {isCurrentUser ? '我的收藏' : `${user.nickname}的收藏`}
                    </h2>
                    {userCollections.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {isCurrentUser ? '暂无收藏，去收藏一些感兴趣的帖子吧！' : '该用户还没有收藏帖子'}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userCollections.map(collection => (
                          <div
                            key={collection.id}
                            onClick={() => handleCollectionClick(collection.id)}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                                {collection.section}
                              </span>
                              {collection.isEssence && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium">
                                  精华
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-medium text-gray-900 hover:text-blue-600 mb-2">
                              {collection.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{collection.author}</span>
                              <span>{collection.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && isCurrentUser && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-6">个人设置</h2>
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          昵称
                        </label>
                        <input
                          type="text"
                          value={editFormData.nickname}
                          onChange={(e) => setEditFormData({ ...editFormData, nickname: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          邮箱
                        </label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-medium text-gray-900 mb-4">修改密码</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              当前密码
                            </label>
                            <input
                              type="password"
                              value={editFormData.currentPassword}
                              onChange={(e) => setEditFormData({ ...editFormData, currentPassword: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              新密码
                            </label>
                            <input
                              type="password"
                              value={editFormData.newPassword}
                              onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                              placeholder="6-20字符"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              确认新密码
                            </label>
                            <input
                              type="password"
                              value={editFormData.confirmPassword}
                              onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          保存修改
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-72">
            <div className="space-y-6">
              {/* Back to home */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 w-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            © 2026 TeamAgentX. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑个人信息"
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              昵称
            </label>
            <input
              type="text"
              value={editFormData.nickname}
              onChange={(e) => setEditFormData({ ...editFormData, nickname: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default UserPage