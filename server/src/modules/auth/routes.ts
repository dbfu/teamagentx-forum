import { FastifyInstance } from 'fastify'
import { register, login, verifyEmailHandler, getCurrentUser, changePassword, forgotPassword, resetPassword } from './controller'
import { authMiddleware } from '../../shared/middleware'

export async function authRoutes(fastify: FastifyInstance) {
  // 用户注册
  fastify.post('/auth/register', register)

  // 邮箱验证
  fastify.post('/auth/verify-email', verifyEmailHandler)

  // 用户登录
  fastify.post('/auth/login', login)

  // 获取当前用户（需要认证）
  fastify.get('/auth/me', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, getCurrentUser)

  // 修改密码（需要认证）
  fastify.put('/auth/password', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, changePassword)

  // 申请重置密码
  fastify.post('/auth/forgot-password', forgotPassword)

  // 重置密码
  fastify.post('/auth/reset-password', resetPassword)
}