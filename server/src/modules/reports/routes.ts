import { FastifyInstance } from 'fastify'
import { reportPostController, reportCommentController, getReportsController, handleReportController } from './controller'
import { authMiddleware, adminMiddleware } from '../../shared/middleware'

export async function reportRoutes(fastify: FastifyInstance) {
  // 举报帖子（需要认证）
  fastify.post('/posts/:id/report', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, reportPostController)

  // 举报评论（需要认证）
  fastify.post('/comments/:id/report', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, reportCommentController)
}

export async function adminReportRoutes(fastify: FastifyInstance) {
  // 获取举报列表（管理员）
  fastify.get('/admin/reports', {
    preHandler: [async (request, reply) => {
      const result = await adminMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, getReportsController)

  // 处理举报（管理员）
  fastify.put('/admin/reports/:id', {
    preHandler: [async (request, reply) => {
      const result = await adminMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, handleReportController)
}