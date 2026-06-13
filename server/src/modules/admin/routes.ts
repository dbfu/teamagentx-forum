import { FastifyInstance } from 'fastify'
import { adminReportRoutes } from '../reports/routes'

export async function adminRoutes(fastify: FastifyInstance) {
  // 注册管理员举报路由
  await fastify.register(adminReportRoutes)
}