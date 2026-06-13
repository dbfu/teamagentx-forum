import prisma from '../../lib/prisma'
import { PostStatus } from '@prisma/client'

// 创建帖子
export async function createPost(title: string, content: string, authorId: string, categoryId: string) {
  return prisma.post.create({
    data: {
      title,
      content,
      authorId,
      categoryId,
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
  })
}

// 更新帖子
export async function updatePost(postId: string, data: { title?: string; content?: string; categoryId?: string }) {
  return prisma.post.update({
    where: { id: postId },
    data,
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
  })
}

// 删除帖子（软删除）
export async function deletePost(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { status: PostStatus.DELETED },
  })
}

// 获取帖子详情
export async function getPostById(postId: string) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
          role: true,
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
  })
}

// 获取帖子列表（支持分页、筛选）
export async function getPosts(query: {
  page: number
  pageSize: number
  category?: string
  author?: string
  keyword?: string
  sort?: 'latest' | 'hot'
}) {
  const { page, pageSize, category, author, keyword, sort } = query
  const skip = (page - 1) * pageSize

  const where: any = {
    status: PostStatus.NORMAL,
  }

  if (category) where.categoryId = category
  if (author) where.authorId = author
  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { content: { contains: keyword } },
    ]
  }

  const orderBy: any = sort === 'hot'
    ? [{ viewCount: 'desc' }, { likeCount: 'desc' }]
    : { createdAt: 'desc' }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
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
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where }),
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
      updatedAt: post.updatedAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// 增加浏览量
export async function incrementViewCount(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  })
}

// 检查用户是否点赞/收藏帖子
export async function checkPostInteraction(postId: string, userId: string) {
  const like = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  const favorite = await prisma.favorite.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  return {
    isLiked: !!like,
    isFavorited: !!favorite,
  }
}