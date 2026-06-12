# TeamAgentX 产品讨论论坛

TeamAgentX 的官方产品讨论论坛，为用户提供交流、反馈、项目展示的平台。

## 功能模块

### 用户系统
- 邮箱注册/登录
- 个人信息设置（头像、昵称、密码）
- 个人主页展示

### 版块系统
- **讨论区**：用户交流使用心得、技巧、讨论
- **问题反馈**：用户反馈问题、建议
- **项目展示**：用户展示项目案例
- **公告**：官方发布产品更新、活动公告

### 帖子系统
- 发帖（富文本编辑器支持图片、代码块、链接、表格）
- 编辑帖、删除帖
- 帖子列表展示（支持筛选排序）
- 帖子详情页

### 互动功能
- 评论回复（楼中楼形式，最多嵌套 3 层）
- 点赞帖子/评论
- 收藏帖子
- 举报不当内容

### 管理功能
- 删除帖子/评论
- 置顶帖子
- 加精帖子
- 移动帖子到其他版块

### 搜索筛选
- 关键词搜索
- 版块筛选
- 时间排序（最新/最热）
- 按作者筛选

### 首页展示
- 最新帖子列表
- 热门帖子（热度计算：浏览数 + 点赞数×5 + 评论数×10）
- 置顶帖子区
- 精华帖子推荐

---

## 技术栈

### 前端
- React 18 + Vite 5
- Tailwind CSS 3
- Zustand 4
- React Router DOM 6
- TipTap 2（富文本编辑器）
- TypeScript 5

### 后端
- Fastify 4
- Prisma 5
- MySQL 8
- JWT 认证
- nodemailer（邮件发送）
- TypeScript 5

---

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置数据库

数据库连接信息已配置在 `server/.env`：

```env
DATABASE_URL="mysql://root:MySQLRoot@2024@124.220.65.225:3306/teamagentx_forum"
```

如需修改，请直接编辑 `server/.env` 文件。

确保数据库已创建：

```bash
mysql -u root -p -e "CREATE DATABASE teamagentx_forum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. 初始化数据库

```bash
cd server
pnpm db:generate   # 生成 Prisma Client
pnpm db:push       # 推送 schema 到数据库
```

### 4. 初始化版块数据

项目启动后，数据库会自动创建以下版块：
- 讨论区（discussion）
- 问题反馈（feedback）
- 项目展示（showcase）
- 公告（announcement）

### 5. 启动开发服务器

```bash
pnpm dev
```

- 前端地址：http://localhost:5173
- 后端地址：http://localhost:3000

### 单独启动

```bash
# 前端
cd web && pnpm dev

# 后端（需先配置数据库）
cd server && pnpm db:generate && pnpm dev
```

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 同时启动前后端 |
| `pnpm build` | 构建前后端 |
| `pnpm start` | 启动后端服务（生产环境） |
| `cd server && pnpm db:studio` | 打开 Prisma Studio |
| `cd server && pnpm db:migrate` | 创建迁移文件 |

---

## 项目结构

```
teamagentx-forum/
├── web/                    # 前端项目
│   ├── src/
│   │   ├── modules/        # 业务模块（auth、post、comment、user、category）
│   │   ├── shared/         # 共享资源（components、hooks、services、store、utils）
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
│
├── server/                 # 后端项目
│   ├── src/
│   │   ├── modules/        # 业务模块（auth、post、comment、user、category、upload、admin）
│   │   ├── lib/            # 库文件（prisma.ts）
│   │   ├── shared/         # 共享资源（middleware、utils）
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
├── CLAUDE.md               # 项目约束
└── README.md               # 项目说明（本文件）
```

---

## API 文档

详细的 API 接口设计请查看 [docs/api-spec.md](docs/api-spec.md)。

### 主要接口模块

| 模块 | 路径前缀 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 注册、登录、邮箱验证、修改密码 |
| 用户 | `/api/users` | 用户信息、帖子列表、收藏列表 |
| 版块 | `/api/categories` | 版块列表、详情 |
| 帖子 | `/api/posts` | 帖子 CRUD、点赞、收藏、举报 |
| 评论 | `/api/comments` | 评论 CRUD、点赞 |
| 上传 | `/api/upload` | 图片上传 |
| 管理 | `/api/admin` | 管理后台（举报处理等） |

---

## 数据模型

详细的数据模型设计请查看 [docs/data-model.md](docs/data-model.md)。

### 主要实体

| 实体 | 说明 |
|------|------|
| User | 用户（邮箱、密码、昵称、头像、角色） |
| Category | 版块（名称、标识、描述、排序） |
| Post | 帖子（标题、内容、作者、版块、置顶、精华、状态） |
| Comment | 评论（内容、作者、帖子、父评论、状态） |
| Like | 点赞（用户、帖子/评论） |
| Favorite | 收藏（用户、帖子） |
| Report | 举报（用户、帖子/评论、原因、状态） |
| PostLimit | 发帖限制（用户、日期、数量） |

---

## 开发规范

详见 [CLAUDE.md](./CLAUDE.md)。

---

## 文档

- [PRD 文档](docs/prd/2026-06-12-teamagentx-forum-prd.md)
- [架构设计](docs/architecture.md)
- [API 接口设计](docs/api-spec.md)
- [数据模型设计](docs/data-model.md)
- [技术栈说明](docs/tech-stack.md)

---

## License

MIT