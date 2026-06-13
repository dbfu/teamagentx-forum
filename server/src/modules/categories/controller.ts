import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { getCategories, getCategoryBySlug } from './service'

// 获取版块列表
export async function listCategories(request: FastifyRequest, reply: FastifyReply) {
  const categories = await getCategories()

  const result = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    order: category.order,
    postCount: category._count.posts,
  }))

  return reply.send(success(result))
}

// 获取版块详情
export async function getCategoryDetail(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
  const { slug } = request.params

  const category = await getCategoryBySlug(slug)
  if (!category) {
    return reply.status(404).send(error(ErrorCodes.CATEGORY_NOT_FOUND))
  }

  return reply.send(success({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    order: category.order,
    postCount: category._count.posts,
  }))
}