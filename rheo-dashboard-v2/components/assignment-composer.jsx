"use client";

import { useState } from "react";

const topicOptions = [
  { value: "loops", label: "Döngüler" },
  { value: "debug", label: "Hata Tespiti" },
  { value: "functions", label: "Fonksiyonlar" },
  { value: "lists", label: "Listeler" }
];

const sourceOptions = [
  { value: "journey_node", label: "Journey node" },
  { value: "question_set", label: "Soru seti" },
  { value: "duration_goal", label: "Süre hedefi" }
];

export function AssignmentComposer({ classOptions, initialClassId = "all" }) {
  const [form, setForm] = useState({
    classId: initialClassId === "all" ? classOptions[1]?.value ?? "" : initialClassId,
    title: "Haftalık tekrar ödevi",
    topic: "loops",
    sourceType: "journey_node",
    dueAt: "2026-05-06",
    note: "Önce düşük tamamlanmalı konuya odaklan, sonra hata tespiti ile pekiştir."
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField(key, value) {
    setSubmitted(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  const selectedClass = classOptions.find((o) => o.value === form.classId)?.label ?? "Sınıf";
  const selectedTopic = topicOptions.find((o) => o.value === form.topic)?.label ?? "Konu";
  const selectedSource = sourceOptions.find((o) => o.value === form.sourceType)?.label ?? "Kaynak";

  return (
    <div className="composer-grid">
      <form className="panel composer-form" onSubmit={handleSubmit}>
        <div className="section-head">
          <div>
            <h3>Ödev Oluştur</h3>
            <p>Demo amaçlı form; backend entegrasyonu sonraki adımda bağlanır.</p>
          </div>
        </div>

        <label className="control-group">
          <span>Sınıf</span>
          <select value={form.classId} onChange={(e) => updateField("classId", e.target.value)}>
            {classOptions.filter((o) => o.value !== "all").map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className="control-group">
          <span>Başlık</span>
          <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
        </label>

        <label className="control-group">
          <span>Konu</span>
          <select value={form.topic} onChange={(e) => updateField("topic", e.target.value)}>
            {topicOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </label>

        <label className="control-group">
          <span>Kaynak tipi</span>
          <select value={form.sourceType} onChange={(e) => updateField("sourceType", e.target.value)}>
            {sourceOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </label>

        <label className="control-group">
          <span>Son tarih</span>
          <input type="date" value={form.dueAt} onChange={(e) => updateField("dueAt", e.target.value)} />
        </label>

        <label className="control-group">
          <span>Öğretmen notu</span>
          <textarea value={form.note} onChange={(e) => updateField("note", e.target.value)} rows={4} />
        </label>

        <button type="submit" className="button button-primary">Taslak oluştur</button>
        {submitted ? <p className="success-note">Taslak hazır. Backend bağlandığında bu form assignment create uç noktasına yazacak.</p> : null}
      </form>

      <aside className="panel composer-preview">
        <div className="section-head">
          <div>
            <h3>Canlı Önizleme</h3>
            <p>Zayıf konuya göre otomatik öneri.</p>
          </div>
        </div>
        <div className="preview-block"><span>Sınıf</span><strong>{selectedClass}</strong></div>
        <div className="preview-block"><span>Kapsam</span><strong>{selectedTopic}</strong></div>
        <div className="preview-block"><span>Kaynak</span><strong>{selectedSource}</strong></div>
        <div className="preview-block"><span>Son tarih</span><strong>{form.dueAt}</strong></div>
        <div className="preview-note"><p>{form.note}</p></div>
      </aside>
    </div>
  );
}
