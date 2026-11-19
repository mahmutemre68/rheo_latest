"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRelativeDays } from "@/lib/format";
import { getNotifications } from "@/lib/data";

const typeIcons = {
  risk_alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  assignment_complete: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  assignment_due: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  assignment_overdue: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  streak_break: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  milestone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  system: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
};

const priorityDot = {
  high: "var(--coral-400)",
  medium: "var(--amber-400)",
  low: "var(--teal-400)"
};

function timeAgo(dateStr) {
  const now = new Date("2026-04-29T12:00:00+03:00");
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Az önce";
  if (diffH < 24) return `${diffH} saat önce`;
  const diffD = Math.floor(diffH / 24);
  return formatRelativeDays(diffD);
}

export function NotificationBell({ unreadCount, onClick }) {
  return (
    <button className="notif-bell" onClick={onClick} aria-label={`${unreadCount} okunmamış bildirim`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
    </button>
  );
}

export function NotificationPanel({ isOpen, onClose }) {
  const { items } = getNotifications();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? items
    : filter === "unread"
      ? items.filter((n) => !n.read)
      : items.filter((n) => n.type === filter);

  if (!isOpen) return null;

  return (
    <>
      <div className="notif-backdrop" onClick={onClose} />
      <aside className="notif-drawer">
        <div className="notif-drawer-head">
          <div>
            <h3>Bildirimler</h3>
            <p>{items.filter((n) => !n.read).length} okunmamış</p>
          </div>
          <button className="notif-close" onClick={onClose} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="notif-filters">
          {[
            { value: "all", label: "Tümü" },
            { value: "unread", label: "Okunmamış" },
            { value: "risk_alert", label: "Risk" },
            { value: "assignment_due", label: "Ödevler" }
          ].map((f) => (
            <button
              key={f.value}
              className={`notif-filter-chip${filter === f.value ? " active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="notif-list">
          {filtered.length === 0 ? (
            <div className="notif-empty">
              <p>Bu filtrede bildirim yok</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div key={notif.id} className={`notif-item${notif.read ? "" : " unread"}`}>
                <div className="notif-icon">{typeIcons[notif.type] ?? typeIcons.system}</div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <strong>{notif.title}</strong>
                    <span
                      className="notif-priority-dot"
                      style={{ background: priorityDot[notif.priority] }}
                    />
                  </div>
                  <p>{notif.description}</p>
                  <span className="notif-time">{timeAgo(notif.createdAt)}</span>
                </div>
                {notif.studentId && (
                  <Link className="notif-action" href={`/students/${notif.studentId}`} onClick={onClose}>
                    →
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
