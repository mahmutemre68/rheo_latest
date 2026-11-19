export function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonChart() {
  return <div className="skeleton skeleton-chart" />;
}

export function SkeletonLine({ width = "full" }) {
  const cls = width === "short" ? "short" : width === "medium" ? "medium" : "";
  return <div className={`skeleton skeleton-line ${cls}`} />;
}

export function SkeletonTable({ rows = 4, cols = 5 }) {
  return (
    <section className="panel">
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 4 }}>
        <SkeletonLine width="short" />
        <SkeletonLine width="medium" />
      </div>
      <div style={{ marginTop: 16 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonLine key={j} width={j === 0 ? "medium" : "short"} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkeletonStats({ count = 4 }) {
  return (
    <section className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="page-stack">
      <div className="skeleton skeleton-card" style={{ height: 140 }} />
      <div className="skeleton" style={{ height: 60, borderRadius: "var(--radius-lg)" }} />
      <SkeletonStats />
      <div className="content-grid">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable rows={4} cols={5} />
    </div>
  );
}
