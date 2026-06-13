import prisma from '../../lib/prisma'
import { PostStatus } from '@prisma/client'

// 获取置顶帖子
export async function getTopPosts(category?: string) {
  const where: any = {
    status: PostStatus.NORMAL,
    isTop: true,
  }

  if (category) where.categoryId = category

  return prisma.post.findMany({
    where,
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
  })
}

// 获取热门帖子
export async function getHotPosts(limit: number) {
  // 计算热度 = viewCount * 1 + likeCount * 5 + commentCount * 10
  const posts = await prisma.post.findMany({
    where: {
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
    orderBy: [
      { viewCount: 'desc' },
      { likeCount: 'desc' },
      { commentCount: 'desc' },
    ],
    take: limit,
  })

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    category: post.category,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    heat: post.viewCount + post.likeCount * 5 + post.commentCount * 10,
    createdAt: post.createdAt.toISOString(),
  }))
}

// 获取精华帖子
export async function getEssencePosts(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: PostStatus.NORMAL,
        isEssence: true,
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
        status: PostStatus.NORMAL,
        isEssence: true,
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

// 置顶帖子（管理员）
export async function setPostTop(postId: string, isTop: boolean) {
  return prisma.post.update({
    where: { id: postId },
    data: { isTop },
  })
}

// 加精帖子（管理员）
export async function setPostEssence(postId: string, isEssence: boolean) {
  return prisma.post.update({
    where: { id: postId },
    data: { isEssence },
  })
}

// 移动帖子到其他版块（管理员）
export async function movePost(postId: string, categoryId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { categoryId },
  })
}

// 检查版块置顶数量
export async function countTopPostsInCategory(categoryId: string) {
  return prisma.post.count({
    where: {
      categoryId,
      isTop: true,
      status: PostStatus.NORMAL,
    },
  })
}