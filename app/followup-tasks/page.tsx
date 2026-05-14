async function getTasks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/followup-tasks`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tasks ?? [];
  } catch {
    return [];
  }
}

const taskTypeMap: Record<string, string> = {
  renewal: '续课',
  instrument_purchase: '购琴',
  churn_recovery: '流失挽回',
  trial_conversion: '体验转化',
  material_reminder: '物料提醒',
  other: '其他',
};

export default async function FollowupTasksPage() {
  const tasks = await getTasks();

  return (
    <main className="container">
      <a className="badge" href="/">返回首页</a>
      <h1>教务跟进中心</h1>
      <p className="muted">承接 AI 评估生成的续课、购琴、流失挽回和体验转化任务。</p>

      <div className="grid" style={{ marginTop: 20 }}>
        {tasks.map((task: any) => (
          <div className="card" key={task.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <span className="badge">{taskTypeMap[task.taskType] ?? task.taskType}</span>
                <h2 style={{ marginBottom: 6 }}>{task.title}</h2>
                <div className="muted">学生：{task.student?.name ?? '-'}</div>
              </div>
              <div className="badge">{task.priority}</div>
            </div>
            <p>{task.content}</p>
            {task.suggestedScript && (
              <div style={{ background: '#f7f3ec', borderRadius: 12, padding: 12 }}>
                <strong>建议话术：</strong>
                <p className="muted" style={{ marginBottom: 0 }}>{task.suggestedScript}</p>
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && <div className="card muted">暂无待跟进任务。</div>}
      </div>
    </main>
  );
}
