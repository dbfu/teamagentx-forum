import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'

import { healthRoutes } from './modules/health/routes'

async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    },
  })

  // 注册插件
  await fastify.register(helmet)
  await fastify.register(cors, {
    origin: ['http://localhost:5173'],
    credentials: true,
  })
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret',
  })
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
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

  return fastify
}

export default buildApp