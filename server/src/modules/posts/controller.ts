import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error, isValidTitle, isValidPostContent } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { createPost, updatePost, deletePost, getPostById, getPosts, incrementViewCount, checkPostInteraction } from './service'
import { getCategoryById } from '../categories/service'
import { JwtPayload } from '../../shared/types'
import { PostStatus } from '@prisma/client'

interface CreatePostBody {
  title: string
  content: string
  categoryId: string
}

interface UpdatePostBody {
  title?: string
  content?: string
  categoryId?: string
}

interface PostQuery {
  page?: number
  pageSize?: number
  category?: string
  author?: string
  keyword?: string
  sort?: 'latest' | 'hot'
}

// 创建帖子
export async function createPostController(request: FastifyRequest<{ Body: CreatePostBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { title, content, categoryId } = request.body

  // 验证标题
  if (!isValidTitle(title)) {
    return reply.status(400).send(error(ErrorCodes.TITLE_LENGTH_ERROR))
  }

  // 验证内容
  if (!isValidPostContent(content)) {
    return reply.status(400).send(error(ErrorCodes.CONTENT_LENGTH_ERROR))
  }

  // 验证版块存在
  const category = await getCategoryById(categoryId)
  if (!category) {
    return reply.status(400).send(error(ErrorCodes.CATEGORY_NOT_EXISTS))
  }

  // 创建帖子
  const post = await createPost(title, content, user.userId, categoryId)

  return reply.status(201).send(success({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author,
    category: post.category,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt.toISOString(),
  }, '发布成功'))
}

// 更新帖子
export async function updatePostController(request: FastifyRequest<{ Params: { id: string }; Body: UpdatePostBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params
  const { title, content, categoryId } = request.body

  // 获取帖子
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.EDIT_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.EDIT_POST_DELETED))
  }

  // 验证权限（只有作者可以编辑）
  if (post.authorId !== user.userId && user.role !== 'ADMIN') {
    return reply.status(403).send(error(ErrorCodes.NO_PERMISSION_EDIT))
  }

  // 验证标题
  if (title && !isValidTitle(title)) {
    return reply.status(400).send(error(ErrorCodes.TITLE_LENGTH_ERROR))
  }

  // 验证内容
  if (content && !isValidPostContent(content)) {
    return reply.status(400).send(error(ErrorCodes.CONTENT_LENGTH_ERROR))
  }

  // 验证版块
  if (categoryId) {
    const category = await getCategoryById(categoryId)
    if (!category) {
      return reply.status(400).send(error(ErrorCodes.MOVE_CATEGORY_NOT_FOUND))
    }
  }

  // 更新帖子
  const updateData: { title?: string; content?: string; categoryId?: string } = {}
  if (title) updateData.title = title
  if (content) updateData.content = content
  if (categoryId) updateData.categoryId = categoryId

  const updatedPost = await updatePost(id, updateData)

  return reply.send(success({
    id: updatedPost.id,
    title: updatedPost.title,
    content: updatedPost.content,
    updatedAt: updatedPost.updatedAt.toISOString(),
  }, '更新成功'))
}

// 删除帖子
export async function deletePostController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 获取帖子
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.DELETE_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.DELETE_POST_DELETED))
  }

  // 验证权限（作者或管理员可以删除）
  if (post.authorId !== user.userId && user.role !== 'ADMIN') {
    return reply.status(403).send(error(ErrorCodes.NO_PERMISSION_DELETE))
  }

  // 删除帖子
  await deletePost(id)

  return reply.send(success(null, '删除成功'))
}

// 获取帖子详情
export async function getPostDetailController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload | undefined
  const { id } = request.params

  // 获取帖子
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(404).send(error(ErrorCodes.POST_DELETED))
  }

  // 增加浏览量
  await incrementViewCount(id)

  // 检查点赞/收藏状态（如果已登录）
  let isLiked = false
  let isFavorited = false
  if (user) {
    const interaction = await checkPostInteraction(id, user.userId)
    isLiked = interaction.isLiked
    isFavorited = interaction.isFavorited
  }

  return reply.send(success({
    id: post.id,
    title: post.title,
    content: post.content,
    author: {
      id: post.author.id,
      nickname: post.author.nickname,
      avatar: post.author.avatar,
      role: post.author.role as 'USER' | 'ADMIN',
    },
    category: post.category,
    isTop: post.isTop,
    isEssence: post.isEssence,
    viewCount: post.viewCount + 1,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    isLiked,
    isFavorited,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))
}

// 获取帖子列表
export async function getPostsController(request: FastifyRequest<{ Querystring: PostQuery }>, reply: FastifyReply) {
  const { page = 1, pageSize = 20, category, author, keyword, sort } = request.query

  const result = await getPosts({
    page,
    pageSize: Math.min(pageSize, 100),
    category,
    author,
    keyword,
    sort,
  })

  return reply.send(success(result))
}