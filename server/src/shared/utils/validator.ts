// 参数验证工具

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证密码长度（6-20字符）
export function isValidPassword(password: string): boolean {
  return password.length >= 6 && password.length <= 20
}

// 验证标题长度（1-100字符）
export function isValidTitle(title: string): boolean {
  return title.length >= 1 && title.length <= 100
}

// 验证帖子内容长度（1-50000字符）
export function isValidPostContent(content: string): boolean {
  return content.length >= 1 && content.length <= 50000
}

// 验证评论内容长度（1-5000字符）
export function isValidCommentContent(content: string): boolean {
  return content.length >= 1 && content.length <= 5000
}

// 验证昵称长度（1-30字符）
export function isValidNickname(nickname: string): boolean {
  return nickname.length >= 1 && nickname.length <= 30
}