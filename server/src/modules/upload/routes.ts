import { FastifyInstance } from 'fastify'
import { uploadImageController } from './controller'
import { authMiddleware } from '../../shared/middleware'
import { ensureUploadDir } from './service'

export async function uploadRoutes(fastify: FastifyInstance) {
  // 确保上传目录存在
  ensureUploadDir()

  // 上传图片（需要认证）
  fastify.post('/upload/image', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, uploadImageController)
}