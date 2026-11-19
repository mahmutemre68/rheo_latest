import { formatPercent } from "@/lib/format";

export function ComparisonChart({ title, description, trend }) {
  const maxValue = Math.max(...trend.current, ...trend.previous, 0.01);

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
                style={{
                  height: `${(trend.current[index] / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
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
  const maxValue = Math.max(...data, 0.01);

  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - (value / maxValue) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <section className="panel chart-panel">
      <div className="section-head">
        <div>
          <h3>{title}</h3>
          <p>Son 14 günde tamamlanma çizgisi.</p>
        </div>
      </div>

      <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.3)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </linearGradient>
          <linearGradient id="sparkStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
        <polygon fill="url(#sparkFill)" points={areaPoints} opacity="0.6" />
        <polyline fill="none" stroke="url(#sparkStroke)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={points} />
        {data.length > 0 && (
          <circle
            cx={(data.length - 1) / Math.max(data.length - 1, 1) * width}
            cy={height - (data[data.length - 1] / maxValue) * (height - 12) - 6}
            r="5"
            fill="#2dd4bf"
            stroke="#0a0e1a"
            strokeWidth="2"
          />
        )}
      </svg>
    </section>
  );
}
