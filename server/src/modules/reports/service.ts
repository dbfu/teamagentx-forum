import prisma from '../../lib/prisma'
import { ReportReason, ReportStatus } from '@prisma/client'

// 举报帖子
export async function reportPost(userId: string, postId: string, reason: ReportReason, description?: string) {
  return prisma.report.create({
    data: {
      userId,
      postId,
      reason,
      description: description || null,
      status: ReportStatus.PENDING,
    },
  })
}

// 举报评论
export async function reportComment(userId: string, commentId: string, reason: ReportReason, description?: string) {
  return prisma.report.create({
    data: {
      userId,
      commentId,
      reason,
      description: description || null,
      status: ReportStatus.PENDING,
    },
  })
}

// 检查是否已举报帖子
export async function hasReportedPost(userId: string, postId: string) {
  const report = await prisma.report.findUnique({
    where: { userId_postId: { userId, postId } },
  })
  return !!report
}

// 检查是否已举报评论
export async function hasReportedComment(userId: string, commentId: string) {
  const report = await prisma.report.findUnique({
    where: { userId_commentId: { userId, commentId } },
  })
  return !!report
}

// 获取举报列表（管理员）
export async function getReports(query: {
  page: number
  pageSize: number
  status?: ReportStatus
}) {
  const { page, pageSize, status } = query
  const skip = (page - 1) * pageSize

  const where: any = {}
  if (status) where.status = status

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.report.count({ where }),
  ])

  return {
    list: reports.map((report) => ({
      id: report.id,
      user: report.user,
      post: report.post,
      comment: report.comment,
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: report.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// 处理举报（管理员）
export async function handleReport(reportId: string, status: ReportStatus) {
  return prisma.report.update({
    where: { id: reportId },
    data: { status },
  })
}