# API 接口设计

## 通用约定

### 响应格式

```typescript
// 成功响应
{
  code: 0,
  message: "success",
  data: T
}

// 错误响应
{
  code: number,  // 非 0 为错误码
  message: string,
  data: null
}
```

### 认证方式

- 使用 JWT Token 认证
- Header: `Authorization: Bearer <token>`
- Token 有效期：7 天

### 分页参数

```typescript
// 请求
{
  page?: number,      // 页码，默认 1
  pageSize?: number,  // 每页数量，默认 20，最大 100
}

// 响应
{
  list: T[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

---

## 1. 认证模块

### 1.1 用户注册

**POST** `/api/auth/register`

**请求**：
```typescript
{
  email: string,      // 邮箱
  password: string,   // 密码（6-20 字符）
  nickname?: string   // 昵称（可选）
}
```

**响应**：
```typescript
{
  code: 0,
  message: "注册成功，请查收验证邮件",
  data: {
    userId: string
  }
}
```

**错误码**：
- 10001: 邮箱格式错误
- 10002: 邮箱已注册
- 10003: 密码长度不符合要求

### 1.2 邮箱验证

**POST** `/api/auth/verify-email`

**请求**：
```typescript
{
  token: string  // 邮件中的验证 token
}
```

**响应**：
```typescript
{
  code: 0,
  message: "邮箱验证成功",
  data: {
    accessToken: string,
    user: {
      id: string,
      email: string,
      nickname: string | null,
      avatar: string | null,
      role: "USER" | "ADMIN"
    }
  }
}
```

**错误码**：
- 10101: 验证 token 无效
- 10102: 验证 token 已过期

### 1.3 用户登录

**POST** `/api/auth/login`

**请求**：
```typescript
{
  email: string,
  password: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "登录成功",
  data: {
    accessToken: string,
    user: {
      id: string,
      email: string,
      nickname: string | null,
      avatar: string | null,
      role: "USER" | "ADMIN"
    }
  }
}
```

**错误码**：
- 10201: 邮箱未注册
- 10202: 密码错误
- 10203: 邮箱未验证

### 1.4 获取当前用户

**GET** `/api/auth/me`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    id: string,
    email: string,
    nickname: string | null,
    avatar: string | null,
    role: "USER" | "ADMIN",
    emailVerified: boolean,
    createdAt: string
  }
}
```

**错误码**：
- 10301: 未登录或 token 无效

### 1.5 修改密码

**PUT** `/api/auth/password`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  oldPassword: string,
  newPassword: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "密码修改成功",
  data: null
}
```

**错误码**：
- 10401: 原密码错误
- 10402: 新密码格式不符合要求

### 1.6 重置密码申请

**POST** `/api/auth/forgot-password`

**请求**：
```typescript
{
  email: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "重置密码邮件已发送",
  data: null
}
```

### 1.7 重置密码

**POST** `/api/auth/reset-password`

**请求**：
```typescript
{
  token: string,
  newPassword: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "密码重置成功",
  data: null
}
```

---

## 2. 用户模块

### 2.1 获取用户信息

**GET** `/api/users/:id`

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    id: string,
    nickname: string | null,
    avatar: string | null,
    role: "USER" | "ADMIN",
    postCount: number,
    createdAt: string
  }
}
```

### 2.2 更新用户信息

**PUT** `/api/users/profile`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  nickname?: string,
  avatar?: string  // 头像 URL
}
```

**响应**：
```typescript
{
  code: 0,
  message: "更新成功",
  data: {
    id: string,
    email: string,
    nickname: string | null,
    avatar: string | null,
    role: "USER" | "ADMIN"
  }
}
```

### 2.3 获取用户帖子列表

**GET** `/api/users/:id/posts`

**查询参数**：
```typescript
{
  page?: number,
  pageSize?: number
}
```

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    list: Post[],
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
```

### 2.4 获取用户收藏列表

**GET** `/api/users/:id/favorites`

**Header**: `Authorization: Bearer <token>` (仅自己可查看)

**查询参数**：
```typescript
{
  page?: number,
  pageSize?: number
}
```

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    list: Post[],
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
```

---

## 3. 版块模块

### 3.1 获取版块列表

**GET** `/api/categories`

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: [
    {
      id: string,
      name: string,
      slug: string,
      description: string | null,
      order: number,
      postCount: number
    }
  ]
}
```

### 3.2 获取版块详情

**GET** `/api/categories/:slug`

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    id: string,
    name: string,
    slug: string,
    description: string | null,
    order: number,
    postCount: number
  }
}
```

---

## 4. 帖子模块

### 4.1 获取帖子列表

**GET** `/api/posts`

**查询参数**：
```typescript
{
  page?: number,
  pageSize?: number,
  category?: string,      // 版块 ID
  author?: string,        // 作者 ID
  keyword?: string,       // 关键词搜索
  sort?: "latest" | "hot" // 排序方式：最新/热门
}
```

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    list: [
      {
        id: string,
        title: string,
        author: {
          id: string,
          nickname: string | null,
          avatar: string | null
        },
        category: {
          id: string,
          name: string,
          slug: string
        },
        isTop: boolean,
        isEssence: boolean,
        viewCount: number,
        likeCount: number,
        commentCount: number,
        createdAt: string,
        updatedAt: string
      }
    ],
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
```

### 4.2 获取置顶帖子

**GET** `/api/posts/top`

**查询参数**：
```typescript
{
  category?: string  // 版块 ID，不传则返回所有版块的置顶帖
}
```

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: [
    {
      id: string,
      title: string,
      author: {
        id: string,
        nickname: string | null,
        avatar: string | null
      },
      category: {
        id: string,
        name: string,
        slug: string
      },
      viewCount: number,
      likeCount: number,
      commentCount: number,
      createdAt: string
    }
  ]
}
```

### 4.3 获取热门帖子

**GET** `/api/posts/hot`

**查询参数**：
```typescript
{
  limit?: number  // 默认 10
}
```

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: [
    {
      id: string,
      title: string,
      author: {
        id: string,
        nickname: string | null,
        avatar: string | null
      },
      category: {
        id: string,
        name: string,
        slug: string
      },
      viewCount: number,
      likeCount: number,
      commentCount: number,
      heat: number,  // 热度值
      createdAt: string
    }
  ]
}
```

### 4.4 获取精华帖子

**GET** `/api/posts/essence`

**查询参数**：
```typescript
{
  page?: number,
  pageSize?: number
}
```

**响应**：同帖子列表

### 4.5 获取帖子详情

**GET** `/api/posts/:id`

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    id: string,
    title: string,
    content: string,
    author: {
      id: string,
      nickname: string | null,
      avatar: string | null,
      role: "USER" | "ADMIN"
    },
    category: {
      id: string,
      name: string,
      slug: string
    },
    isTop: boolean,
    isEssence: boolean,
    viewCount: number,
    likeCount: number,
    commentCount: number,
    isLiked: boolean,      // 当前用户是否已点赞
    isFavorited: boolean,   // 当前用户是否已收藏
    createdAt: string,
    updatedAt: string
  }
}
```

**错误码**：
- 40401: 帖子不存在
- 40402: 帖子已删除

### 4.6 创建帖子

**POST** `/api/posts`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  title: string,       // 1-100 字符
  content: string,     // 1-50000 字符
  categoryId: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "发布成功",
  data: {
    id: string,
    title: string,
    content: string,
    author: {
      id: string,
      nickname: string | null,
      avatar: string | null
    },
    category: {
      id: string,
      name: string,
      slug: string
    },
    viewCount: number,
    likeCount: number,
    commentCount: number,
    createdAt: string
  }
}
```

**错误码**：
- 40101: 标题长度不符合要求
- 40102: 内容长度不符合要求
- 40103: 版块不存在
- 40104: 无权在该版块发帖（公告版块）
- 40105: 今日发帖数量已达上限

### 4.7 更新帖子

**PUT** `/api/posts/:id`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  title?: string,
  content?: string,
  categoryId?: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "更新成功",
  data: {
    id: string,
    title: string,
    content: string,
    updatedAt: string
  }
}
```

**错误码**：
- 40201: 帖子不存在
- 40202: 无权编辑此帖子
- 40203: 帖子已删除

### 4.8 删除帖子

**DELETE** `/api/posts/:id`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "删除成功",
  data: null
}
```

**错误码**：
- 40301: 帖子不存在
- 40302: 无权删除此帖子
- 40303: 帖子已删除

### 4.9 置顶帖子（管理员）

**PUT** `/api/posts/:id/top`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  isTop: boolean
}
```

**响应**：
```typescript
{
  code: 0,
  message: isTop ? "置顶成功" : "取消置顶成功",
  data: null
}
```

**错误码**：
- 40401: 帖子不存在
- 40402: 无权限操作
- 40403: 该版块置顶数量已达上限（最多 5 个）

### 4.10 加精帖子（管理员）

**PUT** `/api/posts/:id/essence`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  isEssence: boolean
}
```

**响应**：
```typescript
{
  code: 0,
  message: isEssence ? "加精成功" : "取消加精成功",
  data: null
}
```

**错误码**：
- 40501: 帖子不存在
- 40502: 无权限操作

### 4.11 移动帖子（管理员）

**PUT** `/api/posts/:id/move`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  categoryId: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "移动成功",
  data: null
}
```

**错误码**：
- 40601: 帖子不存在
- 40602: 无权限操作
- 40603: 目标版块不存在

---

## 5. 评论模块

### 5.1 获取评论列表

**GET** `/api/posts/:postId/comments`

**查询参数**：
```typescript
{
  page?: number,
  pageSize?: number
}
```

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    list: [
      {
        id: string,
        content: string,
        author: {
          id: string,
          nickname: string | null,
          avatar: string | null
        },
        likeCount: number,
        isLiked: boolean,
        replies: [  // 楼中楼回复
          {
            id: string,
            content: string,
            author: {...},
            parentId: string,
            likeCount: number,
            isLiked: boolean,
            replies: [...]  // 最多嵌套 3 层
          }
        ],
        createdAt: string
      }
    ],
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
```

### 5.2 创建评论

**POST** `/api/posts/:postId/comments`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  content: string,    // 1-5000 字符
  parentId?: string   // 父评论 ID（楼中楼）
}
```

**响应**：
```typescript
{
  code: 0,
  message: "评论成功",
  data: {
    id: string,
    content: string,
    author: {
      id: string,
      nickname: string | null,
      avatar: string | null
    },
    parentId: string | null,
    likeCount: number,
    createdAt: string
  }
}
```

**错误码**：
- 50101: 帖子不存在
- 50102: 内容长度不符合要求
- 50103: 父评论不存在
- 50104: 楼中楼嵌套层级超过限制（最多 3 层）
- 50105: 评论频率过快（每分钟最多 10 条）

### 5.3 删除评论

**DELETE** `/api/comments/:id`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "删除成功",
  data: null
}
```

**错误码**：
- 50201: 评论不存在
- 50202: 无权删除此评论
- 50203: 评论已删除

---

## 6. 点赞模块

### 6.1 点赞帖子

**POST** `/api/posts/:id/like`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "点赞成功",
  data: {
    likeCount: number
  }
}
```

**错误码**：
- 60101: 帖子不存在
- 60102: 已点赞过

### 6.2 取消点赞帖子

**DELETE** `/api/posts/:id/like`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "取消点赞成功",
  data: {
    likeCount: number
  }
}
```

**错误码**：
- 60201: 帖子不存在
- 60202: 未点赞过

### 6.3 点赞评论

**POST** `/api/comments/:id/like`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "点赞成功",
  data: {
    likeCount: number
  }
}
```

**错误码**：
- 60301: 评论不存在
- 60302: 已点赞过

### 6.4 取消点赞评论

**DELETE** `/api/comments/:id/like`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "取消点赞成功",
  data: {
    likeCount: number
  }
}
```

**错误码**：
- 60401: 评论不存在
- 60402: 未点赞过

---

## 7. 收藏模块

### 7.1 收藏帖子

**POST** `/api/posts/:id/favorite`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "收藏成功",
  data: null
}
```

**错误码**：
- 70101: 帖子不存在
- 70102: 已收藏过

### 7.2 取消收藏帖子

**DELETE** `/api/posts/:id/favorite`

**Header**: `Authorization: Bearer <token>`

**响应**：
```typescript
{
  code: 0,
  message: "取消收藏成功",
  data: null
}
```

**错误码**：
- 70201: 帖子不存在
- 70202: 未收藏过

---

## 8. 举报模块

### 8.1 举报帖子

**POST** `/api/posts/:id/report`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  reason: "SPAM" | "ATTACK" | "PLAGIARISM" | "OTHER",
  description?: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "举报成功，我们会尽快处理",
  data: null
}
```

**错误码**：
- 80101: 帖子不存在
- 80102: 已举报过此帖子

### 8.2 举报评论

**POST** `/api/comments/:id/report`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  reason: "SPAM" | "ATTACK" | "PLAGIARISM" | "OTHER",
  description?: string
}
```

**响应**：
```typescript
{
  code: 0,
  message: "举报成功，我们会尽快处理",
  data: null
}
```

**错误码**：
- 80201: 评论不存在
- 80202: 已举报过此评论

---

## 9. 管理后台模块

### 9.1 获取举报列表（管理员）

**GET** `/api/admin/reports`

**Header**: `Authorization: Bearer <token>`

**查询参数**：
```typescript
{
  page?: number,
  pageSize?: number,
  status?: "PENDING" | "RESOLVED" | "REJECTED"
}
```

**响应**：
```typescript
{
  code: 0,
  message: "success",
  data: {
    list: [
      {
        id: string,
        user: {
          id: string,
          nickname: string | null,
          email: string
        },
        post: {...} | null,
        comment: {...} | null,
        reason: string,
        description: string | null,
        status: string,
        createdAt: string
      }
    ],
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
```

### 9.2 处理举报（管理员）

**PUT** `/api/admin/reports/:id`

**Header**: `Authorization: Bearer <token>`

**请求**：
```typescript
{
  status: "RESOLVED" | "REJECTED"
}
```

**响应**：
```typescript
{
  code: 0,
  message: "处理成功",
  data: null
}
```

---

## 10. 上传模块

### 10.1 上传图片

**POST** `/api/upload/image`

**Header**: `Authorization: Bearer <token>`

**请求**：`multipart/form-data`
```
file: File  // 图片文件（支持 jpg、png、gif，最大 5MB）
```

**响应**：
```typescript
{
  code: 0,
  message: "上传成功",
  data: {
    url: string
  }
}
```

**错误码**：
- 90101: 文件格式不支持
- 90102: 文件大小超过限制
- 90103: 上传失败

---

## 错误码汇总

| 错误码范围 | 模块 |
|-----------|------|
| 10000-10999 | 认证模块 |
| 20000-20999 | 用户模块 |
| 30000-30999 | 版块模块 |
| 40000-40999 | 帖子模块 |
| 50000-50999 | 评论模块 |
| 60000-60999 | 点赞模块 |
| 70000-70999 | 收藏模块 |
| 80000-80999 | 举报模块 |
| 90000-90999 | 上传模块 |
| 99999 | 系统错误 |