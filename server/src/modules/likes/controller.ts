import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { likePost, unlikePost, likeComment, unlikeComment, hasLikedPost, hasLikedComment } from './service'
import { getPostById } from '../posts/service'
import { getCommentById } from '../comments/service'
import { PostStatus, CommentStatus } from '@prisma/client'
import { JwtPayload } from '../../shared/types'

// 点赞帖子
export async function likePostController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 验证帖子存在
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.LIKE_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  // 检查是否已点赞
  const alreadyLiked = await hasLikedPost(user.userId, id)
  if (alreadyLiked) {
    return reply.status(400).send(error(ErrorCodes.ALREADY_LIKED))
  }

  // 点赞
  const likeCount = await likePost(user.userId, id)

  return reply.send(success({ likeCount }, '点赞成功'))
}

// 取消点赞帖子
export async function unlikePostController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 验证帖子存在
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.UNLIKE_POST_NOT_FOUND))
  }

  // 检查是否已点赞
  const alreadyLiked = await hasLikedPost(user.userId, id)
  if (!alreadyLiked) {
    return reply.status(400).send(error(ErrorCodes.NOT_LIKED))
  }

  // 取消点赞
  const likeCount = await unlikePost(user.userId, id)

  return reply.send(success({ likeCount }, '取消点赞成功'))
}

// 点赞评论
export async function likeCommentController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 验证评论存在
  const comment = await getCommentById(id)
  if (!comment) {
    return reply.status(404).send(error(ErrorCodes.LIKE_COMMENT_NOT_FOUND))
  }

  if (comment.status === CommentStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.COMMENT_DELETED))
  }

  // 检查是否已点赞
  const alreadyLiked = await hasLikedComment(user.userId, id)
  if (alreadyLiked) {
    return reply.status(400).send(error(ErrorCodes.ALREADY_LIKED_COMMENT))
  }

  // 点赞
  const likeCount = await likeComment(user.userId, id)

  return reply.send(success({ likeCount }, '点赞成功'))
}

// 取消点赞评论
export async function unlikeCommentController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 验证评论存在
  const comment = await getCommentById(id)
  if (!comment) {
    return reply.status(404).send(error(ErrorCodes.UNLIKE_COMMENT_NOT_FOUND))
  }

  // 检查是否已点赞
  const alreadyLiked = await hasLikedComment(user.userId, id)
  if (!alreadyLiked) {
    return reply.status(400).send(error(ErrorCodes.NOT_LIKED_COMMENT))
  }

  // 取消点赞
  const likeCount = await unlikeComment(user.userId, id)

  return reply.send(success({ likeCount }, '取消点赞成功'))
}