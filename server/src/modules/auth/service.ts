import prisma from '../../lib/prisma'
import { User, Role } from '@prisma/client'
import { UserBasic, JwtPayload } from '../../shared/types'
import { ErrorCodes } from '../../shared/errors'
import bcrypt from 'bcrypt'

// 获取用户基础信息
export function getUserBasic(user: User): UserBasic {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role as 'USER' | 'ADMIN',
  }
}

// 创建用户
export async function createUser(email: string, password: string, nickname?: string) {
  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nickname: nickname || null,
      role: Role.USER,
      emailVerified: false,
    },
  })
}

// 根据邮箱查找用户
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

// 根据ID查找用户
export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  })
}

// 验证密码
export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

// 更新邮箱验证状态
export async function updateUserEmailVerified(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  })
}

// 更新用户密码
export async function updatePassword(userId: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })
}

// 更新用户信息
export async function updateUserProfile(userId: string, data: { nickname?: string; avatar?: string }) {
  return prisma.user.update({
    where: { id: userId },
    data,
  })
}

// 生成 JWT Payload
export function generateJwtPayload(user: User): JwtPayload {
  return {
    userId: user.id,
    email: user.email,
    role: user.role as 'USER' | 'ADMIN',
  }
}