const stats = [
  ['今日课程', '12'],
  ['待复盘', '4'],
  ['购琴机会', '6'],
  ['续课提醒', '8'],
  ['待发礼包', '3'],
  ['待发胸章', '5'],
];

const modules = [
  ['学生管理', '线索、体验课、正式学员和成长档案', '/students'],
  ['排课管理', '5 个教室、老师时间和班级冲突校验', '/schedules'],
  ['课后复盘', '老师每节课后填写教学观察和学生状态', '/schedules'],
  ['AI 评估', '生成教学建议、购琴建议、续课建议和流失风险', '/followup-tasks'],
  ['教务跟进', '承接 AI 任务，推进续课、购琴和流失挽回', '/followup-tasks'],
  ['物料荣誉', '入学礼包、初中高级考核与胸章发放', '/students'],
];

export default function HomePage() {
  return (
    <main className="container">
      <section style={{ marginBottom: 28 }}>
        <span className="badge">MVP 控制台</span>
        <h1 style={{ fontSize: 40, margin: '16px 0 8px' }}>古琴教学点管理系统</h1>
        <p className="muted">覆盖售前、排课、课后复盘、AI 学员评估、购琴续课、物料考核和学员成长档案。</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <a className="button" href="/students">学生管理</a>
          <a className="button" href="/schedules">排课管理</a>
          <a className="button" href="/followup-tasks">教务跟进</a>
        </div>
      </section>

      <section className="grid grid-3" style={{ marginBottom: 28 }}>
        {stats.map(([label, value]) => (
          <div className="card" key={label}>
            <div className="muted">{label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-3">
        {modules.map(([title, desc, href]) => (
          <a className="card" key={title} href={href}>
            <h2 style={{ marginTop: 0 }}>{title}</h2>
            <p className="muted">{desc}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
