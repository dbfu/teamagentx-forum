// 用户角色
export type UserRole = 'USER' | 'ADMIN'

// 用户基础信息
export interface UserBasic {
  id: string
  email: string
  nickname: string | null
  avatar: string | null
  role: UserRole
}

// 用户详细信息
export interface UserDetail extends UserBasic {
  emailVerified: boolean
  createdAt: string
}

// 帖子基础信息
export interface PostBasic {
  id: string
  title: string
  author: {
    id: string
    nickname: string | null
    avatar: string | null
  }
  category: {
    id: string
    name: string
    slug: string
  }
  isTop: boolean
  isEssence: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
}

// 帖子详情
export interface PostDetail extends PostBasic {
  content: string
  updatedAt: string
  isLiked?: boolean
  isFavorited?: boolean
}

// 评论信息
export interface CommentInfo {
  id: string
  content: string
  author: {
    id: string
    nickname: string | null
    avatar: string | null
  }
  parentId: string | null
  likeCount: number
  isLiked?: boolean
  replies?: CommentInfo[]
  createdAt: string
}

// 版块信息
export interface CategoryInfo {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  postCount: number
}

// 分页参数
export interface PaginationQuery {
  page?: number
  pageSize?: number
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// API 响应格式
export interface ApiResponse<T = null> {
  code: number
  message: string
  data: T
}

// JWT Payload
export interface JwtPayload {
  userId: string
  email: string
  role: UserRole
}