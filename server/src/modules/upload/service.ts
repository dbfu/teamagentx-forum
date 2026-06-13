import fs from 'fs'
import path from 'path'

// 支持的图片格式
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

// 最大文件大小（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024

// 上传目录
const UPLOAD_DIR = 'uploads'

// 确保上传目录存在
export function ensureUploadDir() {
  const uploadPath = path.join(process.cwd(), UPLOAD_DIR)
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
  }
  return uploadPath
}

// 验证文件扩展名
export function isValidExtension(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop() || ''
  return ALLOWED_EXTENSIONS.includes(ext)
}

// 验证文件大小
export function isValidSize(size: number): boolean {
  return size <= MAX_FILE_SIZE
}

// 生成唯一文件名
export function generateFilename(originalName: string): string {
  const ext = originalName.toLowerCase().split('.').pop() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}.${ext}`
}

// 保存文件
export function saveFile(buffer: Buffer, filename: string): string {
  const uploadPath = ensureUploadDir()
  const filePath = path.join(uploadPath, filename)
  fs.writeFileSync(filePath, buffer)
  return `/uploads/${filename}`
}

// 删除文件
export function deleteFile(filepath: string): boolean {
  try {
    const fullPath = path.join(process.cwd(), filepath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      return true
    }
    return false
  } catch {
    return false
  }
}