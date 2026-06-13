import prisma from '../../lib/prisma'
import { PostStatus } from '@prisma/client'

// 获取用户信息（包含发帖数量）
export async function getUserWithPostCount(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: { posts: { where: { status: PostStatus.NORMAL } } },
      },
    },
  })

  if (!user) return null

  return {
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role,
    postCount: user._count.posts,
    createdAt: user.createdAt.toISOString(),
  }
}

// 获取用户的帖子列表
export async function getUserPosts(userId: string, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        authorId: userId,
        status: PostStatus.NORMAL,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        status: PostStatus.NORMAL,
      },
    }),
  ])

  return {
    list: posts.map((post) => ({
      id: post.id,
      title: post.title,
      author: post.author,
      category: post.category,
      isTop: post.isTop,
      isEssence: post.isEssence,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// 获取用户的收藏列表
export async function getUserFavorites(userId: string, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize

  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.favorite.count({
      where: { userId },
    }),
  ])

  return {
    list: favorites.map((fav) => ({
      id: fav.post.id,
      title: fav.post.title,
      author: fav.post.author,
      category: fav.post.category,
      isTop: fav.post.isTop,
      isEssence: fav.post.isEssence,
      viewCount: fav.post.viewCount,
      likeCount: fav.post.likeCount,
      commentCount: fav.post.commentCount,
      createdAt: fav.post.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}