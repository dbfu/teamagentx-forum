import 'fastify'
import { JwtPayload } from './types'

// 扩展 FastifyRequest 类型
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}