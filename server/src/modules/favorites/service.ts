import prisma from '../../lib/prisma'

// 收藏帖子
export async function favoritePost(userId: string, postId: string) {
  return prisma.favorite.create({
    data: {
      userId,
      postId,
    },
  })
}

// 取消收藏帖子
export async function unfavoritePost(userId: string, postId: string) {
  return prisma.favorite.delete({
    where: { userId_postId: { userId, postId } },
  })
}

// 检查是否已收藏
export async function hasFavorited(userId: string, postId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_postId: { userId, postId } },
  })
  return !!favorite
}