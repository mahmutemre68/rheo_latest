"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, signIn, signOut, USE_MOCK } from "@/lib/api";

/* ── Auth Context ── */

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false
});

export function useAuth() {
  return useContext(AuthContext);
}

/* ── Auth Provider ── */

const PUBLIC_PATHS = ["/login", "/"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  /* Check existing session on mount */
  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  /* Redirect logic */
  useEffect(() => {
    if (loading) return;
    
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p);

    if (!user && !isPublic) {
      router.replace("/login");
    }
  }, [user, loading, pathname, router]);

  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn(email, password);
      const userData = result.user || result;
      setUser(userData);
      
      // Persist mock session
      if (USE_MOCK && typeof window !== "undefined") {
        localStorage.setItem("rheo-session", JSON.stringify(userData));
      }
      
      router.replace("/dashboard");
      return userData;
    } catch (e) {
      setError(e.message || "Giriş başarısız oldu.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("rheo-session");
      }
      if (!USE_MOCK) {
        router.replace("/login");
      }
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ── Auth Guard (Route Protection) ── */

export function AuthGuard({ children, fallback }) {
  const { user, loading } = useAuth();

  if (loading) {
    return fallback || (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <p>Oturum kontrol ediliyor...</p>
      </div>
    );
  }

  if (!user) return null; /* redirect will happen via useEffect */

  return children;
}

/* ── Login Required Panel ── */

export function LoginRequiredPanel() {
  const router = useRouter();

  return (
    <section className="panel empty-panel" style={{ textAlign: "center", padding: "60px 24px" }}>
      <div>
        <p className="eyebrow">Kimlik Doğrulama</p>
        <h3>Bu sayfayı görüntülemek için giriş yapmalısınız</h3>
        <p style={{ marginTop: 8 }}>Öğretmen hesabınızla giriş yaparak dashboard'a erişebilirsiniz.</p>
      </div>
      <button className="button button-primary" onClick={() => router.push("/login")} style={{ marginTop: 20 }}>
        Giriş Yap
      </button>
    </section>
  );
}
