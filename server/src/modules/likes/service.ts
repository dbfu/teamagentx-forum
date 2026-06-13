import prisma from '../../lib/prisma'

// 点赞帖子
export async function likePost(userId: string, postId: string) {
  // 创建点赞并更新帖子点赞数
  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: {
        userId,
        postId,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    }),
  ])

  // 返回更新后的点赞数
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { likeCount: true },
  })

  return post?.likeCount || 0
}

// 取消点赞帖子
export async function unlikePost(userId: string, postId: string) {
  // 删除点赞并更新帖子点赞数
  await prisma.$transaction([
    prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } },
    }),
  ])

  // 返回更新后的点赞数
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { likeCount: true },
  })

  return post?.likeCount || 0
}

// 点赞评论
export async function likeComment(userId: string, commentId: string) {
  // 创建点赞并更新评论点赞数
  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: {
        userId,
        commentId,
      },
    }),
    prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    }),
  ])

  // 返回更新后的点赞数
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { likeCount: true },
  })

  return comment?.likeCount || 0
}

// 取消点赞评论
export async function unlikeComment(userId: string, commentId: string) {
  // 删除点赞并更新评论点赞数
  await prisma.$transaction([
    prisma.like.delete({
      where: { userId_commentId: { userId, commentId } },
    }),
    prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { decrement: 1 } },
    }),
  ])

  // 返回更新后的点赞数
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { likeCount: true },
  })

  return comment?.likeCount || 0
}

// 检查是否已点赞帖子
export async function hasLikedPost(userId: string, postId: string) {
  const like = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  })
  return !!like
}

// 检查是否已点赞评论
export async function hasLikedComment(userId: string, commentId: string) {
  const like = await prisma.like.findUnique({
    where: { userId_commentId: { userId, commentId } },
  })
  return !!like
}