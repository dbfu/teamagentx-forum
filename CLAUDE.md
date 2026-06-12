# 项目约束

## 项目概述

**项目名称**：TeamAgentX 产品讨论论坛  
**项目类型**：前后端分离的 Web 应用  
**仓库目录**：`teamagentx-forum`

---

## 技术栈

### 前端
- 框架：React 18 + Vite 5
- 样式：Tailwind CSS 3
- 状态管理：Zustand 4
- 路由：React Router DOM 6
- 富文本编辑器：TipTap 2
- 语言：TypeScript 5
- 包管理：pnpm（必须）

### 后端
- 框架：Fastify 4
- ORM：Prisma 5
- 数据库：MySQL 8
- 认证：JWT + 邮箱验证
- 密码加密：bcrypt
- 邮件发送：nodemailer
- 文件上传：multer（multipart/form-data）
- 语言：TypeScript 5
- 包管理：pnpm（必须）

---

## 代码规范

### 基本规范
- 语言：TypeScript（禁止 JavaScript）
- 每个组件不超过 500 行（超过必须拆分）
- 文件命名：kebab-case（如 `post-list.tsx`）
- 目录结构：按功能模块划分

### 前端规范
- 组件位置：`web/src/modules/[功能模块]/components/` 或 `web/src/shared/components/`
- 页面位置：`web/src/modules/[功能模块]/pages/`
- Service 封装：所有 API 请求必须通过 service 层（`web/src/shared/services/`）
- Store 管理：使用 Zustand（`web/src/shared/store/`）

### 后端规范
- 路由位置：`server/src/modules/[功能模块]/routes.ts`
- Controller 位置：`server/src/modules/[功能模块]/controller.ts`
- Service 位置：`server/src/modules/[功能模块]/service.ts`
- Controller 负责参数验证和响应，禁止写业务逻辑
- Service 负责业务逻辑，调用 Prisma 进行数据操作

---

## API 规范

### 响应格式
```typescript
{
  code: number,     // 0 表示成功，非 0 表示错误
  message: string,
  data: T | null
}
```

### 认证方式
- 使用 JWT Token 认证
- Header: `Authorization: Bearer <token>`
- Token 有效期：7 天

### 错误码定义
| 错误码范围 | 模块 |
|-----------|------|
| 0 | 成功 |
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

---

## Prisma 规范

### 命名规范
- model 命名：PascalCase（如 User、Post、Comment）
- 字段命名：camelCase（如 createdAt、updatedAt）
- 数据库列名：snake_case（使用 @map 映射）
- 表名：snake_case（使用 @@map 映射）

### 必备字段
每个 model 必须包含：
- `id`: 主键（UUID）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### 索引规范
- 外键字段必须有索引（如 authorId、postId）
- 查询常用字段必须有索引（如 createdAt、status）
- 唯一约束字段必须有唯一索引（如 email、slug）

---

## 业务规则

### 帖子规则
- 标题：1-100 字符，必填
- 内容：1-50000 字符，必填
- 每个用户每天最多发帖 20 篇（PostLimit 表记录）
- 公告版块仅管理员可发帖

### 评论规则
- 内容：1-5000 字符，必填
- 楼中楼最多嵌套 3 层（应用层校验）
- 每个用户每分钟最多评论 10 条（应用层限流）

### 点赞规则
- 每个用户对每个帖子/评论只能点赞 1 次
- 点赞可取消

### 收藏规则
- 每个用户对每个帖子只能收藏 1 次
- 收藏可取消

### 举报规则
- 每个用户对同一帖子/评论只能举报 1 次
- 举报类型：SPAM（垃圾广告）、ATTACK（恶意攻击）、PLAGIARISM（内容抄袭）、OTHER（其他）

### 管理员规则
- 每个版块最多同时置顶 5 篇帖子
- 管理员可置顶、加精、移动、删除任意帖子/评论

### 热度计算
```
热度 = viewCount * 1 + likeCount * 5 + commentCount * 10
```

---

## 数据库配置

**数据库连接信息**：
```env
DATABASE_URL="mysql://root:MySQLRoot@2024@124.220.65.225:3306/teamagentx_forum"
```

**配置位置**：`server/.env`

---

## 目录结构

```
teamagentx-forum/
├── web/                    # 前端项目
│   ├── src/
│   │   ├── modules/        # 业务模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── post/       # 帖子模块
│   │   │   ├── comment/    # 评论模块
│   │   │   ├── user/       # 用户模块
│   │   │   └── category/   # 版块模块
│   │   ├── shared/         # 共享资源
│   │   │   ├── components/ # 公共组件
│   │   │   ├── hooks/      # 公共 hooks
│   │   │   ├── services/   # API 服务
│   │   │   ├── store/      # 全局状态
│   │   │   └── utils/      # 工具函数
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
│
├── server/                 # 后端项目
│   ├── src/
│   │   ├── modules/        # 业务模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── post/       # 帖子模块
│   │   │   ├── comment/    # 评论模块
│   │   │   ├── user/       # 用户模块
│   │   │   ├── category/   # 版块模块
│   │   │   ├── upload/     # 上传模块
│   │   │   └── admin/      # 管理后台模块
│   │   ├── lib/            # 库文件
│   │   │   └── prisma.ts   # Prisma 客户端
│   │   ├── shared/         # 共享资源
│   │   │   ├── middleware/ # 中间件
│   │   │   └── utils/      # 工具函数
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── docs/                   # 文档目录
│   ├── architecture.md     # 架构设计
│   ├── api-spec.md         # API 接口设计
│   ├── data-model.md       # 数据模型设计
│   ├── tech-stack.md       # 技术栈说明
│   └── prd/                # PRD 文档
│
├── CLAUDE.md               # 项目约束（本文件）
└── README.md               # 项目说明
```

---

## 禁止事项

- 禁止使用 npm 或 yarn 安装依赖
- 禁止在组件中直接调用 API（必须通过 service）
- 禁止在后端 controller 中写业务逻辑（必须放在 service）
- 禁止硬编码配置（必须使用环境变量）
- 禁止前端存储敏感信息
- 禁止跳过 TypeScript 类型检查
- 禁止在 Prisma model 中使用 autoincrement（必须使用 uuid）
- 禁止删除 createdAt 和 updatedAt 字段
- 禁止在 API 响应中暴露用户密码
- 禁止在前端显示用户邮箱（仅显示昵称和头像）