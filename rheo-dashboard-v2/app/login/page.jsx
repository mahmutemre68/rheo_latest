"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn(email, password);
      const userData = result.user || result;

      // Persist mock session
      if (typeof window !== "undefined") {
        localStorage.setItem("rheo-session", JSON.stringify(userData));
      }

      setSuccess(true);
      setTimeout(() => router.replace("/dashboard"), 800);
    } catch (err) {
      setError(err.message || "Giriş başarısız oldu.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("merve.kaya@rheo.k12");
    setPassword("demo1234");
    setError(null);
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left: branding */}
        <div className="login-brand">
          <div className="login-brand-content">
            <div className="login-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="14" fill="url(#loginGrad)" />
                <path d="M14 24l6 6 14-14" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="loginGrad" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#2dd4bf" />
                    <stop offset="1" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>Rheo K-12</h1>
            <p>Öğretmen Dashboard'a hoş geldiniz.</p>
            <div className="login-features">
              <div className="login-feature">
                <span className="login-feature-icon">📊</span>
                <div>
                  <strong>Sınıf Analitiği</strong>
                  <p>Haftalık rapor ve müfredat kapsama görünürlüğü</p>
                </div>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">⚡</span>
                <div>
                  <strong>Erken Uyarı Sistemi</strong>
                  <p>Riskli öğrencileri anında tespit edin</p>
                </div>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">🎯</span>
                <div>
                  <strong>Ödev Yönetimi</strong>
                  <p>Kanban panosu ile teslim takibi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="login-form-side">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-head">
              <h2>Giriş Yap</h2>
              <p>Öğretmen hesabınızla devam edin</p>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="login-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Giriş başarılı! Yönlendiriliyorsunuz...
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email">E-posta</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@rheo.k12"
                required
                autoComplete="email"
                disabled={loading || success}
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Şifre</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading || success}
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading || success || !email || !password}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : success ? (
                "✓ Başarılı"
              ) : (
                "Giriş Yap"
              )}
            </button>

            <div className="login-divider">
              <span>veya</span>
            </div>

            <button
              type="button"
              className="login-demo-btn"
              onClick={fillDemo}
              disabled={loading || success}
            >
              Demo hesap ile dene
            </button>

            <p className="login-hint">
              Demo: <code>merve.kaya@rheo.k12</code> / <code>demo1234</code>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
