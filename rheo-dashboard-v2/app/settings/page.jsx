"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getTeacherProfile } from "@/lib/data";

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      className={`toggle-switch${checked ? " on" : ""}`}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
    />
  );
}

export default function SettingsPage() {
  const profile = getTeacherProfile();
  const [prefs, setPrefs] = useState(profile.preferences);
  const [copiedCode, setCopiedCode] = useState(null);

  function togglePref(key) {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  }

  function copyCode(code) {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const initials = profile.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Profil ve Tercih"
        title="Ayarlar"
        description="Profil bilgileriniz, sınıf davet kodları ve bildirim tercihlerinizi yönetin."
        meta={[profile.role === "teacher" ? "Öğretmen hesabı" : "Yönetici hesabı"]}
      />

      <div className="settings-grid">
        {/* Profil Kartı */}
        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Profil Bilgileri</h3>
              <p>Hesap ve okul bilgileriniz.</p>
            </div>
          </div>
          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <h3>{profile.name}</h3>
              <p>{profile.email}</p>
              <p style={{ marginTop: 4 }}>Okul: Rheo Ankara Pilot</p>
            </div>
          </div>
        </section>

        {/* Bildirim Tercihleri */}
        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Bildirim Tercihleri</h3>
              <p>Hangi bildirimler gönderilsin?</p>
            </div>
          </div>
          <div className="toggle-group">
            <div className="toggle-label">
              <strong>E-posta bildirimleri</strong>
              <span>Haftalık özet ve kritik uyarılar e-posta ile gönderilsin.</span>
            </div>
            <ToggleSwitch checked={prefs.emailNotifications} onChange={() => togglePref("emailNotifications")} />
          </div>
          <div className="toggle-group">
            <div className="toggle-label">
              <strong>Risk uyarıları</strong>
              <span>Öğrenci risk seviyesi değiştiğinde anında bildirim gönder.</span>
            </div>
            <ToggleSwitch checked={prefs.riskAlerts} onChange={() => togglePref("riskAlerts")} />
          </div>
          <div className="toggle-group">
            <div className="toggle-label">
              <strong>Haftalık rapor</strong>
              <span>Her Pazartesi otomatik rapor oluştur.</span>
            </div>
            <ToggleSwitch checked={prefs.weeklyReport} onChange={() => togglePref("weeklyReport")} />
          </div>
        </section>
      </div>

      {/* Davet Kodları Tablosu */}
      <section className="panel">
        <div className="section-head">
          <div>
            <h3>Sınıf Davet Kodları</h3>
            <p>Öğrenciler bu kodları kullanarak sınıfınıza katılabilir. Kodu kopyalamak için tıklayın.</p>
          </div>
        </div>
        <table className="invite-table">
          <thead>
            <tr>
              <th>Sınıf</th>
              <th>Seviye</th>
              <th>Öğrenci</th>
              <th>Davet Kodu</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {profile.classrooms.map((cls) => (
              <tr key={cls.id}>
                <td><strong>{cls.name}</strong></td>
                <td>{cls.gradeBand}</td>
                <td>{cls.studentCount} öğrenci</td>
                <td>
                  <span className="invite-code" onClick={() => copyCode(cls.inviteCode)} title="Kopyalamak için tıkla">
                    {copiedCode === cls.inviteCode ? "✓ Kopyalandı!" : cls.inviteCode}
                  </span>
                </td>
                <td><span className="status-pill status-on_track">Aktif</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Dil ve Sistem */}
      <div className="settings-grid">
        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Dil Tercihi</h3>
              <p>Dashboard arayüz dili.</p>
            </div>
          </div>
          <div className="control-group">
            <span>Dil</span>
            <select value={prefs.language} onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}>
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Sistem</h3>
              <p>Teknik bilgiler ve sürüm.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="toggle-group" style={{ borderBottom: "none", padding: "8px 0" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.84rem" }}>Sürüm</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.84rem" }}>v2.0.0-beta</span>
            </div>
            <div className="toggle-group" style={{ borderBottom: "none", padding: "8px 0" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.84rem" }}>Veri kaynağı</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.84rem" }}>Mock (demo)</span>
            </div>
            <div className="toggle-group" style={{ borderBottom: "none", padding: "8px 0" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.84rem" }}>Son güncelleme</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.84rem" }}>01 May 2026</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
