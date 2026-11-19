"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/format";

export function TeacherNotes({ studentId, studentName }) {
  const storageKey = `rheo-notes-${studentId}`;
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  function addNote() {
    if (!newNote.trim()) return;
    const updated = [
      { id: Date.now(), text: newNote.trim(), date: new Date().toISOString() },
      ...notes
    ];
    setNotes(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewNote("");
  }

  function deleteNote(id) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  return (
    <section className="panel teacher-notes-panel">
      <div className="section-head">
        <div>
          <h3>Öğretmen Notları</h3>
          <p>{studentName} için tuttuğunuz özel notlar.</p>
        </div>
      </div>

      <div className="notes-input-row">
        <input
          type="text"
          className="notes-input"
          placeholder="Not ekleyin... (örn: Velisiyle görüştüm)"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
        />
        <button className="button button-primary" onClick={addNote} disabled={!newNote.trim()}>
          Ekle
        </button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="notes-empty">Henüz not eklenmemiş. Öğrenci takibi için notlarınızı burada tutabilirsiniz.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-content">
                <p>{note.text}</p>
                <span className="note-date">{formatDate(note.date)}</span>
              </div>
              <button className="note-delete" onClick={() => deleteNote(note.id)} title="Sil">×</button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
