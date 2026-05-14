-- 古琴教学点管理系统初始化 SQL
-- 数据库建议：MySQL 8+

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(30) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin', 'academic', 'teacher') NOT NULL DEFAULT 'teacher',
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE teachers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  teacher_type ENUM('normal', 'academic') NOT NULL DEFAULT 'normal',
  can_schedule BOOLEAN DEFAULT TRUE,
  status ENUM('active', 'left') DEFAULT 'active',
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(30),
  wechat VARCHAR(100),
  source_channel VARCHAR(100),
  assigned_teacher_id BIGINT,
  assigned_academic_id BIGINT,
  main_status ENUM('pre_sale', 'studying', 'paused', 'finished', 'refunded', 'lost') DEFAULT 'pre_sale',
  pre_sale_stage ENUM('new_lead', 'contacted', 'trial_scheduled', 'trial_no_show', 'trial_done', 'after_trial_followup', 'converted', 'postponed', 'abandoned') DEFAULT 'new_lead',
  learning_status ENUM('not_started', 'trial', 'formal', 'paused', 'finished') DEFAULT 'not_started',
  instrument_status ENUM('unknown', 'no_need', 'interested', 'trialed', 'purchased', 'postponed') DEFAULT 'unknown',
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE classes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  class_type ENUM('one_on_one', 'two_person') DEFAULT 'one_on_one',
  main_teacher_id BIGINT,
  status ENUM('active', 'paused', 'finished') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_students (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classrooms (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  capacity INT DEFAULT 1,
  status ENUM('available', 'maintenance', 'disabled') DEFAULT 'available',
  note TEXT
);

CREATE TABLE schedules (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  schedule_type ENUM('formal', 'trial', 'make_up', 'activity', 'other') NOT NULL DEFAULT 'formal',
  student_id BIGINT,
  class_id BIGINT,
  teacher_id BIGINT NOT NULL,
  classroom_id BIGINT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  deduct_lessons BOOLEAN DEFAULT TRUE,
  note TEXT,
  created_by BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE course_purchases (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  class_id BIGINT,
  purchased_lessons DECIMAL(6,2) NOT NULL,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
  purchased_at DATETIME,
  operator_id BIGINT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_balances (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  class_id BIGINT,
  total_lessons DECIMAL(6,2) DEFAULT 0,
  used_lessons DECIMAL(6,2) DEFAULT 0,
  remaining_lessons DECIMAL(6,2) DEFAULT 0,
  status ENUM('normal', 'low_balance', 'finished', 'refunded') DEFAULT 'normal',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lesson_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  schedule_id BIGINT NOT NULL,
  student_id BIGINT,
  class_id BIGINT,
  teacher_id BIGINT NOT NULL,
  classroom_id BIGINT NOT NULL,
  lesson_date DATE NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  lesson_units DECIMAL(4,2) DEFAULT 1,
  status ENUM('scheduled', 'completed', 'cancelled', 'student_leave', 'teacher_leave') DEFAULT 'scheduled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lesson_reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lesson_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  class_id BIGINT,
  teacher_id BIGINT NOT NULL,
  lesson_date DATE NOT NULL,
  current_repertoire VARCHAR(100),
  current_techniques TEXT,
  teaching_content TEXT NOT NULL,
  plan_completion ENUM('completed', 'partial', 'not_completed') DEFAULT 'completed',
  unfinished_reason TEXT,
  understanding_level ENUM('excellent', 'normal', 'weak'),
  practice_completion ENUM('excellent', 'normal', 'poor', 'none'),
  rhythm_sense ENUM('good', 'normal', 'weak'),
  pitch_sense ENUM('good', 'normal', 'weak'),
  fingering_stability ENUM('good', 'normal', 'weak'),
  notation_ability ENUM('good', 'normal', 'weak'),
  self_practice_ability ENUM('strong', 'normal', 'weak'),
  attitude ENUM('positive', 'normal', 'passive', 'resistant'),
  emotion_state ENUM('happy', 'stable', 'anxious', 'frustrated', 'distracted'),
  achievement_sense ENUM('obvious', 'normal', 'none'),
  frustration_level ENUM('none', 'mild', 'obvious'),
  interaction_level ENUM('active', 'normal', 'low'),
  main_difficulties TEXT,
  specific_confusion TEXT,
  teacher_judgement TEXT,
  next_solution TEXT,
  homework TEXT,
  next_lesson_suggestion TEXT,
  has_instrument ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
  mentioned_practice_inconvenience BOOLEAN DEFAULT FALSE,
  mentioned_buying_instrument BOOLEAN DEFAULT FALSE,
  asked_instrument_price BOOLEAN DEFAULT FALSE,
  practice_condition ENUM('has_instrument', 'borrowed', 'no_instrument', 'unknown') DEFAULT 'unknown',
  instrument_purchase_signal ENUM('none', 'weak', 'medium', 'strong') DEFAULT 'none',
  instrument_followup_suggestion ENUM('none', 'light_education', 'recommend_trial', 'key_followup') DEFAULT 'none',
  remaining_lessons DECIMAL(6,2),
  satisfaction_level ENUM('high', 'medium', 'low'),
  progress_feeling ENUM('obvious', 'normal', 'not_obvious'),
  renewal_signal ENUM('none', 'weak', 'medium', 'strong') DEFAULT 'none',
  churn_risk ENUM('low', 'medium', 'high') DEFAULT 'low',
  risk_reasons TEXT,
  need_academic_followup BOOLEAN DEFAULT FALSE,
  followup_suggestion TEXT,
  teacher_extra_notes TEXT,
  ai_evaluated BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ai_student_evaluations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lesson_review_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  teacher_id BIGINT NOT NULL,
  learning_score INT,
  enthusiasm_score INT,
  renewal_probability ENUM('low', 'medium', 'high'),
  instrument_purchase_probability ENUM('low', 'medium', 'high'),
  churn_risk ENUM('low', 'medium', 'high'),
  current_main_problem TEXT,
  teaching_suggestion TEXT,
  academic_followup_suggestion TEXT,
  instrument_purchase_suggestion TEXT,
  renewal_suggestion TEXT,
  next_lesson_focus TEXT,
  risk_warning TEXT,
  suggested_tags TEXT,
  suggested_followup_tasks JSON,
  raw_ai_response JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followup_tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  source_type ENUM('ai', 'manual', 'system') DEFAULT 'ai',
  source_id BIGINT,
  task_type ENUM('renewal', 'instrument_purchase', 'churn_recovery', 'trial_conversion', 'material_reminder', 'other') NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  title VARCHAR(200) NOT NULL,
  content TEXT,
  suggested_script TEXT,
  assignee_id BIGINT,
  due_date DATE,
  status ENUM('pending', 'processing', 'done', 'paused', 'closed') DEFAULT 'pending',
  followup_result TEXT,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE instrument_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  intention_status ENUM('unknown', 'contacted', 'interested', 'trialed', 'deposit_paid', 'purchased', 'delivered', 'postponed', 'abandoned') DEFAULT 'unknown',
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  preferred_model VARCHAR(100),
  recommended_instrument VARCHAR(200),
  deal_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  payment_status ENUM('unpaid', 'deposit', 'partial', 'paid') DEFAULT 'unpaid',
  delivery_status ENUM('not_selected', 'selected', 'tuned', 'delivered') DEFAULT 'not_selected',
  academic_id BIGINT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE instrument_followups (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  instrument_record_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  followup_by BIGINT,
  followup_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  content TEXT,
  next_plan TEXT,
  next_followup_date DATE
);

CREATE TABLE materials (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  material_type ENUM('enrollment_gift', 'badge', 'certificate', 'activity_gift', 'other') NOT NULL,
  stock_quantity INT DEFAULT 0,
  enable_stock BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'disabled') DEFAULT 'active',
  note TEXT
);

CREATE TABLE student_material_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  material_id BIGINT NOT NULL,
  quantity INT DEFAULT 1,
  receive_status ENUM('pending', 'received', 'delayed') DEFAULT 'pending',
  received_at DATETIME,
  issued_by BIGINT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  assessment_level ENUM('junior', 'middle', 'senior') NOT NULL,
  assessment_date DATE,
  repertoire VARCHAR(100),
  assessor_id BIGINT,
  result ENUM('pending', 'passed', 'failed', 'absent') DEFAULT 'pending',
  score DECIMAL(5,2),
  comment TEXT,
  badge_generated BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_honors (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  honor_type ENUM('badge', 'certificate', 'award', 'activity_honor') NOT NULL,
  honor_name VARCHAR(100) NOT NULL,
  assessment_id BIGINT,
  earned_at DATE,
  issue_status ENUM('pending', 'issued') DEFAULT 'pending',
  issued_at DATETIME,
  issued_by BIGINT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  payment_type ENUM('course', 'instrument') NOT NULL,
  business_id BIGINT,
  receivable_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  payment_method ENUM('wechat', 'alipay', 'cash', 'bank_transfer', 'other'),
  paid_at DATETIME,
  received_by BIGINT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teacher_review_quality (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lesson_review_id BIGINT NOT NULL,
  teacher_id BIGINT NOT NULL,
  completeness_score INT,
  detail_score INT,
  timeliness_score INT,
  usefulness_score INT,
  total_score INT,
  issues TEXT,
  manager_comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  activity_type ENUM('yaji', 'salon', 'performance', 'open_class', 'lecture', 'parent_child', 'assessment', 'other') DEFAULT 'other',
  activity_time DATETIME,
  location VARCHAR(200),
  owner_id BIGINT,
  status ENUM('planned', 'finished', 'cancelled') DEFAULT 'planned',
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_activity_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  activity_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  signup_status ENUM('signed_up', 'cancelled') DEFAULT 'signed_up',
  checkin_status ENUM('not_checked_in', 'checked_in') DEFAULT 'not_checked_in',
  participation_status ENUM('registered', 'attended', 'no_show', 'cancelled') DEFAULT 'registered',
  performed BOOLEAN DEFAULT FALSE,
  repertoire VARCHAR(100),
  feedback TEXT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO classrooms (name, capacity, status) VALUES
('一号教室', 2, 'available'),
('二号教室', 2, 'available'),
('三号教室', 2, 'available'),
('四号教室', 2, 'available'),
('五号教室', 2, 'available');

INSERT INTO materials (name, material_type, enable_stock, status) VALUES
('入学大礼包', 'enrollment_gift', FALSE, 'active'),
('初级胸章', 'badge', FALSE, 'active'),
('中级胸章', 'badge', FALSE, 'active'),
('高级胸章', 'badge', FALSE, 'active');
