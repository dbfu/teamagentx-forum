import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { isValidExtension, isValidSize, generateFilename, saveFile } from './service'
import { JwtPayload } from '../../shared/types'

// 上传图片
export async function uploadImageController(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  try {
    // 获取上传的文件
    const file = await request.file()
    if (!file) {
      return reply.status(400).send(error(ErrorCodes.FILE_FORMAT_ERROR))
    }

    // 验证文件扩展名
    if (!isValidExtension(file.filename)) {
      return reply.status(400).send(error(ErrorCodes.FILE_FORMAT_ERROR))
    }

    // 读取文件内容
    const buffer = await file.toBuffer()

    // 验证文件大小
    if (!isValidSize(buffer.length)) {
      return reply.status(400).send(error(ErrorCodes.FILE_SIZE_ERROR))
    }

    // 生成唯一文件名并保存
    const filename = generateFilename(file.filename)
    const url = saveFile(buffer, filename)

    return reply.send(success({ url }, '上传成功'))
  } catch (err) {
    request.log.error(err)
    return reply.status(500).send(error(ErrorCodes.UPLOAD_ERROR))
  }
}