import prisma from '../../lib/prisma'

// 获取所有版块列表
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { posts: { where: { status: 'NORMAL' } } },
      },
    },
  })
}

// 根据slug获取版块详情
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: { where: { status: 'NORMAL' } } },
      },
    },
  })
}

// 根据ID获取版块详情
export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  })
}