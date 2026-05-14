# 课后复盘与 AI 学员评估模块

## 1. 模块定位

课后复盘与 AI 学员评估是本系统的核心差异化模块。

它的目标不是简单记录老师上了什么课，而是把每节课后老师对学生的观察沉淀为学生画像，并让 AI 辅助判断：

- 学生当前学得怎么样
- 老师下一节课应该怎么推进
- 学生是否有续课机会
- 学生是否有购琴机会
- 学生是否存在流失风险
- 教务是否需要及时介入

## 2. 业务流程

```text
老师完成上课
↓
系统提示填写课后复盘
↓
老师按引导式表单填写
↓
提交复盘并完成课程
↓
系统扣减课时
↓
系统调用 AI 做学员评估
↓
AI 返回教学建议、续课建议、购琴建议、流失风险
↓
系统保存 AI 评估
↓
必要时生成教务跟进任务
↓
教务确认并执行跟进
```

## 3. 强规则

- 不填写复盘，不能完成课程。
- 课程未完成，不扣课。
- AI 只提供建议，不自动修改学生状态。
- AI 评估结果要保留历史，不覆盖旧记录。
- 教务任务可以由 AI 自动生成，但必须由教务人工处理。

## 4. 老师复盘表单

### 教学内容

- 当前曲目
- 当前技法
- 本节教学内容
- 是否完成原计划
- 未完成原因
- 课后作业
- 下节课建议

### 学生掌握情况

- 理解能力
- 练习完成度
- 节奏感
- 音准感
- 指法稳定性
- 记谱能力
- 自主练习能力

### 学生态度和情绪

- 上课态度
- 情绪状态
- 是否有成就感
- 是否有挫败感
- 与老师互动情况
- 老师观察

### 学生困惑点

- 主要困难
- 具体困惑
- 老师判断原因
- 下次解决方案

### 购琴信号

- 学生是否已有琴
- 是否提到练琴不方便
- 是否提到想买琴
- 是否问过琴的价格
- 当前练习条件
- 购琴意向强度
- 推荐跟进方式

### 续课和流失风险

- 剩余课时
- 学习满意度
- 是否有进步感
- 续课信号
- 流失风险
- 风险原因
- 是否建议教务跟进
- 跟进建议

## 5. AI 输入数据结构

系统调用 AI 时，应尽量提供结构化上下文：

```json
{
  "student_profile": {
    "name": "张三",
    "status": "在学",
    "current_stage": "初级",
    "current_repertoire": "仙翁操",
    "has_instrument": "no",
    "instrument_purchase_status": "有意向",
    "remaining_lessons": 4
  },
  "course_history": {
    "total_purchased_lessons": 20,
    "completed_lessons": 16,
    "remaining_lessons": 4,
    "recent_reviews_summary": "最近三节课练习不稳定，但对音色兴趣增强。"
  },
  "current_review": {
    "teaching_content": "复习右手基本指法，进入仙翁操第一段。",
    "student_attitude": "积极",
    "practice_completion": "一般",
    "main_difficulties": "节奏和指法稳定性",
    "teacher_observation": "学生家中无琴，课后练习不足。",
    "instrument_purchase_signal": "medium",
    "renewal_signal": "medium",
    "churn_risk": "medium"
  }
}
```

## 6. AI 输出 JSON

AI 必须返回结构化 JSON：

```json
{
  "learning_score": 7,
  "enthusiasm_score": 8,
  "renewal_probability": "high",
  "instrument_purchase_probability": "medium",
  "churn_risk": "medium",
  "current_main_problem": "学生理解能力不错，但因家中无琴导致练习不足。",
  "teaching_suggestion": "下节课应减少新内容，强化两小节循环练习。",
  "academic_followup_suggestion": "建议教务在两天内轻度跟进，了解学生课后练习条件。",
  "instrument_purchase_suggestion": "可从练习效果角度切入，先安排试琴体验。",
  "renewal_suggestion": "剩余课时较少，应开始续课铺垫。",
  "next_lesson_focus": "稳定节奏、强化右手指法连贯性。",
  "risk_warning": "如果练习条件不改善，可能影响续课。",
  "suggested_tags": ["无琴练习", "购琴意向中", "续课待铺垫", "节奏薄弱"],
  "followup_tasks": [
    {
      "task_type": "instrument_purchase",
      "priority": "medium",
      "title": "跟进练琴条件与试琴意向",
      "content": "学生家中无琴，建议轻度沟通。",
      "suggested_script": "老师反馈你理解挺快，但因为家里没有琴，课后手感不容易固定。可以先试一下适合练习用的琴。"
    }
  ]
}
```

## 7. 分角色展示

### 普通老师看到

- 下节课怎么教
- 学生卡在哪里
- 怎么让学生获得成就感
- 是否需要提醒教务跟进

### 教务老师看到

- 是否需要跟进续课
- 是否需要跟进购琴
- 是否有流失风险
- 建议沟通方向和话术
- 自动生成的跟进任务

### 管理者看到

- 老师复盘完成率
- 老师复盘质量
- 高购琴机会学生数量
- 高续课机会学生数量
- 高流失风险学生数量
- 教务跟进完成率

## 8. 老师复盘质量评分

系统可以从以下维度评分：

- 完整度：关键字段是否填写完整
- 具体度：内容是否具体，不是模板化空话
- 及时性：是否在课后及时提交
- 可用性：是否能支持 AI 生成有效建议

## 9. 教务跟进任务生成规则

以下情况可以自动生成任务：

- 购琴可能性为 high 或 medium
- 续课可能性为 high 且剩余课时不足
- 流失风险为 high
- 体验课已上但未成交
- 学生家中无琴且多次出现练习不足
