import { FastifyInstance } from 'fastify'
import { likePostController, unlikePostController, likeCommentController, unlikeCommentController } from './controller'
import { authMiddleware } from '../../shared/middleware'

export async function likeRoutes(fastify: FastifyInstance) {
  // 点赞帖子（需要认证）
  fastify.post('/posts/:id/like', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, likePostController)

  // 取消点赞帖子（需要认证）
  fastify.delete('/posts/:id/like', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, unlikePostController)

  // 点赞评论（需要认证）
  fastify.post('/comments/:id/like', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, likeCommentController)

  // 取消点赞评论（需要认证）
  fastify.delete('/comments/:id/like', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, unlikeCommentController)
}