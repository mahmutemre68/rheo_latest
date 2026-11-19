import Link from "next/link";
import { InfoPanel, StatusPill, UnauthorizedPanel, NotFoundPanel, ProgressBar } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { getAssignmentDetail, getViewerRole } from "@/lib/data";
import { formatDate, formatPercent, formatInteger, formatDateTime } from "@/lib/format";

export default function AssignmentDetailPage({ params, searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const detail = getAssignmentDetail(params.assignmentId);

  if (!detail) {
    return (
      <NotFoundPanel
        title="Ödev bulunamadı"
        description="İstenen ödev demo veri kümesinde yer almıyor."
      />
    );
  }

  const { assignment, submissions } = detail;
  const completedCount = submissions.filter(s => s.status === "completed").length;
  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const lateCount = submissions.filter(s => s.status === "late").length;

  return (
    <div className="page-stack">
      <Breadcrumb items={[
        { label: "Ödevler", href: "/assignments" },
        { label: assignment.title }
      ]} />

      <PageHeader
        eyebrow="Ödev Detayı"
        title={assignment.title}
        description={`${assignment.className} sınıfı · Son tarih: ${formatDate(assignment.dueAt)}`}
        meta={[assignment.topicTags.join(" · "), assignment.bucket === "overdue" ? "⚠ Gecikmiş" : ""]}
      />

      <section className="stats-grid">
        <InfoPanel title="Tamamlama" value={formatPercent(assignment.completionRate)} caption="Genel oran" />
        <InfoPanel title="Doğruluk" value={formatPercent(assignment.averageAccuracy)} caption="Ortalama" />
        <InfoPanel title="Teslim eden" value={formatInteger(completedCount)} caption={`/ ${submissions.length} öğrenci`} />
        <InfoPanel title="Geciken" value={formatInteger(lateCount + pendingCount)} caption="Öğrenci" />
      </section>

      {/* Tamamlama Progress */}
      <section className="panel">
        <div className="section-head">
          <div>
            <h3>Genel İlerleme</h3>
            <p>Sınıfın toplam teslim durumu.</p>
          </div>
          <span className={`status-pill status-${assignment.bucket === "overdue" ? "at_risk" : assignment.bucket === "completed" ? "on_track" : "warning"}`}>
            {assignment.bucket === "overdue" ? "Gecikmiş" : assignment.bucket === "completed" ? "Tamamlandı" : assignment.bucket === "today" ? "Bugün son" : "Yaklaşan"}
          </span>
        </div>
        <div className="progress-shell" style={{ height: 14 }}>
          <span className="progress-fill high" style={{ width: `${Math.round(assignment.completionRate * 100)}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "0.82rem", color: "var(--text-muted)" }}>
          <span>{completedCount} teslim edildi</span>
          <span>{pendingCount} bekliyor · {lateCount} gecikmiş</span>
        </div>
      </section>

      {/* Öğrenci Bazlı Teslim Tablosu */}
      <section className="panel">
        <div className="section-head">
          <div>
            <h3>Öğrenci Bazlı Durum</h3>
            <p>Her öğrencinin bu ödeve ait teslim bilgisi.</p>
          </div>
          <button className="button button-secondary" style={{ cursor: "default", opacity: 0.6 }}>
            📩 Hatırlatma Gönder
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Öğrenci</th>
              <th>Durum</th>
              <th>Doğruluk</th>
              <th>Deneme</th>
              <th>Teslim Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.studentId}>
                <td>
                  <Link href={`/students/${sub.studentId}`} className="table-primary">
                    <strong>{sub.studentName}</strong>
                    <small>{sub.className}</small>
                  </Link>
                </td>
                <td>
                  <StatusPill status={sub.status === "completed" ? "on_track" : sub.status === "late" ? "at_risk" : "warning"} />
                </td>
                <td>{sub.accuracy > 0 ? formatPercent(sub.accuracy) : "—"}</td>
                <td>{sub.attempts > 0 ? sub.attempts : "—"}</td>
                <td style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                  {sub.submittedAt ? formatDateTime(sub.submittedAt) : "Henüz teslim edilmedi"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Konular */}
      <section className="panel">
        <div className="section-head">
          <div>
            <h3>İlgili Konular</h3>
            <p>Bu ödevin kapsadığı müfredat konuları.</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {assignment.topicTags.map(tag => (
            <span key={tag} className="topic-chip">{tag}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
