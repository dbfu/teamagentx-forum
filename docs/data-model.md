# 数据模型设计

## 实体关系图

```
User (用户)
  ├── Post (帖子) 1:N
  ├── Comment (评论) 1:N
  ├── Like (点赞) 1:N
  ├── Favorite (收藏) 1:N
  └── Report (举报) 1:N

Category (版块)
  └── Post (帖子) 1:N

Post (帖子)
  ├── User (作者) N:1
  ├── Category (版块) N:1
  ├── Comment (评论) 1:N
  ├── Like (点赞) 1:N
  ├── Favorite (收藏) 1:N
  └── Report (举报) 1:N

Comment (评论)
  ├── User (评论者) N:1
  ├── Post (帖子) N:1
  ├── Comment (父评论，楼中楼) N:1
  └── Comment (子评论) 1:N
```

## 数据模型定义

### User (用户)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| email | String | 是 | - | 邮箱，唯一 |
| password | String | 是 | - | 密码（加密后） |
| nickname | String | 否 | null | 昵称 |
| avatar | String | 否 | null | 头像 URL |
| role | Enum | 是 | USER | 角色：USER(普通用户), ADMIN(管理员) |
| emailVerified | Boolean | 是 | false | 邮箱是否已验证 |
| createdAt | DateTime | 是 | now() | 创建时间 |
| updatedAt | DateTime | 是 | now() | 更新时间 |

**索引**：
- email (unique)

### Category (版块)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| name | String | 是 | - | 版块名称 |
| slug | String | 是 | - | 版块标识（URL 友好） |
| description | String | 否 | null | 版块描述 |
| order | Int | 是 | 0 | 排序（越小越靠前） |
| createdAt | DateTime | 是 | now() | 创建时间 |
| updatedAt | DateTime | 是 | now() | 更新时间 |

**初始数据**：
- 讨论区 (discussion)
- 问题反馈 (feedback)
- 项目展示 (showcase)
- 公告 (announcement)

**索引**：
- slug (unique)

### Post (帖子)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| title | String | 是 | - | 标题（1-100 字符） |
| content | String | 是 | - | 内容（富文本，最多 50000 字符） |
| authorId | String | 是 | - | 作者 ID |
| categoryId | String | 是 | - | 版块 ID |
| isTop | Boolean | 是 | false | 是否置顶 |
| isEssence | Boolean | 是 | false | 是否精华 |
| viewCount | Int | 是 | 0 | 浏览数 |
| likeCount | Int | 是 | 0 | 点赞数 |
| commentCount | Int | 是 | 0 | 评论数 |
| status | Enum | 是 | NORMAL | 状态：NORMAL(正常), DELETED(已删除) |
| createdAt | DateTime | 是 | now() | 创建时间 |
| updatedAt | DateTime | 是 | now() | 更新时间 |

**索引**：
- authorId
- categoryId
- createdAt
- isTop
- isEssence

**热度计算公式**：
```
热度 = viewCount * 1 + likeCount * 5 + commentCount * 10
```

### Comment (评论)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| content | String | 是 | - | 内容（1-5000 字符） |
| authorId | String | 是 | - | 评论者 ID |
| postId | String | 是 | - | 帖子 ID |
| parentId | String | 否 | null | 父评论 ID（楼中楼，最多嵌套 3 层） |
| likeCount | Int | 是 | 0 | 点赞数 |
| status | Enum | 是 | NORMAL | 状态：NORMAL(正常), DELETED(已删除) |
| createdAt | DateTime | 是 | now() | 创建时间 |
| updatedAt | DateTime | 是 | now() | 更新时间 |

**索引**：
- authorId
- postId
- parentId
- createdAt

**约束**：
- 楼中楼最多嵌套 3 层（由应用层校验）

### Like (点赞)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| userId | String | 是 | - | 用户 ID |
| postId | String | 否 | null | 帖子 ID（帖子点赞和评论点赞二选一） |
| commentId | String | 否 | null | 评论 ID |
| createdAt | DateTime | 是 | now() | 创建时间 |

**索引**：
- userId, postId (unique, 条件：postId IS NOT NULL)
- userId, commentId (unique, 条件：commentId IS NOT NULL)

**约束**：
- 每个用户对每个帖子/评论只能点赞 1 次

### Favorite (收藏)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| userId | String | 是 | - | 用户 ID |
| postId | String | 是 | - | 帖子 ID |
| createdAt | DateTime | 是 | now() | 创建时间 |

**索引**：
- userId, postId (unique)

### Report (举报)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| userId | String | 是 | - | 举报者 ID |
| postId | String | 否 | null | 被举报的帖子 ID |
| commentId | String | 否 | null | 被举报的评论 ID |
| reason | Enum | 是 | - | 举报原因：SPAM(垃圾广告), ATTACK(恶意攻击), PLAGIARISM(内容抄袭), OTHER(其他) |
| description | String | 否 | null | 详细描述 |
| status | Enum | 是 | PENDING | 处理状态：PENDING(待处理), RESOLVED(已处理), REJECTED(已驳回) |
| createdAt | DateTime | 是 | now() | 创建时间 |
| updatedAt | DateTime | 是 | now() | 更新时间 |

**索引**：
- userId, postId (unique, 条件：postId IS NOT NULL)
- userId, commentId (unique, 条件：commentId IS NOT NULL)
- status

### PostLimit (发帖限制)

用于记录用户每日发帖数，防止刷帖。

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | String | 是 | uuid() | 主键 |
| userId | String | 是 | - | 用户 ID |
| date | DateTime | 是 | - | 日期 |
| count | Int | 是 | 0 | 当天发帖数 |

**索引**：
- userId, date (unique)

## 业务规则映射

### 发帖限制
- 每个用户每天最多发帖 20 篇 → 通过 PostLimit 表记录每日发帖数

### 评论限制
- 每个用户每分钟最多评论 10 条 → 由应用层限流控制（不持久化）

### 置顶限制
- 每个版块最多同时置顶 5 篇帖子 → 由应用层校验（创建唯一索引：categoryId + isTop WHERE isTop = true）

### 精华限制
- 首页精华推荐区最多显示 5 篇 → 由查询限制（LIMIT 5）

### 热门帖子
- 热度计算：viewCount * 1 + likeCount * 5 + commentCount * 10
- 首页热门帖子区最多显示 10 篇 → 由查询限制（LIMIT 10）

## 数据库选型

使用 **MySQL 8** 作为数据库，与模板仓库保持一致。

## Prisma Schema 预览

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  nickname      String?
  avatar        String?
  role          Role      @default(USER)
  emailVerified Boolean   @default(false)
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  favorites     Favorite[]
  reports       Report[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

model Category {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  order       Int      @default(0)
  posts       Post[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Post {
  id           String     @id @default(uuid())
  title        String
  content      String     @db.Text
  authorId     String
  author       User       @relation(fields: [authorId], references: [id])
  categoryId   String
  category     Category   @relation(fields: [categoryId], references: [id])
  isTop        Boolean    @default(false)
  isEssence    Boolean    @default(false)
  viewCount    Int        @default(0)
  likeCount    Int        @default(0)
  commentCount Int        @default(0)
  status       PostStatus @default(NORMAL)
  comments     Comment[]
  likes        Like[]
  favorites    Favorite[]
  reports      Report[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([authorId])
  @@index([categoryId])
  @@index([createdAt])
  @@index([isTop])
  @@index([isEssence])
}

enum PostStatus {
  NORMAL
  DELETED
}

model Comment {
  id         String        @id @default(uuid())
  content    String        @db.Text
  authorId   String
  author     User          @relation(fields: [authorId], references: [id])
  postId     String
  post       Post          @relation(fields: [postId], references: [id])
  parentId   String?
  parent     Comment?      @relation("CommentReplies", fields: [parentId], references: [id])
  replies    Comment[]     @relation("CommentReplies")
  likeCount  Int           @default(0)
  status     CommentStatus @default(NORMAL)
  likes      Like[]
  reports    Report[]
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  @@index([authorId])
  @@index([postId])
  @@index([parentId])
  @@index([createdAt])
}

enum CommentStatus {
  NORMAL
  DELETED
}

model Like {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  postId    String?
  post      Post?    @relation(fields: [postId], references: [id])
  commentId String?
  comment   Comment? @relation(fields: [commentId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, postId], where: { postId: { not: null } })
  @@unique([userId, commentId], where: { commentId: { not: null } })
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, postId])
}

model Report {
  id          String       @id @default(uuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  postId      String?
  post        Post?        @relation(fields: [postId], references: [id])
  commentId   String?
  comment     Comment?     @relation(fields: [commentId], references: [id])
  reason      ReportReason
  description String?
  status      ReportStatus @default(PENDING)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([userId, postId], where: { postId: { not: null } })
  @@unique([userId, commentId], where: { commentId: { not: null } })
  @@index([status])
}

enum ReportReason {
  SPAM
  ATTACK
  PLAGIARISM
  OTHER
}

enum ReportStatus {
  PENDING
  RESOLVED
  REJECTED
}

model PostLimit {
  id        String   @id @default(uuid())
  userId    String
  date      DateTime
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, date])
}
```