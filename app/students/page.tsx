async function getStudents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/students`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.students ?? [];
  } catch {
    return [];
  }
}

const statusMap: Record<string, string> = {
  pre_sale: '售前跟进',
  studying: '在学',
  paused: '暂停',
  finished: '结课',
  refunded: '退费',
  lost: '流失',
};

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <main className="container">
      <a className="badge" href="/">返回首页</a>
      <h1>学生管理</h1>
      <p className="muted">管理售前线索、体验课、正式学员和学员成长档案。</p>

      <div className="card" style={{ marginTop: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 12 }}>姓名</th>
              <th style={{ padding: 12 }}>手机号</th>
              <th style={{ padding: 12 }}>来源</th>
              <th style={{ padding: 12 }}>状态</th>
              <th style={{ padding: 12 }}>购琴状态</th>
              <th style={{ padding: 12 }}>待跟进</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student.id} style={{ borderTop: '1px solid #eadccb' }}>
                <td style={{ padding: 12, fontWeight: 700 }}>{student.name}</td>
                <td style={{ padding: 12 }}>{student.phone ?? '-'}</td>
                <td style={{ padding: 12 }}>{student.sourceChannel ?? '-'}</td>
                <td style={{ padding: 12 }}><span className="badge">{statusMap[student.mainStatus] ?? student.mainStatus}</span></td>
                <td style={{ padding: 12 }}>{student.instrumentStatus ?? '-'}</td>
                <td style={{ padding: 12 }}>{student.followupTasks?.length ?? 0}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 24 }} className="muted">暂无学生数据。请先配置数据库并运行种子脚本。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
