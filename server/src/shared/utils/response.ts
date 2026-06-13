import { ApiResponse } from '../types'
import { ErrorCodes, ErrorMessages } from '../errors'

// 成功响应
export function success<T>(data: T, message: string = 'success'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  }
}

// 错误响应
export function error(code: number, message?: string): ApiResponse<null> {
  return {
    code,
    message: message || ErrorMessages[code] || '未知错误',
    data: null,
  }
}

// 系统错误响应
export function systemError(message?: string): ApiResponse<null> {
  return error(ErrorCodes.SYSTEM_ERROR, message)
}