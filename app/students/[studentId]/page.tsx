async function getStudent(studentId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/students/${studentId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.student;
  } catch {
    return null;
  }
}

export default async function StudentDetailPage(props: { params: { studentId: string } }) {
  const student = await getStudent(props.params.studentId);

  if (!student) {
    return <main className="container"><a className="badge" href="/students">返回学生列表</a><h1>学生不存在</h1></main>;
  }

  const balance = student.courseBalances?.[0];

  return (
    <main className="container">
      <a className="badge" href="/students">返回学生列表</a>
      <h1>{student.name} 的学员成长档案</h1>
      <p className="muted">售前、课程、复盘、AI 评估、购琴续课和荣誉物料统一沉淀。</p>

      <section className="grid grid-3" style={{ marginTop: 20 }}>
        <div className="card"><div className="muted">主状态</div><h2>{student.mainStatus}</h2></div>
        <div className="card"><div className="muted">剩余课时</div><h2>{balance?.remainingLessons ?? 0}</h2></div>
        <div className="card"><div className="muted">购琴状态</div><h2>{student.instrumentStatus}</h2></div>
      </section>

      <section className="grid" style={{ marginTop: 20 }}>
        <div className="card">
          <h2>基础信息</h2>
          <p>手机号：{student.phone ?? '-'}</p>
          <p>微信：{student.wechat ?? '-'}</p>
          <p>来源：{student.sourceChannel ?? '-'}</p>
          <p>备注：{student.note ?? '-'}</p>
        </div>

        <div className="card">
          <h2>最近课后复盘</h2>
          {student.lessonReviews?.map((review: any) => (
            <div key={review.id} style={{ borderTop: '1px solid #eadccb', padding: '12px 0' }}>
              <strong>{review.currentRepertoire ?? '未填写曲目'}</strong>
              <p className="muted">{review.teachingContent}</p>
              <p>下节建议：{review.nextLessonSuggestion ?? '-'}</p>
            </div>
          ))}
          {student.lessonReviews?.length === 0 && <p className="muted">暂无复盘记录。</p>}
        </div>

        <div className="card">
          <h2>AI 学员评估</h2>
          {student.evaluations?.map((evaluation: any) => (
            <div key={evaluation.id} style={{ borderTop: '1px solid #eadccb', padding: '12px 0' }}>
              <span className="badge">续课：{evaluation.renewalProbability ?? '-'}</span>{' '}
              <span className="badge">购琴：{evaluation.instrumentPurchaseProbability ?? '-'}</span>{' '}
              <span className="badge">风险：{evaluation.churnRisk ?? '-'}</span>
              <p>{evaluation.teachingSuggestion}</p>
            </div>
          ))}
          {student.evaluations?.length === 0 && <p className="muted">暂无 AI 评估。</p>}
        </div>

        <div className="card">
          <h2>教务跟进任务</h2>
          {student.followupTasks?.map((task: any) => (
            <div key={task.id} style={{ borderTop: '1px solid #eadccb', padding: '12px 0' }}>
              <strong>{task.title}</strong>
              <p className="muted">{task.content}</p>
            </div>
          ))}
          {student.followupTasks?.length === 0 && <p className="muted">暂无跟进任务。</p>}
        </div>
      </section>
    </main>
  );
}
