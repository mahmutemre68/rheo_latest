export function PageHeader({ eyebrow, title, description, meta = [], actions = null }) {
  const filteredMeta = meta.filter(Boolean);
  return (
    <header className="page-header">
      <div className="page-header-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        <p>{description}</p>
        {filteredMeta.length ? (
          <div className="meta-row">
            {filteredMeta.map((item, index) => (
              <span key={`${item}-${index}`} className="meta-chip">
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
