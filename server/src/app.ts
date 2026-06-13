import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import { fastifyStatic } from '@fastify/static'
import path from 'path'

import { healthRoutes } from './modules/health/routes'
import { authRoutes } from './modules/auth/routes'
import { categoryRoutes } from './modules/categories/routes'
import { userRoutes } from './modules/users/routes'
import { postRoutes } from './modules/posts/routes'
import { commentRoutes } from './modules/comments/routes'
import { likeRoutes } from './modules/likes/routes'
import { favoriteRoutes } from './modules/favorites/routes'
import { reportRoutes } from './modules/reports/routes'
import { adminRoutes } from './modules/admin/routes'
import { uploadRoutes } from './modules/upload/routes'

async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    },
  })

  // 注册插件
  await fastify.register(helmet)
  await fastify.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret',
  })
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
  await fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  })

  // 静态文件服务（用于上传的图片）
  await fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  })

  // 响应格式统一
  fastify.addHook('onSend', async (request, reply, payload) => {
    // 仅处理 API 路由
    if (!request.url.startsWith('/api')) {
      return payload
    }

    // 如果 payload 已经是标准格式，直接返回
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload)
        if (parsed.code !== undefined) {
          return payload
        }
      } catch {
        return payload
      }
    }

    return payload
  })

  // 注册路由
  await fastify.register(healthRoutes, { prefix: '/api' })
  await fastify.register(authRoutes, { prefix: '/api' })
  await fastify.register(categoryRoutes, { prefix: '/api' })
  await fastify.register(userRoutes, { prefix: '/api' })
  await fastify.register(postRoutes, { prefix: '/api' })
  await fastify.register(commentRoutes, { prefix: '/api' })
  await fastify.register(likeRoutes, { prefix: '/api' })
  await fastify.register(favoriteRoutes, { prefix: '/api' })
  await fastify.register(reportRoutes, { prefix: '/api' })
  await fastify.register(adminRoutes, { prefix: '/api' })
  await fastify.register(uploadRoutes, { prefix: '/api' })

  return fastify
}

export default buildApp