import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { getTopPosts, getHotPosts, getEssencePosts, setPostTop, setPostEssence, movePost, countTopPostsInCategory } from './special-service'
import { getPostById } from './service'
import { getCategoryById } from '../categories/service'
import { JwtPayload } from '../../shared/types'
import { PostStatus } from '@prisma/client'

interface TopQuery {
  category?: string
}

interface HotQuery {
  limit?: number
}

interface EssenceQuery {
  page?: number
  pageSize?: number
}

interface TopBody {
  isTop: boolean
}

interface EssenceBody {
  isEssence: boolean
}

interface MoveBody {
  categoryId: string
}

// 获取置顶帖子
export async function getTopPostsController(request: FastifyRequest<{ Querystring: TopQuery }>, reply: FastifyReply) {
  const { category } = request.query

  const posts = await getTopPosts(category)

  return reply.send(success(posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    category: post.category,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt.toISOString(),
  }))))
}

// 获取热门帖子
export async function getHotPostsController(request: FastifyRequest<{ Querystring: HotQuery }>, reply: FastifyReply) {
  const { limit = 10 } = request.query

  const posts = await getHotPosts(Math.min(limit, 50))

  return reply.send(success(posts))
}

// 获取精华帖子
export async function getEssencePostsController(request: FastifyRequest<{ Querystring: EssenceQuery }>, reply: FastifyReply) {
  const { page = 1, pageSize = 20 } = request.query

  const result = await getEssencePosts(page, Math.min(pageSize, 100))

  return reply.send(success(result))
}

// 置顶帖子（管理员）
export async function setPostTopController(request: FastifyRequest<{ Params: { id: string }; Body: TopBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user || user.role !== 'ADMIN') {
    return reply.status(403).send(error(ErrorCodes.NO_PERMISSION_TOP))
  }

  const { id } = request.params
  const { isTop } = request.body

  // 获取帖子
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.TOP_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  // 如果要置顶，检查版块置顶数量限制
  if (isTop) {
    const topCount = await countTopPostsInCategory(post.categoryId)
    if (topCount >= 5) {
      return reply.status(400).send(error(ErrorCodes.TOP_LIMIT_EXCEEDED))
    }
  }

  await setPostTop(id, isTop)

  return reply.send(success(null, isTop ? '置顶成功' : '取消置顶成功'))
}

// 加精帖子（管理员）
export async function setPostEssenceController(request: FastifyRequest<{ Params: { id: string }; Body: EssenceBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user || user.role !== 'ADMIN') {
    return reply.status(403).send(error(ErrorCodes.NO_PERMISSION_ESSENCE))
  }

  const { id } = request.params
  const { isEssence } = request.body

  // 获取帖子
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.ESSENCE_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  await setPostEssence(id, isEssence)

  return reply.send(success(null, isEssence ? '加精成功' : '取消加精成功'))
}

// 移动帖子（管理员）
export async function movePostController(request: FastifyRequest<{ Params: { id: string }; Body: MoveBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user || user.role !== 'ADMIN') {
    return reply.status(403).send(error(ErrorCodes.NO_PERMISSION_MOVE))
  }

  const { id } = request.params
  const { categoryId } = request.body

  // 获取帖子
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.MOVE_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  // 验证目标版块
  const category = await getCategoryById(categoryId)
  if (!category) {
    return reply.status(400).send(error(ErrorCodes.MOVE_CATEGORY_NOT_FOUND))
  }

  await movePost(id, categoryId)

  return reply.send(success(null, '移动成功'))
}