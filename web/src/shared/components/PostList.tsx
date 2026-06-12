import React from 'react'
import PostCard from './PostCard'
import Pagination from './Pagination'
import EmptyState from './EmptyState'
import Loading from './Loading'

interface Post {
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
}

interface PostListProps {
  posts: Post[]
  loading?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onPostClick?: (postId: string) => void
  emptyTitle?: string
  emptyDescription?: string
}

/**
 * 帖子列表组件
 * @param posts - 帖子列表数据
 * @param loading - 是否正在加载
 * @param currentPage - 当前页码
 * @param totalPages - 总页数
 * @param onPageChange - 页码变化回调
 * @param onPostClick - 帖子点击回调
 * @param emptyTitle - 空数据标题
 * @param emptyDescription - 空数据描述
 */
const PostList: React.FC<PostListProps> = ({
  posts,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onPostClick,
  emptyTitle = '暂无帖子',
  emptyDescription = '快来发布第一篇帖子吧！'
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="正在加载帖子..." />
      </div>
    )
  }

  if (posts.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div>
      {/* 帖子列表 */}
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onClick={() => onPostClick?.(post.id)}
          />
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default PostList