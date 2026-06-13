import Header from '../../../shared/components/Header'
import PostList from '../../../shared/components/PostList'

function HomePage() {
  // Mock data - 实际应该从API获取
  const user = {
    id: 'user-123',
    nickname: '测试用户',
    avatar: undefined
  }

  const mockPosts = [
    {
      id: '1',
      title: '多助手协作的最佳实践分享',
      author: '资深用户',
      time: '2026-06-12 10:30',
      section: '讨论区',
      views: 1842,
      replies: 56,
      isEssence: true,
      isPinned: true
    },
    {
      id: '2',
      title: '求助：如何配置群聊规则？',
      author: '新用户X',
      time: '2026-06-12 09:15',
      section: '问题反馈',
      views: 123,
      replies: 8
    },
    {
      id: '3',
      title: '分享一下我的自动化工作流',
      author: '效率达人',
      time: '2026-06-12 08:00',
      section: '项目展示',
      views: 89,
      replies: 12
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">最新帖子</h2>
          <PostList
            posts={mockPosts}
            currentPage={1}
            totalPages={5}
            onPageChange={(page: number) => console.log('Page changed to:', page)}
            onPostClick={(id: string) => console.log('Clicked post:', id)}
          />
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

export default HomePage