import Link from "next/link";

import { formatDate, formatInteger, formatPercent, formatRelativeDays } from "@/lib/format";
import { ProgressBar, StatusPill } from "@/components/overview-panels";

export function CurriculumTable({ rows }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h3>Müfredat İlerleme Haritası</h3>
          <p>Konu bazında atama, tamamlama ve doğruluk görünümü.</p>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Konu</th>
            <th>Atanan</th>
            <th>Tamamlanan</th>
            <th>Doğruluk</th>
            <th>Kapsama</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.classId}-${row.topicId}`}>
              <td>
                <div className="table-primary">
                  <strong>{row.topicName}</strong>
                  <span>{row.className ?? row.classId}</span>
                </div>
              </td>
              <td>{formatInteger(row.assignedCount)}</td>
              <td>{formatInteger(row.completedCount)}</td>
              <td>{formatPercent(row.avgAccuracy)}</td>
              <td>
                <div className="coverage-cell">
                  <ProgressBar value={row.coveragePercent} />
                  <span>{formatPercent(row.coveragePercent)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function PriorityStudentsTable({ students }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h3>Müdahale Gerektiren Öğrenciler</h3>
          <p>Risk skoruna göre sıralanmış kısa öğretmen listesi.</p>
        </div>
        <Link className="text-link" href="/students?risk=warning">
          Tüm öğrencileri aç
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Öğrenci</th>
            <th>Son aktiflik</th>
            <th>Geciken</th>
            <th>Risk</th>
            <th>Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <div className="table-primary">
                  <strong>{student.name}</strong>
                  <span>{student.focusTopic}</span>
                </div>
              </td>
              <td>{formatRelativeDays(student.daysSinceActive)}</td>
              <td>{formatInteger(student.overdueAssignments)}</td>
              <td>
                <StatusPill status={student.status} />
              </td>
              <td>
                <Link className="text-link" href={`/students/${student.id}`}>
                  Detayı aç
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function StudentsTable({ students, showClass = true }) {
  return (
    <section className="panel">
      <table className="data-table">
        <thead>
          <tr>
            <th>Öğrenci</th>
            {showClass ? <th>Sınıf</th> : null}
            <th>Son aktiflik</th>
            <th>Tamamlama</th>
            <th>Geciken</th>
            <th>Risk</th>
            <th>Odak konu</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <div className="table-primary">
                  <Link className="text-link strong-link" href={`/students/${student.id}`}>
                    {student.name}
                  </Link>
                  <span>{formatInteger(student.xp)} XP</span>
                </div>
              </td>
              {showClass ? <td>{student.className}</td> : null}
              <td>{formatRelativeDays(student.daysSinceActive)}</td>
              <td>{formatPercent(student.completionRate)}</td>
              <td>{formatInteger(student.overdueAssignments)}</td>
              <td>
                <StatusPill status={student.status} />
              </td>
              <td>{student.focusTopic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function AssignmentBoard({ buckets, showCompleted = false }) {
  const sections = [
    { key: "upcoming", title: "Yaklaşan", items: buckets.upcoming ?? [] },
    { key: "today", title: "Bugün Son", items: buckets.today ?? [] },
    { key: "overdue", title: "Gecikmiş", items: buckets.overdue ?? [] }
  ];

  if (showCompleted) {
    sections.push({ key: "completed", title: "Tamamlanan", items: buckets.completed ?? [] });
  }

  return (
    <section className="assignment-board">
      {sections.map((section) => (
        <article key={section.key} className="panel assignment-column">
          <div className="section-head">
            <div>
              <h3>{section.title}</h3>
              <p>{section.items.length} ödev</p>
            </div>
          </div>

          <div className="assignment-list">
            {section.items.length ? (
              section.items.map((assignment) => (
                <div key={assignment.id} className="assignment-card">
                  <div className="assignment-card-top">
                    <div>
                      <strong>{assignment.title}</strong>
                      <span>{assignment.className}</span>
                    </div>
                    <span className="topic-chip">{assignment.topicTags[0]}</span>
                  </div>
                  <p>
                    Son tarih <strong>{formatDate(assignment.dueAt)}</strong> · Tamamlama{" "}
                    <strong>{formatPercent(assignment.completionRate)}</strong>
                  </p>
                  <div className="assignment-meta">
                    <span>Ort. doğruluk {formatPercent(assignment.averageAccuracy)}</span>
                    <Link
                      className="text-link"
                      href={`/students?classId=${assignment.classId}&assignmentId=${assignment.id}`}
                    >
                      Tamamlamayanları gör
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="subtle-empty">
                <p>Bu sütunda gösterilecek ödev yok.</p>
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

export function ClassesMatrix({ classes }) {
  return (
    <section className="panel">
      <table className="data-table">
        <thead>
          <tr>
            <th>Sınıf</th>
            <th>Seviye</th>
            <th>Aktif öğrenci</th>
            <th>Son ödev tamamlama</th>
            <th>Risk</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="table-primary">
                  <strong>{item.name}</strong>
                  <span>{item.curriculumTrack}</span>
                </div>
              </td>
              <td>{item.gradeBand}</td>
              <td>
                {formatInteger(item.activeStudents)}/{formatInteger(item.studentCount)}
              </td>
              <td>{formatPercent(item.report.completionRate)}</td>
              <td>{formatInteger(item.atRiskStudents)} öğrenci</td>
              <td>
                <Link className="text-link" href={`/classes/${item.id}`}>
                  Raporu aç
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
