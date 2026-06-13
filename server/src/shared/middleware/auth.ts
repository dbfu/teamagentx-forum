import { FastifyRequest } from 'fastify'
import { ErrorCodes } from '../errors'
import { error } from '../utils/response'
import { JwtPayload } from '../types'

// 认证中间件 - 验证JWT并提取用户信息
export async function authMiddleware(request: FastifyRequest) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(ErrorCodes.TOKEN_INVALID)
    }

    const token = authHeader.slice(7)
    const decoded = await request.server.jwt.verify<JwtPayload>(token)

    // 将用户信息附加到 request 上（使用 any 类型绕过 TypeScript 检查）
    request.user = decoded as any

    return null // 返回 null 表示验证通过
  } catch (err) {
    return error(ErrorCodes.TOKEN_INVALID)
  }
}

// 管理员权限中间件
export async function adminMiddleware(request: FastifyRequest) {
  const authResult = await authMiddleware(request)
  if (authResult) {
    return authResult
  }

  const user = request.user as JwtPayload | undefined
  if (!user || user.role !== 'ADMIN') {
    return error(ErrorCodes.NO_PERMISSION)
  }

  return null
}