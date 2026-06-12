import type { FastifyPluginAsync } from 'fastify'

// API 响应格式
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 错误码定义
export const ErrorCode = {
  SUCCESS: 0,
  PARAM_ERROR: 1001,
  AUTH_FAILED: 1002,
  PERMISSION_DENIED: 1003,
} as const

// 成功响应
export function success<T>(data: T, message = 'success'): ApiResponse<T> {
  return { code: ErrorCode.SUCCESS, data, message }
}

// 错误响应
export function error(
  code: number,
  message: string,
): ApiResponse<null> {
  return { code, data: null, message }
}

// 健康检查路由
export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => {
    return success({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  fastify.get('/ready', async () => {
    // 可以在这里添加数据库连接检查等
    return success({
      status: 'ready',
      timestamp: new Date().toISOString(),
    })
  })
}