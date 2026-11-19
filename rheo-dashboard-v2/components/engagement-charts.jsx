import Link from "next/link";
import { formatInteger, formatPercent } from "@/lib/format";

export function DonutChart({ segments, centerLabel, centerValue }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let accumulated = 0;

  const size = 140;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="donut-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashLen = pct * circumference;
          const offset = -(accumulated * circumference) + circumference * 0.25;
          accumulated += pct;
          return (
            <circle
              key={i}
              cx={size/2} cy={size/2} r={radius}
              fill="none" stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 600ms var(--ease-out)", animationDelay: `${i * 100}ms` }}
            />
          );
        })}
        <text x={size/2} y={size/2 - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="1.5rem" fontWeight="700">
          {centerValue}
        </text>
        <text x={size/2} y={size/2 + 14} textAnchor="middle" fill="var(--text-muted)" fontSize="0.7rem">
          {centerLabel}
        </text>
      </svg>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <div key={i} className="donut-legend-item">
            <span className="donut-dot" style={{ background: seg.color }} />
            <span className="donut-legend-label">{seg.label}</span>
            <strong>{seg.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Leaderboard({ students, title = "Haftalık Lider Tablosu" }) {
  const top5 = [...students]
    .filter(s => s.hasProgress)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  const medals = ["🥇", "🥈", "🥉", "4", "5"];

  return (
    <section className="panel leaderboard-panel">
      <div className="section-head">
        <div>
          <h3>{title}</h3>
          <p>XP bazlı sıralama</p>
        </div>
      </div>
      <div className="leaderboard-list">
        {top5.map((student, i) => (
          <Link key={student.id} href={`/students/${student.id}`} className="leaderboard-row">
            <span className="leaderboard-rank">{medals[i]}</span>
            <div className="leaderboard-info">
              <strong>{student.name}</strong>
              <span>{student.streakDays > 0 ? `🔥 ${student.streakDays} gün streak` : "Streak yok"}</span>
            </div>
            <div className="leaderboard-stats">
              <span className="leaderboard-xp">{formatInteger(student.xp)} XP</span>
              <span className="leaderboard-acc">{formatPercent(student.recentAccuracy)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function EngagementPanel({ students, className }) {
  const onTrack = students.filter(s => s.status === "on_track").length;
  const warning = students.filter(s => s.status === "warning").length;
  const atRisk = students.filter(s => s.status === "at_risk").length;
  const pending = students.filter(s => s.status === "pending").length;
  const total = students.length;

  const segments = [
    { label: "Takipte", value: onTrack, color: "var(--green-400)" },
    { label: "Uyarı", value: warning, color: "var(--amber-400)" },
    { label: "Riskli", value: atRisk, color: "var(--coral-400)" },
    { label: "Bekliyor", value: pending, color: "var(--text-muted)" }
  ].filter(s => s.value > 0);

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h3>Sınıf Sağlık Durumu</h3>
          <p>{className || "Öğrenci risk dağılımı"}</p>
        </div>
      </div>
      <DonutChart
        segments={segments}
        centerValue={total}
        centerLabel="öğrenci"
      />
    </section>
  );
}
