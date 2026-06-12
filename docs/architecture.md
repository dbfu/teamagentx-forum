# 模块拆分设计

## 项目结构

```
teamagentx-forum/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── stores/         # Zustand 状态管理
│   │   ├── services/       # API 请求封装
│   │   ├── utils/          # 工具函数
│   │   ├── types/          # TypeScript 类型定义
│   │   └── styles/         # 样式文件
│   └── ...
├── server/                 # 后端项目
│   ├── src/
│   │   ├── controllers/    # 控制器（路由处理）
│   │   ├── services/       # 业务逻辑层
│   │   ├── models/         # 数据模型（Prisma）
│   │   ├── middlewares/    # 中间件
│   │   ├── utils/          # 工具函数
│   │   ├── types/          # TypeScript 类型定义
│   │   └── routes/         # 路由定义
│   ├── prisma/
│   │   └── schema.prisma   # Prisma Schema
│   └── ...
└── docs/                   # 文档
    ├── architecture.md     # 架构设计
    ├── api-spec.md         # API 接口设计
    ├── data-model.md       # 数据模型设计
    ├── tech-stack.md       # 技术栈说明
    └── prd/                # PRD 文档
```

---

## 前端模块划分

### 1. 页面模块

| 页面 | 路径 | 功能说明 | 依赖接口 |
|------|------|----------|----------|
| 首页 | `/` | 展示置顶、精华、热门、最新帖子 | 帖子列表、置顶、热门、精华 API |
| 版块页 | `/category/:slug` | 展示版块下的帖子列表 | 版块详情、帖子列表 API |
| 帖子详情页 | `/post/:id` | 展示帖子内容和评论 | 帖子详情、评论列表 API |
| 登录页 | `/login` | 用户登录 | 登录 API |
| 注册页 | `/register` | 用户注册 | 注册、邮箱验证 API |
| 个人中心 | `/user/:id` | 用户信息、发帖历史、收藏 | 用户信息、帖子列表、收藏 API |
| 发帖页 | `/post/create` | 发表新帖 | 创建帖子 API |
| 编辑帖子页 | `/post/:id/edit` | 编辑帖子 | 帖子详情、更新帖子 API |
| 搜索页 | `/search` | 搜索帖子 | 帖子列表（keyword）API |

### 2. 通用组件

| 组件 | 位置 | 功能说明 | 使用页面 |
|------|------|----------|----------|
| Header | `components/Header` | 顶部导航栏、搜索框、用户菜单 | 所有页面 |
| PostCard | `components/PostCard` | 帖子卡片（列表项） | 首页、版块页、搜索页 |
| PostList | `components/PostList` | 帖子列表（含分页） | 首页、版块页、个人中心、搜索页 |
| CommentList | `components/CommentList` | 评论列表（含楼中楼） | 帖子详情页 |
| CommentInput | `components/CommentInput` | 评论输入框 | 帖子详情页 |
| RichTextEditor | `components/RichTextEditor` | 富文本编辑器 | 发帖页、编辑帖子页 |
| Sidebar | `components/Sidebar` | 侧边栏（热门帖子、版块入口） | 首页、版块页、帖子详情页 |
| Pagination | `components/Pagination` | 分页组件 | 帖子列表、评论列表 |
| Loading | `components/Loading` | 加载状态 | 所有异步数据页面 |
| EmptyState | `components/EmptyState` | 空数据状态 | 帖子列表、评论列表 |
| Modal | `components/Modal` | 通用弹窗 | 举报、删除确认等 |
| Avatar | `components/Avatar` | 用户头像组件 | Header、帖子卡片、评论 |

### 3. 状态管理（Zustand Stores）

| Store | 文件 | 管理内容 |
|-------|------|----------|
| authStore | `stores/authStore.ts` | 用户登录状态、用户信息、token |
| postStore | `stores/postStore.ts` | 帖子列表缓存、当前帖子详情 |
| categoryStore | `stores/categoryStore.ts` | 版块列表 |
| uiStore | `stores/uiStore.ts` | UI 状态（弹窗、loading 等） |

### 4. API 服务层

| Service | 文件 | 封装接口 |
|---------|------|----------|
| authService | `services/authService.ts` | 注册、登录、验证邮箱、修改密码等 |
| userService | `services/userService.ts` | 用户信息、帖子列表、收藏列表 |
| postService | `services/postService.ts` | 帖子 CRUD、点赞、收藏、举报 |
| commentService | `services/commentService.ts` | 评论 CRUD、点赞 |
| categoryService | `services/categoryService.ts` | 版块列表、详情 |
| uploadService | `services/uploadService.ts` | 图片上传 |

### 5. 自定义 Hooks

| Hook | 文件 | 功能 |
|------|------|------|
| useAuth | `hooks/useAuth.ts` | 认证状态、登录/登出 |
| usePost | `hooks/usePost.ts` | 帖子数据获取、操作 |
| useComment | `hooks/useComment.ts` | 评论数据获取、操作 |
| usePagination | `hooks/usePagination.ts` | 分页逻辑 |
| useSearch | `hooks/useSearch.ts` | 搜索逻辑 |

### 6. 工具函数

| 工具 | 文件 | 功能 |
|------|------|------|
| request | `utils/request.ts` | 封装 fetch，处理 token、错误 |
| formatDate | `utils/date.ts` | 日期格式化 |
| validator | `utils/validator.ts` | 表单验证 |
| constants | `utils/constants.ts` | 常量定义（错误码等） |

---

## 后端模块划分

### 1. 路由层（Routes）

| 路由模块 | 文件 | 包含路由 |
|----------|------|----------|
| authRoutes | `routes/authRoutes.ts` | `/api/auth/*` |
| userRoutes | `routes/userRoutes.ts` | `/api/users/*` |
| categoryRoutes | `routes/categoryRoutes.ts` | `/api/categories/*` |
| postRoutes | `routes/postRoutes.ts` | `/api/posts/*` |
| commentRoutes | `routes/commentRoutes.ts` | `/api/posts/:postId/comments`, `/api/comments/*` |
| uploadRoutes | `routes/uploadRoutes.ts` | `/api/upload/*` |
| adminRoutes | `routes/adminRoutes.ts` | `/api/admin/*` |

### 2. 控制器层（Controllers）

| 控制器 | 文件 | 负责功能 |
|--------|------|----------|
| AuthController | `controllers/AuthController.ts` | 注册、登录、验证邮箱、修改密码 |
| UserController | `controllers/UserController.ts` | 用户信息、帖子列表、收藏列表 |
| CategoryController | `controllers/CategoryController.ts` | 版块列表、详情 |
| PostController | `controllers/PostController.ts` | 帖子 CRUD、点赞、收藏、举报、置顶、加精、移动 |
| CommentController | `controllers/CommentController.ts` | 评论 CRUD、点赞 |
| UploadController | `controllers/UploadController.ts` | 图片上传 |
| AdminController | `controllers/AdminController.ts` | 举报管理 |

### 3. 服务层（Services）

| 服务 | 文件 | 业务逻辑 |
|------|------|----------|
| AuthService | `services/AuthService.ts` | 用户注册、密码加密、token 生成、邮箱验证 |
| UserService | `services/UserService.ts` | 用户信息查询、更新、统计 |
| CategoryService | `services/CategoryService.ts` | 版块查询 |
| PostService | `services/PostService.ts` | 帖子 CRUD、热度计算、发帖限制校验、置顶限制校验 |
| CommentService | `services/CommentService.ts` | 评论 CRUD、楼中楼层级校验、评论频率限制 |
| LikeService | `services/LikeService.ts` | 点赞/取消点赞、点赞数更新 |
| FavoriteService | `services/FavoriteService.ts` | 收藏/取消收藏 |
| ReportService | `services/ReportService.ts` | 举报创建、查询、处理 |
| UploadService | `services/UploadService.ts` | 图片上传、文件校验 |

### 4. 中间件层（Middlewares）

| 中间件 | 文件 | 功能 |
|--------|------|------|
| authMiddleware | `middlewares/authMiddleware.ts` | JWT 验证，提取用户信息 |
| adminMiddleware | `middlewares/adminMiddleware.ts` | 管理员权限验证 |
| rateLimitMiddleware | `middlewares/rateLimitMiddleware.ts` | 频率限制（评论、发帖） |
| errorMiddleware | `middlewares/errorMiddleware.ts` | 错误处理 |
| validateMiddleware | `middlewares/validateMiddleware.ts` | 参数验证 |

### 5. 数据模型层（Prisma Models）

数据模型已在 `docs/data-model.md` 中定义，Prisma Schema 文件为 `server/prisma/schema.prisma`。

### 6. 工具函数

| 工具 | 文件 | 功能 |
|------|------|------|
| jwt | `utils/jwt.ts` | JWT 生成、验证 |
| bcrypt | `utils/bcrypt.ts` | 密码加密、验证 |
| email | `utils/email.ts` | 邮件发送 |
| response | `utils/response.ts` | 响应格式化 |
| errorCodes | `utils/errorCodes.ts` | 错误码定义 |
| logger | `utils/logger.ts` | 日志记录 |

---

## 模块依赖关系

### 前端依赖关系

```
页面 → 组件 → Hooks → Stores → Services → API
```

**具体依赖**：
- Header 组件依赖：authStore（用户状态）、categoryStore（版块列表）
- PostCard 组件依赖：authStore（判断是否为作者）、postService（点赞、收藏）
- PostList 组件依赖：usePagination Hook、postService
- CommentList 组件依赖：useComment Hook、commentService、authStore
- RichTextEditor 组件依赖：uploadService（上传图片）

### 后端依赖关系

```
Routes → Controller → Service → Prisma Model → Database
```

**具体依赖**：
- AuthController → AuthService → User Model
- PostController → PostService → Post Model、User Model、Category Model
- CommentController → CommentService → Comment Model、Post Model、User Model
- PostService → LikeService、FavoriteService、ReportService（点赞、收藏、举报逻辑）

---

## 开发顺序建议

### 第一阶段：后端基础（基础设施）
1. 用户认证模块（注册、登录、JWT）
2. 版块模块（初始化版块数据）
3. 帖子基础 CRUD
4. 评论基础 CRUD

### 第二阶段：后端业务逻辑
1. 点赞、收藏、举报功能
2. 帖子置顶、加精、移动（管理员）
3. 发帖限制、评论频率限制
4. 热度计算
5. 图片上传

### 第三阶段：前端页面
1. 登录注册页面（依赖认证模块）
2. 首页（依赖帖子列表、版块、热门 API）
3. 版块页（依赖版块、帖子列表 API）
4. 帖子详情页（依赖帖子详情、评论 API）
5. 发帖/编辑页（依赖帖子 CRUD、上传 API）
6. 个人中心（依赖用户信息、收藏 API）
7. 搜索页（依赖帖子列表 API）

### 第四阶段：前端交互
1. 点赞、收藏、举报交互
2. 评论楼中楼交互
3. 管理员操作（置顶、加精、移动、删除）

---

## 技术选型说明

技术栈与模板仓库 `easy-coding` 保持一致：

| 层面 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18 |
| 前端构建 | Vite | 5 |
| 前端样式 | Tailwind CSS | 3 |
| 前端状态管理 | Zustand | 4 |
| 后端框架 | Fastify | 4 |
| ORM | Prisma | 5 |
| 数据库 | MySQL | 8 |
| 包管理 | pnpm | - |

**富文本编辑器**：使用 TipTap（基于 ProseMirror，轻量且可扩展）

**认证方案**：JWT + 邮箱验证

**邮件发送**：使用 nodemailer（配置 SMTP）

**频率限制**：使用内存缓存（Map）记录用户操作频率