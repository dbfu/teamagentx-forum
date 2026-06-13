import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../../shared/components/Header'
import CommentList from '../../../shared/components/CommentList'
import Avatar from '../../../shared/components/Avatar'
import Loading from '../../../shared/components/Loading'

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    nickname: string
    avatar?: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  createdAt: string
  viewCount: number
  commentCount: number
  likeCount: number
  isPinned: boolean
  isEssence: boolean
}

interface Comment {
  id: string
  author: string
  authorAvatar?: string
  time: string
  content: string
  likes: number
  replies?: Comment[]
}

function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<Post | null>(null)
  const [liked, setLiked] = useState(false)
  const [collected, setCollected] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isAdmin] = useState(false) // Mock: 实际应从用户状态获取

  // Mock user data (实际应该从全局状态或API获取)
  const user = {
    id: 'user-123',
    nickname: '测试用户',
    avatar: undefined
  }

  // Mock comments data
  const mockComments: Comment[] = [
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
      content: '并行开发这点特别实用！之前我们都是串行，效率很低。',
      likes: 18,
      replies: []
    }
  ]

  useEffect(() => {
    // TODO: 调用 API 获取帖子详情
    // 这里使用 mock 数据
    const mockPost: Post = {
      id: id || '1',
      title: '多助手协作的最佳实践分享',
      content: `<p>大家好，今天想和大家分享一下我在使用 TeamAgentX 多助手协作功能时的一些经验和最佳实践。</p>
        <h3 class="text-lg font-semibold mt-4 mb-2">1. 明确分工，各司其职</h3>
        <p>在配置群聊规则时，首先要明确每个助手的职责范围。比如：</p>
        <ul class="list-disc pl-6 mt-2 space-y-1">
          <li><strong>产品经理</strong>：负责需求分析和文档编写</li>
          <li><strong>架构师</strong>：负责技术架构设计</li>
          <li><strong>前端/后端开发</strong>：负责具体代码实现</li>
          <li><strong>测试</strong>：负责质量保证</li>
        </ul>
        <p class="mt-4">希望这些经验对大家有帮助！有任何问题欢迎在评论区讨论。</p>`,
      author: {
        id: 'author-1',
        nickname: '资深用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=senior'
      },
      category: {
        id: '1',
        name: '讨论区',
        slug: 'discussion'
      },
      createdAt: '2026-06-12 10:30',
      viewCount: 1842,
      commentCount: 56,
      likeCount: 89,
      isPinned: true,
      isEssence: true
    }

    setTimeout(() => {
      setPost(mockPost)
      setLoading(false)
    }, 500)
  }, [id])

  const handleLike = () => {
    if (!liked) {
      setLiked(true)
      // TODO: 调用点赞 API
      alert('点赞成功！')
    } else {
      setLiked(false)
      // TODO: 调用取消点赞 API
      alert('取消点赞！')
    }
  }

  const handleCollect = () => {
    if (!collected) {
      setCollected(true)
      // TODO: 调用收藏 API
      alert('收藏成功！')
    } else {
      setCollected(false)
      // TODO: 调用取消收藏 API
      alert('取消收藏！')
    }
  }

  const handleReport = () => {
    // TODO: 调用举报 API 或显示举报弹窗
    alert('举报功能待实现')
  }

  const handleEdit = () => {
    // TODO: 跳转到编辑页面
    navigate('/create-post')
  }

  const handleDelete = () => {
    if (confirm('确定要删除这篇帖子吗？')) {
      // TODO: 调用删除 API
      alert('删除成功！')
      navigate('/')
    }
  }

  const handlePin = () => {
    // TODO: 调用置顶/取消置顶 API
    alert(post?.isPinned ? '取消置顶成功！' : '置顶成功！')
  }

  const handleEssence = () => {
    // TODO: 调用加精/取消加精 API
    alert(post?.isEssence ? '取消加精成功！' : '加精成功！')
  }

  const handleMove = () => {
    // TODO: 显示移动帖子弹窗
    alert('移动帖子功能待实现')
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) {
      alert('请输入评论内容')
      return
    }
    // TODO: 调用发表评论 API
    alert('评论发表成功！')
    setCommentText('')
  }

  const handleReply = (_commentId: string, replyTo?: string) => {
    // TODO: 实现回复逻辑
    alert(`回复 ${replyTo || '评论'}`)
  }

  const handleLikeComment = (_commentId: string, _isReply?: boolean, _replyId?: string) => {
    // TODO: 调用点赞评论 API
    alert('点赞评论成功！')
  }

  const handleReportComment = (_commentId: string) => {
    // TODO: 调用举报评论 API
    alert('举报评论功能待实现')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="flex justify-center py-20">
          <Loading text="加载帖子详情..." />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-4">帖子不存在</h2>
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
            {/* Post content */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              {/* Post header */}
              <div className="flex items-center gap-2 mb-4">
                {post.isPinned && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                    </svg>
                    置顶
                  </span>
                )}
                {post.isEssence && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    精华
                  </span>
                )}
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                  {post.category.name}
                </span>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>

              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <Avatar src={post.author.avatar} alt={post.author.nickname} size="lg" seed={post.author.id} />
                <div>
                  <p className="font-medium text-gray-900">{post.author.nickname}</p>
                  <p className="text-sm text-gray-500">{post.createdAt}</p>
                </div>
              </div>

              {/* Post body */}
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Stats */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.viewCount} 浏览
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.commentCount} 回复
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  点赞 {liked ? post.likeCount + 1 : post.likeCount}
                </button>
                <button
                  onClick={handleCollect}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    collected ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill={collected ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  收藏
                </button>
                <button
                  onClick={handleReport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  举报
                </button>
                <div className="flex-1"></div>
                {/* 只有作者或管理员可以编辑/删除 */}
                {(user.id === post.author.id || isAdmin) && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      编辑
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      删除
                    </button>
                  </>
                )}
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">管理员操作：</span>
                  <button
                    onClick={handlePin}
                    className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 bg-white rounded border border-gray-200"
                  >
                    {post.isPinned ? '取消置顶' : '置顶'}
                  </button>
                  <button
                    onClick={handleEssence}
                    className="text-sm text-amber-600 hover:text-amber-700 px-3 py-1 bg-white rounded border border-gray-200"
                  >
                    {post.isEssence ? '取消加精' : '加精'}
                  </button>
                  <button
                    onClick={handleMove}
                    className="text-sm text-gray-600 hover:text-gray-700 px-3 py-1 bg-white rounded border border-gray-200"
                  >
                    移动帖子
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm text-red-600 hover:text-red-700 px-3 py-1 bg-white rounded border border-gray-200"
                  >
                    删除帖子
                  </button>
                </div>
              )}
            </div>

            {/* Comment section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                评论 ({post.commentCount})
              </h2>

              {/* Comment input */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    发表评论
                  </button>
                </div>
              </form>

              {/* Comment list */}
              <CommentList
                comments={mockComments}
                onReply={handleReply}
                onLike={handleLikeComment}
                onReport={handleReportComment}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-72">
            <div className="space-y-6">
              {/* Author info */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">作者信息</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar src={post.author.avatar} alt={post.author.nickname} size="xl" seed={post.author.id} />
                  <div>
                    <p className="font-medium text-gray-900">{post.author.nickname}</p>
                    <p className="text-sm text-gray-500">发帖数：56</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/user/${post.author.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  查看个人主页 →
                </button>
              </div>

              {/* Back to section */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <button
                  onClick={() => navigate(`/section/${post.category.slug}`)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  返回 {post.category.name}
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

export default PostDetailPage