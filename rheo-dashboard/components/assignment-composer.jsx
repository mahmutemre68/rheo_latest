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
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  const selectedClass = classOptions.find((option) => option.value === form.classId)?.label ?? "Sınıf";
  const selectedTopic = topicOptions.find((option) => option.value === form.topic)?.label ?? "Konu";
  const selectedSource = sourceOptions.find((option) => option.value === form.sourceType)?.label ?? "Kaynak";

  return (
    <div className="composer-grid">
      <form className="panel composer-form" onSubmit={handleSubmit}>
        <div className="section-head">
          <div>
            <h3>Ödev Oluştur</h3>
            <p>İlk sürümde form demo amaçlı çalışır; kaydetme backend entegrasyonu sonraki adımda bağlanır.</p>
          </div>
        </div>

        <label className="control-group">
          <span>Sınıf</span>
          <select value={form.classId} onChange={(event) => updateField("classId", event.target.value)}>
            {classOptions.filter((option) => option.value !== "all").map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control-group">
          <span>Başlık</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </label>

        <label className="control-group">
          <span>Konu</span>
          <select value={form.topic} onChange={(event) => updateField("topic", event.target.value)}>
            {topicOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control-group">
          <span>Kaynak tipi</span>
          <select
            value={form.sourceType}
            onChange={(event) => updateField("sourceType", event.target.value)}
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control-group">
          <span>Son tarih</span>
          <input type="date" value={form.dueAt} onChange={(event) => updateField("dueAt", event.target.value)} />
        </label>

        <label className="control-group">
          <span>Öğretmen notu</span>
          <textarea value={form.note} onChange={(event) => updateField("note", event.target.value)} rows={4} />
        </label>

        <button type="submit" className="button button-primary">
          Taslak oluştur
        </button>

        {submitted ? <p className="success-note">Taslak hazır. Backend bağlandığında bu form `assignment create` uç noktasına yazacak.</p> : null}
      </form>

      <aside className="panel composer-preview">
        <div className="section-head">
          <div>
            <h3>Canlı Önizleme</h3>
            <p>Öğretmenin rapor ekranından gördüğü zayıf konuya göre otomatik öneri.</p>
          </div>
        </div>

        <div className="preview-block">
          <span>Sınıf</span>
          <strong>{selectedClass}</strong>
        </div>
        <div className="preview-block">
          <span>Kapsam</span>
          <strong>{selectedTopic}</strong>
        </div>
        <div className="preview-block">
          <span>Kaynak</span>
          <strong>{selectedSource}</strong>
        </div>
        <div className="preview-block">
          <span>Son tarih</span>
          <strong>{form.dueAt}</strong>
        </div>
        <div className="preview-note">
          <p>{form.note}</p>
        </div>
      </aside>
    </div>
  );
}
