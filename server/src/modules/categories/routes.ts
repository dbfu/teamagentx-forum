import { FastifyInstance } from 'fastify'
import { listCategories, getCategoryDetail } from './controller'

export async function categoryRoutes(fastify: FastifyInstance) {
  // 获取版块列表
  fastify.get('/categories', listCategories)

  // 获取版块详情（通过slug）
  fastify.get('/categories/:slug', getCategoryDetail)
}