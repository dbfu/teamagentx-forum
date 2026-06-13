import React from 'react'
import Avatar from './Avatar'
import EmptyState from './EmptyState'

interface Reply {
  id: string
  author: string
  authorAvatar?: string
  time: string
  content: string
  likes: number
  replies?: Reply[]
}

interface Comment {
  id: string
  author: string
  authorAvatar?: string
  time: string
  content: string
  likes: number
  replies?: Reply[]
}

interface CommentListProps {
  comments: Comment[]
  onReply?: (commentId: string, replyTo?: string) => void
  onLike?: (commentId: string, isReply?: boolean, replyId?: string) => void
  onReport?: (commentId: string) => void
  maxDepth?: number // 最大嵌套深度，默认为3
}

/**
 * 嵌套回复组件
 */
const ReplyItem: React.FC<{
  reply: Reply
  depth: number
  maxDepth: number
  onReply?: (commentId: string, replyTo?: string) => void
  onLike?: (commentId: string, isReply?: boolean, replyId?: string) => void
}> = ({ reply, depth, maxDepth, onReply, onLike }) => {
  const depthClasses: Record<number, string> = {
    1: 'ml-8',
    2: 'ml-16',
    3: 'ml-24'
  }

  return (
    <div className={`${depthClasses[depth] || 'ml-8'} mt-3 pl-4 border-l-2 border-gray-200`}>
      <div className="flex items-start gap-3">
        <Avatar src={reply.authorAvatar} alt={reply.author} size="sm" seed={reply.author} />
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">{reply.author}</span>
            <span className="text-sm text-gray-500">{reply.time}</span>
          </div>
          <p className="text-sm text-gray-700">{reply.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike?.(reply.id, true)}
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {reply.likes}
            </button>
            {depth < maxDepth && (
              <button
                onClick={() => onReply?.(reply.id, reply.author)}
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                回复
              </button>
            )}
          </div>
        </div>
      </div>
      {reply.replies && reply.replies.length > 0 && (
        <div className="mt-2">
          {reply.replies.map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
              depth={depth + 1}
              maxDepth={maxDepth}
              onReply={onReply}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 评论列表组件
 * @param comments - 评论列表数据
 * @param onReply - 回复回调
 * @param onLike - 点赞回调
 * @param onReport - 举报回调
 * @param maxDepth - 最大嵌套深度
 */
const CommentList: React.FC<CommentListProps> = ({
  comments,
  onReply,
  onLike,
  onReport,
  maxDepth = 3
}) => {
  if (comments.length === 0) {
    return (
      <EmptyState
        title="暂无评论"
        description="快来抢沙发吧！"
        icon={
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white rounded-lg p-4">
          <div className="flex items-start gap-4">
            <Avatar src={comment.authorAvatar} alt={comment.author} size="md" seed={comment.author} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{comment.author}</span>
                <span className="text-sm text-gray-500">{comment.time}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => onLike?.(comment.id)}
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {comment.likes}
                </button>
                <button
                  onClick={() => onReply?.(comment.id)}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  回复
                </button>
                <button
                  onClick={() => onReport?.(comment.id)}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  举报
                </button>
              </div>
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4">
                  {comment.replies.map((r) => (
                    <ReplyItem
                      key={r.id}
                      reply={r}
                      depth={1}
                      maxDepth={maxDepth}
                      onReply={onReply}
                      onLike={onLike}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList