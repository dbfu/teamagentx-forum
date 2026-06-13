import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error, isValidCommentContent } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { createComment, deleteComment, getCommentById, getCommentsByPostId, getCommentDepth } from './service'
import { getPostById } from '../posts/service'
import { PostStatus, CommentStatus } from '@prisma/client'
import { JwtPayload } from '../../shared/types'

interface CreateCommentBody {
  content: string
  parentId?: string
}

interface CommentQuery {
  page?: number
  pageSize?: number
}

// 创建评论
export async function createCommentController(request: FastifyRequest<{ Params: { postId: string }; Body: CreateCommentBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { postId } = request.params
  const { content, parentId } = request.body

  // 验证帖子存在
  const post = await getPostById(postId)
  if (!post) {
    return reply.status(400).send(error(ErrorCodes.COMMENT_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  // 验证评论内容
  if (!isValidCommentContent(content)) {
    return reply.status(400).send(error(ErrorCodes.COMMENT_LENGTH_ERROR))
  }

  // 如果是楼中楼，验证父评论
  if (parentId) {
    const parentComment = await getCommentById(parentId)
    if (!parentComment || parentComment.postId !== postId) {
      return reply.status(400).send(error(ErrorCodes.PARENT_COMMENT_NOT_FOUND))
    }

    if (parentComment.status === CommentStatus.DELETED) {
      return reply.status(400).send(error(ErrorCodes.PARENT_COMMENT_NOT_FOUND))
    }

    // 检查嵌套层级（最多3层）
    const depth = await getCommentDepth(parentId)
    if (depth >= 2) {
      return reply.status(400).send(error(ErrorCodes.COMMENT_NEST_LIMIT))
    }
  }

  // 创建评论
  const comment = await createComment(content, user.userId, postId, parentId)

  return reply.status(201).send(success({
    id: comment.id,
    content: comment.content,
    author: comment.author,
    parentId: comment.parentId,
    likeCount: comment.likeCount,
    createdAt: comment.createdAt.toISOString(),
  }, '评论成功'))
}

// 删除评论
export async function deleteCommentController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 获取评论
  const comment = await getCommentById(id)
  if (!comment) {
    return reply.status(404).send(error(ErrorCodes.COMMENT_NOT_FOUND))
  }

  if (comment.status === CommentStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.COMMENT_DELETED))
  }

  // 验证权限（作者或管理员可以删除）
  if (comment.authorId !== user.userId && user.role !== 'ADMIN') {
    return reply.status(403).send(error(ErrorCodes.NO_PERMISSION_DELETE_COMMENT))
  }

  // 删除评论
  await deleteComment(id, comment.postId)

  return reply.send(success(null, '删除成功'))
}

// 获取评论列表
export async function getCommentsController(request: FastifyRequest<{ Params: { postId: string }; Querystring: CommentQuery }>, reply: FastifyReply) {
  const user = request.user as JwtPayload | undefined
  const { postId } = request.params
  const { page = 1, pageSize = 20 } = request.query

  // 验证帖子存在
  const post = await getPostById(postId)
  if (!post) {
    return reply.status(400).send(error(ErrorCodes.COMMENT_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  const result = await getCommentsByPostId(postId, page, Math.min(pageSize, 100), user?.userId)

  return reply.send(success(result))
}