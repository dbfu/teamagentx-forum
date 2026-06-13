import { FastifyInstance } from 'fastify'
import { createPostController, updatePostController, deletePostController, getPostDetailController, getPostsController } from './controller'
import { getTopPostsController, getHotPostsController, getEssencePostsController, setPostTopController, setPostEssenceController, movePostController } from './special-controller'
import { authMiddleware, adminMiddleware } from '../../shared/middleware'

export async function postRoutes(fastify: FastifyInstance) {
  // 获取帖子列表（公开）
  fastify.get('/posts', getPostsController)

  // 获取置顶帖子（公开）
  fastify.get('/posts/top', getTopPostsController)

  // 获取热门帖子（公开）
  fastify.get('/posts/hot', getHotPostsController)

  // 获取精华帖子（公开）
  fastify.get('/posts/essence', getEssencePostsController)

  // 获取帖子详情（公开）
  fastify.get('/posts/:id', {
    preHandler: [async (request, reply) => {
      // 可选认证，不强制要求
      const authHeader = request.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.slice(7)
          const decoded = await request.server.jwt.verify(request.server.jwt.decode(token) as any)
          request.user = decoded
        } catch {
          // token 无效时忽略，继续公开访问
        }
      }
    }],
  }, getPostDetailController)

  // 创建帖子（需要认证）
  fastify.post('/posts', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, createPostController)

  // 更新帖子（需要认证）
  fastify.put('/posts/:id', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, updatePostController)

  // 删除帖子（需要认证）
  fastify.delete('/posts/:id', {
    preHandler: [async (request, reply) => {
      const result = await authMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, deletePostController)

  // 置顶帖子（管理员）
  fastify.put('/posts/:id/top', {
    preHandler: [async (request, reply) => {
      const result = await adminMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, setPostTopController)

  // 加精帖子（管理员）
  fastify.put('/posts/:id/essence', {
    preHandler: [async (request, reply) => {
      const result = await adminMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, setPostEssenceController)

  // 移动帖子（管理员）
  fastify.put('/posts/:id/move', {
    preHandler: [async (request, reply) => {
      const result = await adminMiddleware(request)
      if (result) return reply.send(result)
    }],
  }, movePostController)
}