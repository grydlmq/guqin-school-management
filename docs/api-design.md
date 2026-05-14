# 接口设计

## 通用约定

- API 前缀：`/api`
- 返回格式：JSON
- 认证方式：后续可选 JWT / Session
- 权限控制：根据用户角色和资源归属控制

## 1. 学生接口

### 获取学生列表

```http
GET /api/students
```

支持筛选：

- 主状态
- 售前阶段
- 关联老师
- 负责教务
- 剩余课时
- 购琴状态

### 获取学生详情

```http
GET /api/students/{studentId}
```

学生详情应返回成长档案需要的数据摘要。

### 新增学生

```http
POST /api/students
```

### 更新学生

```http
PATCH /api/students/{studentId}
```

## 2. 排课接口

### 获取排课列表

```http
GET /api/schedules
```

支持按日期、老师、教室、学生、班级、课程类型筛选。

### 新增排课

```http
POST /api/schedules
```

新增时必须校验：

- 教室时间冲突
- 老师时间冲突
- 班级时间冲突
- 教室是否可用
- 正式课学生是否有剩余课时

### 取消排课

```http
PATCH /api/schedules/{scheduleId}/cancel
```

## 3. 课后复盘接口

### 获取某节课的复盘表单

```http
GET /api/lessons/{lessonId}/review-form
```

返回课程信息、学生上下文、剩余课时、当前学习进度、购琴状态等。

### 保存复盘草稿

```http
POST /api/lessons/{lessonId}/review-draft
```

### 提交课后复盘并完成课程

```http
POST /api/lessons/{lessonId}/review
```

提交后执行：

1. 保存课后复盘。
2. 将课程状态改为 completed。
3. 扣减学生课时。
4. 触发 AI 学员评估。
5. 必要时生成教务跟进任务。

### 获取复盘详情

```http
GET /api/lesson-reviews/{reviewId}
```

### 获取学生历史复盘

```http
GET /api/students/{studentId}/lesson-reviews
```

## 4. AI 学员评估接口

### 获取 AI 评估结果

```http
GET /api/lesson-reviews/{reviewId}/ai-evaluation
```

### 重新生成 AI 评估

```http
POST /api/lesson-reviews/{reviewId}/ai-evaluation/regenerate
```

### 获取学生 AI 评估历史

```http
GET /api/students/{studentId}/ai-evaluations
```

## 5. 教务跟进任务接口

### 获取任务列表

```http
GET /api/followup-tasks
```

支持筛选：

- 任务类型
- 优先级
- 负责人
- 状态
- 学生
- 截止时间

### 创建任务

```http
POST /api/followup-tasks
```

### 更新任务状态

```http
PATCH /api/followup-tasks/{taskId}
```

### 完成任务

```http
PATCH /api/followup-tasks/{taskId}/complete
```

## 6. 购课与课时接口

### 新增购课记录

```http
POST /api/course-purchases
```

### 获取学生课时余额

```http
GET /api/students/{studentId}/course-balance
```

### 获取课时流水

```http
GET /api/students/{studentId}/lesson-consumption-records
```

## 7. 购琴接口

### 获取学生购琴记录

```http
GET /api/students/{studentId}/instrument-records
```

### 新增或更新购琴记录

```http
POST /api/instrument-records
PATCH /api/instrument-records/{recordId}
```

### 新增购琴跟进

```http
POST /api/instrument-records/{recordId}/followups
```

## 8. 物料接口

### 获取物料列表

```http
GET /api/materials
```

### 登记学生领取物料

```http
POST /api/students/{studentId}/material-records
```

### 标记物料已领取

```http
PATCH /api/student-material-records/{recordId}/received
```

## 9. 考核与荣誉接口

### 创建考核记录

```http
POST /api/assessments
```

### 更新考核结果

```http
PATCH /api/assessments/{assessmentId}
```

考核通过后，系统应自动生成对应胸章待发放记录。

### 标记胸章已发放

```http
PATCH /api/student-honors/{honorId}/issued
```

## 10. 报表接口

### 老师课量统计

```http
GET /api/reports/teacher-lessons
```

### 复盘质量统计

```http
GET /api/reports/teacher-review-quality
```

### 教务跟进统计

```http
GET /api/reports/followup-tasks
```
