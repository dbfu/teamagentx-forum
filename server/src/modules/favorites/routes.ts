import { FastifyInstance } from 'fastify'
import { favoritePostController, unfavoritePostController } from './controller'
import { authMiddleware } from '../../shared/middleware'

export async function favoriteRoutes(fastify: FastifyInstance) {
  // 收藏帖子（需要认证）
  fastify.post('/posts/:id/favorite', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, favoritePostController)

  // 取消收藏帖子（需要认证）
  fastify.delete('/posts/:id/favorite', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, unfavoritePostController)
}