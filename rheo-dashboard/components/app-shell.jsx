"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/dashboard", label: "Dashboard", eyebrow: "Rapor Merkezi" },
  { href: "/classes", label: "Sınıflar", eyebrow: "Yapı ve Akış" },
  { href: "/students", label: "Öğrenciler", eyebrow: "Müdahale Listesi" },
  { href: "/assignments", label: "Ödevler", eyebrow: "Teslim Takibi" },
  { href: "/reports", label: "Raporlar", eyebrow: "PDF ve Arşiv" }
];

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="brand-kicker">Rheo K-12</p>
          <h1>Öğretmen Dashboard</h1>
          <p className="brand-copy">
            Haftalık rapor, müfredat görünürlüğü ve müdahale gerektiren öğrenciler tek merkezde.
          </p>
        </div>

        <nav className="sidebar-nav" aria-label="Ana navigasyon">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${active ? " active" : ""}`}
              >
                <span className="nav-kicker">{item.eyebrow}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <p className="foot-label">MVP Prensibi</p>
          <p className="foot-copy">
            30 saniyede sınıf durumu, geciken ödevler ve riskli öğrenciler görünür olmalı.
          </p>
        </div>
      </aside>

      <main className="content-shell">{children}</main>
    </div>
  );
}
