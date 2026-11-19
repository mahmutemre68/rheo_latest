import Link from "next/link";
import { SparklineChart } from "@/components/charts";
import { InfoPanel, NotFoundPanel, StatusPill, StudentStory, UnauthorizedPanel } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { TeacherNotes } from "@/components/teacher-notes";
import { getStudentDetail, getViewerRole } from "@/lib/data";
import { formatDate, formatInteger, formatPercent } from "@/lib/format";

function masteryLevel(percent) {
  if (percent < 0.5) return "low";
  if (percent < 0.7) return "mid";
  return "high";
}

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

  const weakest = detail.student.topicMastery.length
    ? [...detail.student.topicMastery].sort((a, b) => a.masteryPercent - b.masteryPercent)[0]
    : null;

  return (
    <div className="page-stack">
      <Breadcrumb items={[
        { label: "Öğrenciler", href: "/students" },
        { label: detail.student.name }
      ]} />

      <PageHeader
        eyebrow="Öğrenci Hikayesi"
        title={detail.student.name}
        description="Tek öğrencide hangi konu geride, hangi ödev kaçırılmış ve son 14 günde nasıl ilerlemiş görünür."
        meta={[detail.classroom.name, detail.student.status === "at_risk" ? "⚠ Müdahale gerekli" : ""]}
      />

      <StudentStory student={detail.student} classroom={detail.classroom} />

      {/* Gamification Card */}
      <section className="panel gamification-card">
        <div className="gamification-grid">
          <div className="gamification-item">
            <span className="gamification-icon">⚡</span>
            <div>
              <strong>{formatInteger(detail.student.xp)} XP</strong>
              <span>Toplam deneyim puanı</span>
            </div>
          </div>
          <div className="gamification-item">
            <span className="gamification-icon">{detail.student.streakDays > 0 ? "🔥" : "❄️"}</span>
            <div>
              <strong>{detail.student.streakDays} gün streak</strong>
              <span>{detail.student.streakBroken ? "Kırıldı" : "Devam ediyor"}</span>
            </div>
          </div>
          <div className="gamification-item">
            <span className="gamification-icon">🎯</span>
            <div>
              <strong>{formatPercent(detail.student.recentAccuracy)}</strong>
              <span>Son doğruluk oranı</span>
            </div>
          </div>
          <div className="gamification-item">
            <span className="gamification-icon">{detail.student.duelLossStreak >= 3 ? "🚩" : "⚔️"}</span>
            <div>
              <strong>{detail.student.duelLossStreak} kayıp serisi</strong>
              <span>Düello durumu</span>
            </div>
          </div>
        </div>
      </section>

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
            {detail.student.topicMastery.map((topic) => {
              const level = masteryLevel(topic.masteryPercent);
              return (
                <div key={topic.topicId} className="mastery-item">
                  <div className="mastery-copy">
                    <strong>{topic.topicName}</strong>
                    <span>{formatPercent(topic.masteryPercent)}</span>
                  </div>
                  <div className="progress-shell">
                    <span className={`progress-fill ${level}`} style={{ width: `${Math.round(topic.masteryPercent * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <SparklineChart title="Son 14 Gün İlerlemesi" data={detail.student.history} />
      </div>

      {weakest && weakest.masteryPercent < 0.6 ? (
        <section className="panel action-panel">
          <div>
            <p className="eyebrow">Öneri</p>
            <h3>{weakest.topicName} konusunda takviye ödevi önerilir</h3>
            <p>{detail.student.name} bu konuda %{Math.round(weakest.masteryPercent * 100)} seviyesinde. Kısa bir tekrar ödevi atayarak pekiştirme sağlayabilirsiniz.</p>
          </div>
          <Link className="button button-primary" href={`/assignments/new?classId=${detail.student.classId}`}>
            Ödev oluştur
          </Link>
        </section>
      ) : null}

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
                <p>Son tarih <strong>{formatDate(assignment.dueAt)}</strong></p>
              </div>
            ))
          ) : (
            <div className="subtle-empty">
              <p>Bu öğrenci için açık gecikme görünmüyor. 👏</p>
            </div>
          )}
        </div>
      </section>

      <TeacherNotes studentId={detail.student.id} studentName={detail.student.name} />
    </div>
  );
}
