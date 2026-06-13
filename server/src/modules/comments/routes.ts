import { FastifyInstance } from 'fastify'
import { createCommentController, deleteCommentController, getCommentsController } from './controller'
import { authMiddleware } from '../../shared/middleware'

export async function commentRoutes(fastify: FastifyInstance) {
  // 获取评论列表（可选认证）
  fastify.get('/posts/:postId/comments', {
    preHandler: [async (request, reply) => {
      // 可选认证
      const authHeader = request.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.slice(7)
          const decoded = await request.server.jwt.verify(request.server.jwt.decode(token) as any)
          request.user = decoded
        } catch {
          // token 无效时忽略
        }
      }
    }],
  }, getCommentsController)

  // 创建评论（需要认证）
  fastify.post('/posts/:postId/comments', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, createCommentController)

  // 删除评论（需要认证）
  fastify.delete('/comments/:id', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, deleteCommentController)
}