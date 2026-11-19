import { formatPercent } from "@/lib/format";

export function ComparisonChart({ title, description, trend }) {
  const maxValue = Math.max(...trend.current, ...trend.previous, 1);

  return (
    <section className="panel chart-panel">
      <div className="section-head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="legend-row">
          <span className="legend-item">
            <span className="legend-swatch current" />
            Bu dönem
          </span>
          <span className="legend-item">
            <span className="legend-swatch previous" />
            Önceki dönem
          </span>
        </div>
      </div>

      <div className="bar-grid">
        {trend.labels.map((label, index) => (
          <div key={label} className="bar-group">
            <div className="bars">
              <span
                className="bar previous"
                style={{ height: `${(trend.previous[index] / maxValue) * 100}%` }}
                title={`${label}: ${formatPercent(trend.previous[index])}`}
              />
              <span
                className="bar current"
                style={{ height: `${(trend.current[index] / maxValue) * 100}%` }}
                title={`${label}: ${formatPercent(trend.current[index])}`}
              />
            </div>
            <span className="bar-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SparklineChart({ title, data }) {
  const width = 320;
  const height = 120;
  const maxValue = Math.max(...data, 1);

  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - (value / maxValue) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="panel chart-panel">
      <div className="section-head">
        <div>
          <h3>{title}</h3>
          <p>Son 14 günde tamamlanma çizgisi.</p>
        </div>
      </div>

      <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <polyline fill="none" stroke="rgba(9, 93, 82, 0.2)" strokeWidth="16" points={points} />
        <polyline fill="none" stroke="var(--teal)" strokeWidth="4" strokeLinejoin="round" points={points} />
      </svg>
    </section>
  );
}
