async function getSchedules() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/schedules`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.schedules ?? [];
  } catch {
    return [];
  }
}

const typeMap: Record<string, string> = {
  formal: '正式课',
  trial: '体验课',
  make_up: '补课',
  activity: '活动占用',
  other: '其他占用',
};

export default async function SchedulesPage() {
  const schedules = await getSchedules();

  return (
    <main className="container">
      <a className="badge" href="/">返回首页</a>
      <h1>排课管理</h1>
      <p className="muted">体验课和正式课都占用老师与教室，同一时间不能冲突。</p>

      <div className="card" style={{ marginTop: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 12 }}>类型</th>
              <th style={{ padding: 12 }}>学生</th>
              <th style={{ padding: 12 }}>班级</th>
              <th style={{ padding: 12 }}>教室</th>
              <th style={{ padding: 12 }}>开始</th>
              <th style={{ padding: 12 }}>结束</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule: any) => (
              <tr key={schedule.id} style={{ borderTop: '1px solid #eadccb' }}>
                <td style={{ padding: 12 }}><span className="badge">{typeMap[schedule.scheduleType] ?? schedule.scheduleType}</span></td>
                <td style={{ padding: 12 }}>{schedule.student?.name ?? '-'}</td>
                <td style={{ padding: 12 }}>{schedule.class?.name ?? '-'}</td>
                <td style={{ padding: 12 }}>{schedule.classroom?.name ?? '-'}</td>
                <td style={{ padding: 12 }}>{new Date(schedule.startTime).toLocaleString('zh-CN')}</td>
                <td style={{ padding: 12 }}>{new Date(schedule.endTime).toLocaleString('zh-CN')}</td>
                <td style={{ padding: 12 }}>{schedule.status}</td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 24 }} className="muted">暂无排课数据。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
