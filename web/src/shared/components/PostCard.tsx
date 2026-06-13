import React from 'react'
import Avatar from './Avatar'

interface PostCardProps {
  id: string
  title: string
  author: string
  authorAvatar?: string
  time: string
  section: string
  views: number
  replies: number
  isEssence?: boolean
  isPinned?: boolean
  onClick?: () => void
}

/**
 * 帖子卡片组件
 * @param id - 帖子ID
 * @param title - 帖子标题
 * @param author - 作者名称
 * @param authorAvatar - 作者头像
 * @param time - 发布时间
 * @param section - 所属版块
 * @param views - 浏览数
 * @param replies - 回复数
 * @param isEssence - 是否精华
 * @param isPinned - 是否置顶
 * @param onClick - 点击回调
 */
const PostCard: React.FC<PostCardProps> = ({
  title,
  author,
  authorAvatar,
  time,
  section,
  views,
  replies,
  isEssence = false,
  isPinned = false,
  onClick
}) => {
  return (
    <div
      className="bg-white rounded-lg p-4 hover:shadow-md cursor-pointer mb-3 transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 标签 */}
          <div className="flex items-center space-x-2 mb-2">
            {isPinned && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
                置顶
              </span>
            )}
            {isEssence && (
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                精华
              </span>
            )}
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              {section}
            </span>
          </div>

          {/* 标题 */}
          <h3 className="text-base font-medium text-gray-900 hover:text-blue-600 mb-2 transition-colors">
            {title}
          </h3>

          {/* 元信息 */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Avatar src={authorAvatar} alt={author} size="sm" seed={author} />
            <span>{author}</span>
            <span>{time}</span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {views}
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {replies}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard