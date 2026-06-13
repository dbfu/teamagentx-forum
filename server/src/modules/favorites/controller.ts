import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { favoritePost, unfavoritePost, hasFavorited } from './service'
import { getPostById } from '../posts/service'
import { PostStatus } from '@prisma/client'
import { JwtPayload } from '../../shared/types'

// 收藏帖子
export async function favoritePostController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 验证帖子存在
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.FAVORITE_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  // 检查是否已收藏
  const alreadyFavorited = await hasFavorited(user.userId, id)
  if (alreadyFavorited) {
    return reply.status(400).send(error(ErrorCodes.ALREADY_FAVORITED))
  }

  // 收藏
  await favoritePost(user.userId, id)

  return reply.send(success(null, '收藏成功'))
}

// 取消收藏帖子
export async function unfavoritePostController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params

  // 验证帖子存在
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.UNFAVORITE_POST_NOT_FOUND))
  }

  // 检查是否已收藏
  const alreadyFavorited = await hasFavorited(user.userId, id)
  if (!alreadyFavorited) {
    return reply.status(400).send(error(ErrorCodes.NOT_FAVORITED))
  }

  // 取消收藏
  await unfavoritePost(user.userId, id)

  return reply.send(success(null, '取消收藏成功'))
}