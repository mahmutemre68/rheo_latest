export function PageHeader({ eyebrow, title, description, meta = [], actions = null }) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        <p>{description}</p>
        {meta.length ? (
          <div className="meta-row">
            {meta.map((item) => (
              <span key={item} className="meta-chip">
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
