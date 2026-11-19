"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNotifications } from "@/lib/data";
import { NotificationBell, NotificationPanel } from "@/components/notification-panel";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    eyebrow: "Rapor Merkezi",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="4" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="11" width="7" height="10" rx="1" />
      </svg>
    )
  },
  {
    href: "/classes",
    label: "Sınıflar",
    eyebrow: "Yapı ve Akış",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  },
  {
    href: "/students",
    label: "Öğrenciler",
    eyebrow: "Müdahale Listesi",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    href: "/assignments",
    label: "Ödevler",
    eyebrow: "Teslim Takibi",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )
  },
  {
    href: "/reports",
    label: "Raporlar",
    eyebrow: "PDF ve Arşiv",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    href: "/settings",
    label: "Ayarlar",
    eyebrow: "Profil ve Tercih",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const { unreadCount } = getNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-avatar">
            <div className="avatar-circle">MK</div>
            <div className="avatar-info">
              <strong>Merve Kaya</strong>
              <span>Öğretmen</span>
            </div>
            <NotificationBell unreadCount={unreadCount} onClick={() => setNotifOpen(true)} />
          </div>

          <div className="brand-block">
            <p className="brand-kicker">Rheo K-12</p>
            <h1>Öğretmen Dashboard</h1>
            <p className="brand-copy">
              Haftalık rapor, müfredat görünürlüğü ve müdahale gerektiren öğrenciler tek merkezde.
            </p>
          </div>

          <nav className="sidebar-nav" aria-label="Ana navigasyon">
            {navigation.map((item, index) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <React.Fragment key={item.href}>
                  {index === 4 && <div className="sidebar-separator" />}
                  <Link
                    href={item.href}
                    className={`nav-link${active ? " active" : ""}`}
                  >
                    <span className="nav-label">
                      {item.icon}
                      {item.label}
                    </span>
                    <span className="nav-active-bar" />
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-foot">
          <ThemeToggle />
          <p className="foot-label">Rheo © 2026</p>
          <p className="foot-copy">
            30 saniyede sınıf durumu, geciken ödevler ve riskli öğrenciler görünür olmalı.
          </p>
        </div>
      </aside>

      <main className="content-shell">{children}</main>
      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
