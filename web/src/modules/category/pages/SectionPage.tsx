import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../../shared/components/Header'
import PostList from '../../../shared/components/PostList'
import Loading from '../../../shared/components/Loading'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  postCount: number
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
  isPinned?: boolean
}

// 版块信息配置
const categories: Category[] = [
  {
    id: '1',
    name: '讨论区',
    slug: 'discussion',
    icon: '💬',
    description: '交流 TeamAgentX 使用心得、技巧，分享经验，讨论最佳实践',
    postCount: 1256
  },
  {
    id: '2',
    name: '问题反馈',
    slug: 'feedback',
    icon: '🐛',
    description: '反馈使用过程中遇到的问题，提出改进建议',
    postCount: 892
  },
  {
    id: '3',
    name: '项目展示',
    slug: 'showcase',
    icon: '🚀',
    description: '展示你的创意项目，分享成果，获得反馈',
    postCount: 567
  },
  {
    id: '4',
    name: '公告',
    slug: 'announcement',
    icon: '📢',
    description: '官方动态、产品更新、活动公告',
    postCount: 234
  }
]

function SectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5

  // Mock user data (实际应该从全局状态或API获取)
  const user = {
    id: 'user-123',
    nickname: '测试用户',
    avatar: undefined
  }

  useEffect(() => {
    // 查找对应的版块
    const foundCategory = categories.find(c => c.slug === slug)
    if (!foundCategory) {
      setLoading(false)
      return
    }

    setCategory(foundCategory)

    // TODO: 调用 API 获取该版块的帖子列表
    // 这里使用 mock 数据
    const mockPosts: Post[] = [
      {
        id: '1',
        title: '多助手协作的最佳实践分享',
        author: '资深用户',
        time: '2026-06-12 10:30',
        section: foundCategory.name,
        views: 1842,
        replies: 56,
        isEssence: true,
        isPinned: true
      },
      {
        id: '2',
        title: 'API 调用优化技巧总结',
        author: '技术达人',
        time: '2026-06-12 09:15',
        section: foundCategory.name,
        views: 756,
        replies: 23,
        isEssence: true
      },
      {
        id: '3',
        title: '关于模型选择的讨论',
        author: '技术爱好者',
        time: '2026-06-12 08:00',
        section: foundCategory.name,
        views: 89,
        replies: 12
      },
      {
        id: '4',
        title: '定时任务功能使用教程',
        author: '热心用户',
        time: '2026-06-11 20:00',
        section: foundCategory.name,
        views: 234,
        replies: 15
      },
      {
        id: '5',
        title: '新手常见问题解答汇总',
        author: '官方团队',
        time: '2026-06-11 18:00',
        section: foundCategory.name,
        views: 1567,
        replies: 98,
        isPinned: true
      }
    ]

    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 500)
  }, [slug])

  const handleCreatePost = () => {
    navigate('/create-post')
  }

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // TODO: 调用 API 获取第 page 页的帖子
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="flex justify-center py-20">
          <Loading text="加载版块信息..." />
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-4">版块不存在</h2>
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
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* Section info */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                    <p className="text-gray-500 mt-1">{category.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>帖子数：{category.postCount}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCreatePost}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  发布帖子
                </button>
              </div>
            </div>

            {/* Post list */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">
                {category.name}的帖子
              </h2>

              <PostList
                posts={posts}
                loading={false}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPostClick={handlePostClick}
                emptyTitle="该版块暂无帖子"
                emptyDescription="快来发布第一篇帖子吧！"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-72">
            <div className="space-y-6">
              {/* Other sections */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">其他版块</h3>
                <div className="space-y-2">
                  {categories.filter(c => c.slug !== slug).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => navigate(`/section/${cat.slug}`)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">{cat.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.postCount} 帖子</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

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
    </div>
  )
}

export default SectionPage