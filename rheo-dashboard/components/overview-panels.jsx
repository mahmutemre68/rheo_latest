import Link from "next/link";

import {
  formatDateTime,
  formatDelta,
  formatInteger,
  formatPercent,
  formatRelativeDays
} from "@/lib/format";

export function StatCard({ label, value, delta, tone = "navy", kind = "percent" }) {
  const formattedValue = kind === "count" ? formatInteger(value) : formatPercent(value);
  const deltaClass = delta >= 0 ? "positive" : "negative";

  return (
    <article className={`stat-card tone-${tone}`}>
      <p className="stat-label">{label}</p>
      <strong>{formattedValue}</strong>
      <span className={`delta-chip ${deltaClass}`}>{formatDelta(delta)}</span>
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

export function EmptyStatePanel({ title, description, ctaLabel, href }) {
  return (
    <section className="panel empty-panel">
      <div>
        <p className="eyebrow">Boş Durum</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {ctaLabel && href ? (
        <Link className="button button-primary" href={href}>
          {ctaLabel}
        </Link>
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
        <p>
          MVP sürümünde okul yöneticisi ve öğrenci rolleri desteklenmiyor. Demo için URL’den
          `role=teacher` bağlamı kullanılmalı.
        </p>
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
      <Link className="button button-secondary" href="/dashboard">
        Dashboard’a dön
      </Link>
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
      <Link className="button button-primary" href={href}>
        {ctaLabel}
      </Link>
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
