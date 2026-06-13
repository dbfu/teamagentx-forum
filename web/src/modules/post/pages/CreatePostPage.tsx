import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../shared/components/Header'

interface Category {
  id: string
  name: string
  slug: string
}

const categories: Category[] = [
  { id: '1', name: '讨论区', slug: 'discussion' },
  { id: '2', name: '问题反馈', slug: 'feedback' },
  { id: '3', name: '项目展示', slug: 'showcase' },
]

function CreatePostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [publishing, setPublishing] = useState(false)

  // Mock user data (实际应该从全局状态或API获取)
  const user = {
    id: 'user-123',
    nickname: '测试用户',
    avatar: undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('请输入标题')
      return
    }

    if (!selectedCategory) {
      alert('请选择版块')
      return
    }

    if (!content.trim()) {
      alert('请输入内容')
      return
    }

    if (title.length > 100) {
      alert('标题不能超过100字符')
      return
    }

    setPublishing(true)

    // TODO: 调用后端API发布帖子
    // 这里先用 mock 数据模拟
    setTimeout(() => {
      setPublishing(false)
      alert('发布成功！')
      navigate('/')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">发布新帖</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 版块选择器 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择版块
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">请选择版块</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                公告版块仅管理员可发布
              </p>
            </div>

            {/* 标题输入框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入标题（1-100字符）"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {title.length} / 100 字符
              </p>
            </div>

            {/* 内容编辑器 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容
              </label>
              {/* 暂时使用 textarea，后续可升级为 TipTap 富文本编辑器 */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入帖子内容..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px] resize-y"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                支持文字、图片、代码块等（后续升级为富文本编辑器）
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={publishing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? '发布中...' : '发布'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreatePostPage