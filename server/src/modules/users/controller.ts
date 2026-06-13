import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error, isValidNickname } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { getUserWithPostCount, getUserPosts, getUserFavorites } from './service'
import { findUserById, updateUserProfile, getUserBasic } from '../auth/service'
import { JwtPayload } from '../../shared/types'

interface ProfileBody {
  nickname?: string
  avatar?: string
}

// 获取用户信息
export async function getUserInfo(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const user = await getUserWithPostCount(id)
  if (!user) {
    return reply.status(404).send(error(ErrorCodes.USER_NOT_FOUND))
  }

  return reply.send(success(user))
}

// 更新用户信息
export async function updateProfile(request: FastifyRequest<{ Body: ProfileBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { nickname, avatar } = request.body

  // 验证昵称
  if (nickname && !isValidNickname(nickname)) {
    return reply.status(400).send(error(ErrorCodes.NEW_PASSWORD_FORMAT_ERROR))
  }

  const updateData: { nickname?: string; avatar?: string } = {}
  if (nickname !== undefined) updateData.nickname = nickname
  if (avatar !== undefined) updateData.avatar = avatar

  const updatedUser = await updateUserProfile(user.userId, updateData)

  return reply.send(success(getUserBasic(updatedUser), '更新成功'))
}

// 获取用户帖子列表
export async function getUserPostList(request: FastifyRequest<{ Params: { id: string }; Querystring: { page?: number; pageSize?: number } }>, reply: FastifyReply) {
  const { id } = request.params
  const { page = 1, pageSize = 20 } = request.query

  // 验证用户存在
  const userExists = await findUserById(id)
  if (!userExists) {
    return reply.status(404).send(error(ErrorCodes.USER_NOT_FOUND))
  }

  const result = await getUserPosts(id, page, Math.min(pageSize, 100))

  return reply.send(success(result))
}

// 获取用户收藏列表
export async function getUserFavoriteList(request: FastifyRequest<{ Params: { id: string }; Querystring: { page?: number; pageSize?: number } }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params
  const { page = 1, pageSize = 20 } = request.query

  // 只能查看自己的收藏
  if (id !== user.userId) {
    return reply.status(403).send(error(ErrorCodes.NO_PERMISSION))
  }

  const result = await getUserFavorites(id, page, Math.min(pageSize, 100))

  return reply.send(success(result))
}