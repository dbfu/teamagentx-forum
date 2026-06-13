import { FastifyInstance } from 'fastify'
import { getUserInfo, updateProfile, getUserPostList, getUserFavoriteList } from './controller'
import { authMiddleware } from '../../shared/middleware'

export async function userRoutes(fastify: FastifyInstance) {
  // 获取用户信息（公开）
  fastify.get('/users/:id', getUserInfo)

  // 更新用户信息（需要认证）
  fastify.put('/users/profile', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, updateProfile)

  // 获取用户帖子列表（公开）
  fastify.get('/users/:id/posts', getUserPostList)

  // 获取用户收藏列表（需要认证，只能查看自己的）
  fastify.get('/users/:id/favorites', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, getUserFavoriteList)
}