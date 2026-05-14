# 本地开发说明

## 技术栈

- Next.js
- TypeScript
- Prisma
- MySQL

## 启动步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量样例：

```bash
cp .env.example .env
```

修改 `.env` 中的数据库连接：

```bash
DATABASE_URL="mysql://user:password@localhost:3306/guqin_school_management"
```

### 3. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 4. 执行数据库迁移

```bash
npm run prisma:migrate
```

### 5. 启动开发服务

```bash
npm run dev
```

访问：

```text
http://localhost:3000
```

## 当前已实现的能力

- 首页 MVP 控制台
- Prisma 数据模型
- 学生 API
- 排课 API
- 排课冲突校验
- 课后复盘提交 API
- 本地占位 AI 学员评估服务
- AI 自动生成教务跟进任务
- 教务跟进任务 API

## 当前 API

```text
GET  /api/students
POST /api/students

GET  /api/schedules
POST /api/schedules

POST /api/lessons/:lessonId/review

GET  /api/followup-tasks
POST /api/followup-tasks
PATCH /api/followup-tasks/:taskId
```

## 下一步开发重点

1. 学生列表页面
2. 学生详情页/学员成长档案
3. 排课日历页面
4. 老师课后复盘表单页面
5. 教务 AI 跟进中心页面
6. 用户登录和权限中间件
7. 外部 AI API 接入
