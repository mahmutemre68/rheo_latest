import Link from "next/link";
import {
  formatDateTime,
  formatDelta,
  formatInteger,
  formatPercent,
  formatRelativeDays
} from "@/lib/format";

export function WelcomeBanner({ teacherName, todayDueCount, overdueCount, atRiskCount, urgentStudent }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";
  const firstName = teacherName?.split(" ")[0] || "Öğretmen";

  return (
    <section className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-greeting">
          <h2>{greeting}, {firstName}! 👋</h2>
          <p className="welcome-summary">
            {todayDueCount > 0 && <span>Bugün <strong>{todayDueCount} ödev</strong> son gün. </span>}
            {overdueCount > 0 && <span><strong>{overdueCount} gecikmiş</strong> ödev var. </span>}
            {atRiskCount > 0 && <span><strong>{atRiskCount} riskli</strong> öğrenci takip bekliyor.</span>}
            {todayDueCount === 0 && overdueCount === 0 && atRiskCount === 0 && (
              <span>Bugün her şey yolunda! Tüm öğrenciler takipte. 🎉</span>
            )}
          </p>
          {urgentStudent && (
            <p className="welcome-urgent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              En acil: <strong>{urgentStudent.name}</strong> — {urgentStudent.daysSinceActive} gündür inaktif, {urgentStudent.overdueAssignments} geciken ödev
            </p>
          )}
        </div>
        <div className="welcome-actions">
          <Link className="button button-primary" href="/students?risk=at_risk">
            Riskli Öğrenciler
          </Link>
          <Link className="button button-secondary" href="/reports">
            Rapor İndir
          </Link>
        </div>
      </div>
    </section>
  );
}

const toneIcons = {
  teal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  navy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  amber: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  coral: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
};

export function StatCard({ label, value, delta, tone = "navy", kind = "percent" }) {
  const formattedValue = kind === "count" ? formatInteger(value) : formatPercent(value);
  const deltaClass = delta >= 0 ? "positive" : "negative";

  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon-badge">
        {toneIcons[tone] || toneIcons.navy}
      </div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <strong>{formattedValue}</strong>
        <span className={`delta-chip ${deltaClass}`}>{formatDelta(delta)}</span>
      </div>
    </article>
  );
}

export function StatusPill({ status }) {
  const copy = {
    on_track: "Takipte",
    warning: "Uyarı",
    at_risk: "Riskli",
    pending: "Veri bekleniyor"
  };
  return <span className={`status-pill status-${status}`}>{copy[status] ?? status}</span>;
}

export function ProgressBar({ value }) {
  return (
    <div className="progress-shell" aria-hidden="true">
      <span className="progress-fill" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

export function EmptyStatePanel({ title, description, ctaLabel, href, type }) {
  const icons = {
    no_classes: "🏫",
    no_assignments: "📋",
    no_progress: "⏳",
    default: "📭"
  };

  return (
    <section className="panel empty-panel">
      <div className="empty-illustration">{icons[type] || icons.default}</div>
      <div>
        <p className="eyebrow">Boş Durum</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {ctaLabel && href ? (
        <Link className="button button-primary" href={href} style={{ marginTop: 16 }}>{ctaLabel}</Link>
      ) : null}
    </section>
  );
}

export function UnauthorizedPanel() {
  return (
    <section className="panel empty-panel">
      <div>
        <p className="eyebrow">Rol Erişimi</p>
        <h3>Bu panel yalnızca öğretmen rolü için açık</h3>
        <p>MVP sürümünde okul yöneticisi ve öğrenci rolleri desteklenmiyor.</p>
      </div>
    </section>
  );
}

export function NotFoundPanel({ title, description }) {
  return (
    <section className="panel empty-panel">
      <div>
        <p className="eyebrow">Bulunamadı</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Link className="button button-secondary" href="/dashboard">Dashboard'a dön</Link>
    </section>
  );
}

export function InsightPanel({ title, description, ctaLabel, href }) {
  return (
    <section className="panel action-panel">
      <div>
        <p className="eyebrow">Öğretmen Aksiyon Kutusu</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Link className="button button-primary" href={href}>{ctaLabel}</Link>
    </section>
  );
}

export function InfoPanel({ title, value, caption }) {
  return (
    <article className="panel compact-panel">
      <p className="stat-label">{title}</p>
      <div className="info-value">{value}</div>
      <span>{caption}</span>
    </article>
  );
}

export function StudentStory({ student, classroom }) {
  return (
    <section className="panel story-panel">
      <div>
        <p className="eyebrow">{classroom.name}</p>
        <h3>{student.name}</h3>
        <p>
          Son aktiflik {formatRelativeDays(student.daysSinceActive)}. Öğrenci şu an en çok{" "}
          <strong>{student.focusTopic}</strong> konusunda desteğe ihtiyaç duyuyor.
        </p>
      </div>
      <div className="story-facts">
        <div>
          <span>XP</span>
          <strong>{formatInteger(student.xp)}</strong>
        </div>
        <div>
          <span>Streak</span>
          <strong>{formatInteger(student.streakDays)} gün</strong>
        </div>
        <div>
          <span>Son güncelleme</span>
          <strong>{formatDateTime(student.lastActiveAt)}</strong>
        </div>
      </div>
    </section>
  );
}
