import { useState } from 'react'
import {
  Header,
  PostList,
  CommentList,
  Pagination,
  Modal,
  Loading,
  EmptyState,
  Avatar
} from './shared/components'

function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  // Mock data
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

  const mockComments = [
    {
      id: 'comment-1',
      author: '新手用户',
      time: '2026-06-12 11:00',
      content: '非常感谢分享！请问如果是小型项目，是否也需要这么多助手角色？',
      likes: 12,
      replies: [
        {
          id: 'reply-1-1',
          author: '资深用户',
          time: '2026-06-12 11:15',
          content: '小型项目可以简化，比如只用产品经理、开发、测试三个角色就够了。',
          likes: 5,
          replies: [
            {
              id: 'reply-1-1-1',
              author: '新手用户',
              time: '2026-06-12 11:30',
              content: '明白了，这样配置起来也更简单！',
              likes: 2,
              replies: []
            }
          ]
        }
      ]
    },
    {
      id: 'comment-2',
      author: '效率达人',
      time: '2026-06-12 12:00',
      content: '并行开发这点特别实用！之前我们都是串行，效率很低。现在改成并行后，开发周期缩短了差不多30%。',
      likes: 18,
      replies: []
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 组件展示区域 */}
        <div className="space-y-8">
          {/* Avatar 组件 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Avatar 组件</h2>
            <div className="flex items-center gap-4">
              <Avatar size="sm" seed="user1" />
              <Avatar size="md" seed="user2" />
              <Avatar size="lg" seed="user3" />
              <Avatar size="xl" seed="user4" />
            </div>
          </div>

          {/* PostList 组件 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">PostList 组件</h2>
            <PostList
              posts={mockPosts}
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
              onPostClick={(id) => console.log('Clicked post:', id)}
            />
          </div>

          {/* CommentList 组件 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">CommentList 组件</h2>
            <CommentList
              comments={mockComments}
              onReply={(commentId, replyTo) => console.log('Reply to:', commentId, replyTo)}
              onLike={(commentId) => console.log('Like comment:', commentId)}
              onReport={(commentId) => console.log('Report comment:', commentId)}
            />
          </div>

          {/* Pagination 组件 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Pagination 组件</h2>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Loading 组件 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Loading 组件</h2>
            <div className="flex items-center gap-8">
              <Loading size="sm" text="小尺寸" />
              <Loading size="md" text="中等尺寸" />
              <Loading size="lg" text="大尺寸" />
            </div>
          </div>

          {/* EmptyState 组件 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">EmptyState 组件</h2>
            <EmptyState
              title="暂无数据"
              description="这里还没有任何内容"
            />
          </div>

          {/* Modal 组件 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Modal 组件</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              打开弹窗
            </button>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="这是一个弹窗"
            >
              <p className="text-gray-700">这是弹窗的内容区域，可以放置任何组件或内容。</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                关闭
              </button>
            </Modal>
          </div>

          {/* Empty PostList */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Empty PostList 组件</h2>
            <PostList
              posts={[]}
              emptyTitle="暂无帖子"
              emptyDescription="快来发布第一篇帖子吧！"
            />
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

export default App