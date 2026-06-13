import { FastifyRequest, FastifyReply } from 'fastify'
import { success, error, isValidEmail, isValidPassword, isValidNickname } from '../../shared/utils'
import { ErrorCodes } from '../../shared/errors'
import { createUser, findUserByEmail, findUserById, verifyPassword, getUserBasic, generateJwtPayload, updateUserEmailVerified, updatePassword } from './service'
import { JwtPayload } from '../../shared/types'

interface RegisterBody {
  email: string
  password: string
  nickname?: string
}

interface LoginBody {
  email: string
  password: string
}

interface VerifyEmailBody {
  token: string
}

interface ChangePasswordBody {
  oldPassword: string
  newPassword: string
}

interface ForgotPasswordBody {
  email: string
}

interface ResetPasswordBody {
  token: string
  newPassword: string
}

// 用户注册
export async function register(request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
  const { email, password, nickname } = request.body

  // 验证邮箱格式
  if (!isValidEmail(email)) {
    return reply.status(400).send(error(ErrorCodes.EMAIL_FORMAT_ERROR))
  }

  // 验证密码长度
  if (!isValidPassword(password)) {
    return reply.status(400).send(error(ErrorCodes.PASSWORD_LENGTH_ERROR))
  }

  // 验证昵称（可选）
  if (nickname && !isValidNickname(nickname)) {
    return reply.status(400).send(error(ErrorCodes.PASSWORD_LENGTH_ERROR))
  }

  // 检查邮箱是否已注册
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    return reply.status(400).send(error(ErrorCodes.EMAIL_ALREADY_REGISTERED))
  }

  // 创建用户
  const user = await createUser(email, password, nickname)

  return reply.status(201).send(success({ userId: user.id }, '注册成功'))
}

// 邮箱验证
export async function verifyEmailHandler(request: FastifyRequest<{ Body: VerifyEmailBody }>, reply: FastifyReply) {
  const { token } = request.body

  try {
    const decoded = request.server.jwt.verify<{ userId: string }>(token)

    const user = await findUserById(decoded.userId)
    if (!user) {
      return reply.status(400).send(error(ErrorCodes.VERIFY_TOKEN_INVALID))
    }

    // 更新验证状态
    await updateUserEmailVerified(user.id)

    // 生成登录token
    const accessToken = request.server.jwt.sign(generateJwtPayload(user), { expiresIn: '7d' })

    return reply.send(success({
      accessToken,
      user: getUserBasic(user),
    }, '邮箱验证成功'))
  } catch (err) {
    return reply.status(400).send(error(ErrorCodes.VERIFY_TOKEN_INVALID))
  }
}

// 用户登录
export async function login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
  const { email, password } = request.body

  // 查找用户
  const user = await findUserByEmail(email)
  if (!user) {
    return reply.status(400).send(error(ErrorCodes.EMAIL_NOT_REGISTERED))
  }

  // 验证密码
  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) {
    return reply.status(400).send(error(ErrorCodes.PASSWORD_ERROR))
  }

  // 生成 JWT Token
  const accessToken = request.server.jwt.sign(generateJwtPayload(user), { expiresIn: '7d' })

  return reply.send(success({
    accessToken,
    user: getUserBasic(user),
  }, '登录成功'))
}

// 获取当前用户
export async function getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as JwtPayload | undefined
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const fullUser = await findUserById(user.userId)
  if (!fullUser) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  return reply.send(success({
    id: fullUser.id,
    email: fullUser.email,
    nickname: fullUser.nickname,
    avatar: fullUser.avatar,
    role: fullUser.role as 'USER' | 'ADMIN',
    emailVerified: fullUser.emailVerified,
    createdAt: fullUser.createdAt.toISOString(),
  }))
}

// 修改密码
export async function changePassword(request: FastifyRequest<{ Body: ChangePasswordBody }>, reply: FastifyReply) {
  const user = request.user as JwtPayload | undefined
  if (!user) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const { oldPassword, newPassword } = request.body

  // 验证新密码格式
  if (!isValidPassword(newPassword)) {
    return reply.status(400).send(error(ErrorCodes.NEW_PASSWORD_FORMAT_ERROR))
  }

  // 查找用户并验证旧密码
  const fullUser = await findUserById(user.userId)
  if (!fullUser) {
    return reply.status(401).send(error(ErrorCodes.TOKEN_INVALID))
  }

  const isOldPasswordValid = await verifyPassword(oldPassword, fullUser.password)
  if (!isOldPasswordValid) {
    return reply.status(400).send(error(ErrorCodes.OLD_PASSWORD_ERROR))
  }

  // 更新密码
  await updatePassword(fullUser.id, newPassword)

  return reply.send(success(null, '密码修改成功'))
}

// 申请重置密码
export async function forgotPassword(request: FastifyRequest<{ Body: ForgotPasswordBody }>, reply: FastifyReply) {
  const { email } = request.body

  const user = await findUserByEmail(email)
  if (!user) {
    // 不暴露用户是否存在的信息
    return reply.send(success(null, '重置密码邮件已发送'))
  }

  // 生成重置token（实际应发送邮件）
  const token = request.server.jwt.sign({ userId: user.id }, { expiresIn: '1h' })

  return reply.send(success(null, '重置密码邮件已发送'))
}

// 重置密码
export async function resetPassword(request: FastifyRequest<{ Body: ResetPasswordBody }>, reply: FastifyReply) {
  const { token, newPassword } = request.body

  // 验证新密码格式
  if (!isValidPassword(newPassword)) {
    return reply.status(400).send(error(ErrorCodes.NEW_PASSWORD_FORMAT_ERROR))
  }

  try {
    const decoded = request.server.jwt.verify<{ userId: string }>(token)

    const user = await findUserById(decoded.userId)
    if (!user) {
      return reply.status(400).send(error(ErrorCodes.VERIFY_TOKEN_INVALID))
    }

    // 更新密码
    await updatePassword(user.id, newPassword)

    return reply.send(success(null, '密码重置成功'))
  } catch (err) {
    return reply.status(400).send(error(ErrorCodes.VERIFY_TOKEN_EXPIRED))
  }
}