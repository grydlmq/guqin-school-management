# 数据库设计

## 核心表

第一阶段建议包含以下表：

```text
users                         用户表
teachers                      老师表
students                      学生表
classes                       班级表
class_students                班级学生关联表
classrooms                    教室表
schedules                     排课表
lesson_records                上课记录表
lesson_reviews                课后复盘表
ai_student_evaluations        AI 学员评估表
followup_tasks                教务跟进任务表
course_purchases              购课记录表
course_balances               课时余额表
instrument_records            购琴记录表
instrument_followups          购琴跟进表
payment_records               付款记录表
materials                     物料表
student_material_records      学生物料领取记录表
assessments                   考核记录表
student_honors                学生荣誉/胸章记录表
activities                    活动表，第二阶段
student_activity_records      学生活动参与记录表，第二阶段
teacher_review_quality        老师复盘质量表
```

## 用户 users

| 字段 | 说明 |
|---|---|
| id | 用户 ID |
| name | 姓名 |
| phone | 手机号/登录账号 |
| password_hash | 密码哈希 |
| role | admin / academic / teacher |
| status | active / disabled |
| created_at | 创建时间 |

## 学生 students

| 字段 | 说明 |
|---|---|
| id | 学生 ID |
| name | 姓名 |
| phone | 手机号 |
| wechat | 微信号 |
| source_channel | 来源渠道 |
| assigned_teacher_id | 关联授课老师 |
| assigned_academic_id | 负责教务 |
| main_status | pre_sale / studying / paused / finished / refunded / lost |
| pre_sale_stage | new_lead / contacted / trial_scheduled / trial_no_show / trial_done / after_trial_followup / converted / postponed / abandoned |
| learning_status | not_started / trial / formal / paused / finished |
| instrument_status | unknown / no_need / interested / trialed / purchased / postponed |
| note | 备注 |

## 班级 classes

| 字段 | 说明 |
|---|---|
| id | 班级 ID |
| name | 班级名称 |
| class_type | one_on_one / two_person |
| main_teacher_id | 主授课老师 |
| status | active / paused / finished |

## 排课 schedules

| 字段 | 说明 |
|---|---|
| id | 排课 ID |
| schedule_type | formal / trial / make_up / activity / other |
| student_id | 体验课可直接关联学生 |
| class_id | 正式课关联班级 |
| teacher_id | 老师 |
| classroom_id | 教室 |
| start_time | 开始时间 |
| end_time | 结束时间 |
| status | scheduled / completed / cancelled / no_show |
| deduct_lessons | 是否扣课 |

## 课后复盘 lesson_reviews

课后复盘是第一阶段核心表。每节完成的课程都应有复盘。

| 字段 | 说明 |
|---|---|
| id | 复盘 ID |
| lesson_id | 关联课程 |
| student_id | 学生 |
| class_id | 班级 |
| teacher_id | 老师 |
| teaching_content | 本节教学内容 |
| current_repertoire | 当前曲目 |
| current_techniques | 当前技法 |
| understanding_level | 理解能力 |
| practice_completion | 练习完成度 |
| attitude | 上课态度 |
| emotion_state | 情绪状态 |
| main_difficulties | 主要困难 |
| specific_confusion | 具体困惑 |
| homework | 作业 |
| next_lesson_suggestion | 下节课建议 |
| instrument_purchase_signal | 购琴信号 |
| renewal_signal | 续课信号 |
| churn_risk | 流失风险 |
| need_academic_followup | 是否建议教务跟进 |
| ai_evaluated | 是否已 AI 评估 |

## AI 评估 ai_student_evaluations

| 字段 | 说明 |
|---|---|
| id | AI 评估 ID |
| lesson_review_id | 关联复盘 |
| student_id | 学生 |
| learning_score | 学习状态评分 |
| enthusiasm_score | 学习积极度评分 |
| renewal_probability | 续课可能性 |
| instrument_purchase_probability | 购琴可能性 |
| churn_risk | 流失风险 |
| teaching_suggestion | 给老师的教学建议 |
| academic_followup_suggestion | 给教务的跟进建议 |
| instrument_purchase_suggestion | 购琴推进建议 |
| renewal_suggestion | 续课推进建议 |
| next_lesson_focus | 下节课重点 |
| raw_ai_response | 原始 AI 返回 JSON |

## 教务跟进任务 followup_tasks

| 字段 | 说明 |
|---|---|
| id | 任务 ID |
| student_id | 学生 |
| source_type | ai / manual / system |
| task_type | renewal / instrument_purchase / churn_recovery / trial_conversion / material_reminder / other |
| priority | low / medium / high |
| title | 标题 |
| content | 内容 |
| suggested_script | 建议话术 |
| assignee_id | 负责人 |
| due_date | 截止日期 |
| status | pending / processing / done / paused / closed |
| followup_result | 跟进结果 |

## 物料与荣誉

学生正式报名后自动生成入学礼包待领取。考核通过后自动生成对应胸章待发放。
