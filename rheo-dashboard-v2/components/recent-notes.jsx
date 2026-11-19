"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";

/**
 * Shows the most recent teacher notes across ALL students on the dashboard.
 * Reads from localStorage (same keys as TeacherNotes component).
 */
export function RecentNotes() {
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    const collected = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("rheo-notes-")) {
        try {
          const studentId = key.replace("rheo-notes-", "");
          const notes = JSON.parse(localStorage.getItem(key));
          notes.forEach(note => {
            collected.push({ ...note, studentId });
          });
        } catch {}
      }
    }
    collected.sort((a, b) => b.id - a.id);
    setAllNotes(collected.slice(0, 5));
  }, []);

  if (allNotes.length === 0) return null;

  return (
    <section className="panel recent-notes-panel">
      <div className="section-head">
        <div>
          <h3>📝 Son Notlarım</h3>
          <p>Farklı öğrenciler için tuttuğunuz en son notlar.</p>
        </div>
      </div>
      <div className="notes-list">
        {allNotes.map(note => (
          <div key={note.id} className="note-item">
            <div className="note-content">
              <p>{note.text}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="note-date">{formatDate(note.date)}</span>
                <Link
                  href={`/students/${note.studentId}`}
                  className="text-link"
                  style={{ fontSize: "0.78rem" }}
                >
                  Öğrenciye git →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
