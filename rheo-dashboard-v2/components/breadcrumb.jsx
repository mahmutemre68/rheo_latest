import Link from "next/link";

export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/dashboard" className="breadcrumb-link">Dashboard</Link>
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          <span className="breadcrumb-sep">/</span>
          {item.href ? (
            <Link href={item.href} className="breadcrumb-link">{item.label}</Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
