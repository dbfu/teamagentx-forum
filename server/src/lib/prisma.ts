// 在所有其他导入之前设置 DATABASE_URL 环境变量
process.env.DATABASE_URL = 'mysql://forumuser:ForumPass123@124.220.65.225:3306/teamagentx_forum'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma