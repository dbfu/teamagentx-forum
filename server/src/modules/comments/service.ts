import prisma from '../../lib/prisma'
import { PostStatus, CommentStatus } from '@prisma/client'

// 创建评论
export async function createComment(content: string, authorId: string, postId: string, parentId?: string) {
  // 创建评论并更新帖子评论数
  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
        parentId: parentId || null,
        status: CommentStatus.NORMAL,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    }),
  ])

  return comment
}

// 删除评论（软删除）
export async function deleteComment(commentId: string, postId: string) {
  // 删除评论并更新帖子评论数
  await prisma.$transaction([
    prisma.comment.update({
      where: { id: commentId },
      data: { status: CommentStatus.DELETED },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentCount: { decrement: 1 } },
    }),
  ])
}

// 获取评论详情
export async function getCommentById(commentId: string) {
  return prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      post: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  })
}

// 获取评论列表（带楼中楼）
export async function getCommentsByPostId(postId: string, page: number, pageSize: number, userId?: string) {
  const skip = (page - 1) * pageSize

  // 获取一级评论
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
        status: CommentStatus.NORMAL,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        replies: {
          where: { status: CommentStatus.NORMAL },
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
            replies: {
              where: { status: CommentStatus.NORMAL },
              include: {
                author: {
                  select: {
                    id: true,
                    nickname: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.comment.count({
      where: {
        postId,
        parentId: null,
        status: CommentStatus.NORMAL,
      },
    }),
  ])

  // 检查点赞状态
  const checkLikes = async (commentIds: string[]) => {
    if (!userId) return new Map()
    const likes = await prisma.like.findMany({
      where: {
        userId,
        commentId: { in: commentIds },
      },
    })
    return new Map(likes.map((l) => [l.commentId, true]))
  }

  // 收集所有评论ID
  const allCommentIds = comments.flatMap((c) => [
    c.id,
    ...c.replies.flatMap((r) => [
      r.id,
      ...r.replies.map((rr) => rr.id),
    ]),
  ])

  const likeMap = await checkLikes(allCommentIds)

  // 构建带点赞状态的评论树
  const buildCommentTree = (comment: any): any => {
    return {
      id: comment.id,
      content: comment.content,
      author: comment.author,
      parentId: comment.parentId,
      likeCount: comment.likeCount,
      isLiked: likeMap.get(comment.id) || false,
      replies: comment.replies?.map(buildCommentTree) || [],
      createdAt: comment.createdAt.toISOString(),
    }
  }

  return {
    list: comments.map(buildCommentTree),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// 检查评论嵌套层级
export async function getCommentDepth(commentId: string): Promise<number> {
  let depth = 0
  let currentComment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { parentId: true },
  })

  while (currentComment?.parentId && depth < 10) {
    depth++
    currentComment = await prisma.comment.findUnique({
      where: { id: currentComment.parentId },
      select: { parentId: true },
    })
  }

  return depth
}