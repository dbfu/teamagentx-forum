// API 响应格式
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// API 错误码
export const ErrorCode = {
  SUCCESS: 0,
  PARAM_ERROR: 1001,
  AUTH_FAILED: 1002,
  PERMISSION_DENIED: 1003,
} as const

// 基础 API 请求函数
const BASE_URL = '/api'

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  return response.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(path: string, data: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
}