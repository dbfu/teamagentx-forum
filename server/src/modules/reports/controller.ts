import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { reportPost, reportComment, hasReportedPost, hasReportedComment, getReports, handleReport } from './service'
import { getPostById } from '../posts/service'
import { getCommentById } from '../comments/service'
import { ReportReason, ReportStatus, PostStatus, CommentStatus } from '@prisma/client'
import { JwtPayload } from '../../shared/types'

interface ReportBody {
  reason: 'SPAM' | 'ATTACK' | 'PLAGIARISM' | 'OTHER'
  description?: string
}

interface ReportQuery {
  page?: number
  pageSize?: number
  status?: 'PENDING' | 'RESOLVED' | 'REJECTED'
}

interface HandleReportBody {
  status: 'RESOLVED' | 'REJECTED'
}

// 举报帖子
export async function reportPostController(request: FastifyRequest<{ Params: { id: string }; Body: ReportBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params
  const { reason, description } = request.body

  // 验证帖子存在
  const post = await getPostById(id)
  if (!post) {
    return reply.status(404).send(error(ErrorCodes.REPORT_POST_NOT_FOUND))
  }

  if (post.status === PostStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.POST_DELETED))
  }

  // 检查是否已举报
  const alreadyReported = await hasReportedPost(user.userId, id)
  if (alreadyReported) {
    return reply.status(400).send(error(ErrorCodes.ALREADY_REPORTED_POST))
  }

  // 举报
  await reportPost(user.userId, id, reason as ReportReason, description)

  return reply.send(success(null, '举报成功，我们会尽快处理'))
}

// 举报评论
export async function reportCommentController(request: FastifyRequest<{ Params: { id: string }; Body: ReportBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { id } = request.params
  const { reason, description } = request.body

  // 验证评论存在
  const comment = await getCommentById(id)
  if (!comment) {
    return reply.status(404).send(error(ErrorCodes.REPORT_COMMENT_NOT_FOUND))
  }

  if (comment.status === CommentStatus.DELETED) {
    return reply.status(400).send(error(ErrorCodes.COMMENT_DELETED))
  }

  // 检查是否已举报
  const alreadyReported = await hasReportedComment(user.userId, id)
  if (alreadyReported) {
    return reply.status(400).send(error(ErrorCodes.ALREADY_REPORTED_COMMENT))
  }

  // 举报
  await reportComment(user.userId, id, reason as ReportReason, description)

  return reply.send(success(null, '举报成功，我们会尽快处理'))
}

// 获取举报列表（管理员）
export async function getReportsController(request: FastifyRequest<{ Querystring: ReportQuery }>, reply: FastifyReply) {
  const { page = 1, pageSize = 20, status } = request.query

  const result = await getReports({
    page,
    pageSize: Math.min(pageSize, 100),
    status: status as ReportStatus,
  })

  return reply.send(success(result))
}

// 处理举报（管理员）
export async function handleReportController(request: FastifyRequest<{ Params: { id: string }; Body: HandleReportBody }>, reply: FastifyReply) {
  const { id } = request.params
  const { status } = request.body

  await handleReport(id, status as ReportStatus)

  return reply.send(success(null, '处理成功'))
}