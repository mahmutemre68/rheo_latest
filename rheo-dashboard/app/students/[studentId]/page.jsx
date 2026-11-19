import { SparklineChart } from "@/components/charts";
import { InfoPanel, NotFoundPanel, StatusPill, StudentStory, UnauthorizedPanel } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { getStudentDetail, getViewerRole } from "@/lib/data";
import { formatDate, formatInteger, formatPercent } from "@/lib/format";

export default function StudentDetailPage({ params, searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const detail = getStudentDetail(params.studentId);

  if (!detail) {
    return (
      <NotFoundPanel
        title="Öğrenci bulunamadı"
        description="İstenen öğrenci demo veri kümesinde yer almıyor."
      />
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Öğrenci Hikayesi"
        title={detail.student.name}
        description="Tek öğrencide hangi konu geride, hangi ödev kaçırılmış ve son 14 günde nasıl ilerlemiş görünür."
        meta={[detail.classroom.name]}
      />

      <StudentStory student={detail.student} classroom={detail.classroom} />

      <section className="stats-grid">
        <InfoPanel title="Tamamlama" value={formatPercent(detail.student.completionRate)} caption="Genel oran" />
        <InfoPanel title="Geciken ödev" value={formatInteger(detail.student.overdueAssignments)} caption="Adet" />
        <InfoPanel title="Risk skoru" value={formatInteger(detail.student.score)} caption="Hesaplanan skor" />
        <InfoPanel title="Durum" value={<StatusPill status={detail.student.status} />} caption="Müdahale seviyesi" />
      </section>

      <div className="content-grid">
        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Konu Bazlı Durum</h3>
              <p>Öğrencinin hangi konuda geride kaldığını hızlı gör.</p>
            </div>
          </div>

          <div className="mastery-list">
            {detail.student.topicMastery.map((topic) => (
              <div key={topic.topicId} className="mastery-item">
                <div className="mastery-copy">
                  <strong>{topic.topicName}</strong>
                  <span>{formatPercent(topic.masteryPercent)}</span>
                </div>
                <div className="progress-shell">
                  <span className="progress-fill" style={{ width: `${Math.round(topic.masteryPercent * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <SparklineChart title="Son 14 Gün İlerlemesi" data={detail.student.history} />
      </div>

      <section className="panel">
        <div className="section-head">
          <div>
            <h3>Kaçırılan ve Bekleyen Ödevler</h3>
            <p>Ders sonrası öğretmen müdahalesi için kritik liste.</p>
          </div>
        </div>

        <div className="assignment-list">
          {detail.assignments.length ? (
            detail.assignments.map((assignment) => (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-card-top">
                  <div>
                    <strong>{assignment.title}</strong>
                    <span>{assignment.topicTags.join(" · ")}</span>
                  </div>
                  <span className="topic-chip">{assignment.className}</span>
                </div>
                <p>Son tarih {formatDate(assignment.dueAt)}</p>
              </div>
            ))
          ) : (
            <div className="subtle-empty">
              <p>Bu öğrenci için açık gecikme görünmüyor.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
