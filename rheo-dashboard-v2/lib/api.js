/**
 * ═══════════════════════════════════════════════
 *  RHEO DASHBOARD — API ABSTRACTION LAYER
 * ═══════════════════════════════════════════════
 *
 *  Bu dosya, dashboard'un mock veriden gerçek API'ye geçişini sağlar.
 *  USE_MOCK = true iken tüm fonksiyonlar lib/data.js'den döner.
 *  Entegrasyon aşamasında USE_MOCK = false yapılarak gerçek
 *  Firestore/REST endpoint'lerine geçilir.
 *
 *  Tüm fonksiyonlar async wrapper'dır — UI tarafı await/Suspense
 *  kullanmaya geçiş yapabilir.
 */

import {
  getDashboardOverview as mockDashboardOverview,
  getClassesOverview as mockClassesOverview,
  getClassDetail as mockClassDetail,
  getStudentsOverview as mockStudentsOverview,
  getStudentDetail as mockStudentDetail,
  getAssignmentsOverview as mockAssignmentsOverview,
  getReportsOverview as mockReportsOverview,
  getNotifications as mockNotifications,
  getTeacherProfile as mockTeacherProfile,
  getStaticCollections as mockStaticCollections,
  getClassOptions as mockClassOptions,
  getReportFilters as mockReportFilters,
  getViewerRole as mockViewerRole,
  REPORT_RANGE_OPTIONS
} from "@/lib/data";

/* ── Configuration ── */

export const USE_MOCK = true;

/**
 * Base URL for the API.
 * In production, this would point to your Firebase Cloud Functions
 * or a dedicated REST backend.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

/* ── Helpers ── */

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!res.ok) {
    const error = new Error(`API Error: ${res.status} ${res.statusText}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

function buildQueryString(params) {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== "");
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries).toString();
}

/* ── Dashboard ── */

export async function fetchDashboardOverview(filters) {
  if (USE_MOCK) return mockDashboardOverview(filters);
  const qs = buildQueryString({
    dateRange: filters.dateRange,
    classId: filters.classId
  });
  return apiFetch(`/dashboard${qs}`);
}

/* ── Classes ── */

export async function fetchClassesOverview(filters) {
  if (USE_MOCK) return mockClassesOverview(filters);
  const qs = buildQueryString({ dateRange: filters.dateRange });
  return apiFetch(`/classes${qs}`);
}

export async function fetchClassDetail(classId, filters) {
  if (USE_MOCK) return mockClassDetail(classId, filters);
  const qs = buildQueryString({ dateRange: filters.dateRange });
  return apiFetch(`/classes/${classId}${qs}`);
}

/* ── Students ── */

export async function fetchStudentsOverview(filters) {
  if (USE_MOCK) return mockStudentsOverview(filters);
  const qs = buildQueryString({
    classId: filters.classId,
    risk: filters.risk,
    activity: filters.activity,
    assignmentStatus: filters.assignmentStatus
  });
  return apiFetch(`/students${qs}`);
}

export async function fetchStudentDetail(studentId) {
  if (USE_MOCK) return mockStudentDetail(studentId);
  return apiFetch(`/students/${studentId}`);
}

/* ── Assignments ── */

export async function fetchAssignmentsOverview(filters) {
  if (USE_MOCK) return mockAssignmentsOverview(filters);
  const qs = buildQueryString({
    classId: filters.classId,
    assignmentStatus: filters.assignmentStatus
  });
  return apiFetch(`/assignments${qs}`);
}

export async function createAssignment(payload) {
  if (USE_MOCK) {
    // Simulate creation delay
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, id: `assignment-${Date.now()}` };
  }
  return apiFetch("/assignments", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/* ── Reports ── */

export async function fetchReportsOverview(filters) {
  if (USE_MOCK) return mockReportsOverview(filters);
  const qs = buildQueryString({ dateRange: filters.dateRange });
  return apiFetch(`/reports${qs}`);
}

/* ── Notifications ── */

export async function fetchNotifications() {
  if (USE_MOCK) return mockNotifications();
  return apiFetch("/notifications");
}

export async function markNotificationRead(notifId) {
  if (USE_MOCK) return { success: true };
  return apiFetch(`/notifications/${notifId}/read`, { method: "PATCH" });
}

/* ── Teacher Profile ── */

export async function fetchTeacherProfile() {
  if (USE_MOCK) return mockTeacherProfile();
  return apiFetch("/profile");
}

export async function updateTeacherPreferences(preferences) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, preferences };
  }
  return apiFetch("/profile/preferences", {
    method: "PATCH",
    body: JSON.stringify(preferences)
  });
}

/* ── Static/Utility (always from mock for now) ── */

export function getClassOptionsSync() {
  return mockClassOptions();
}

export function getReportFiltersSync(searchParams) {
  return mockReportFilters(searchParams);
}

export function getViewerRoleSync(searchParams) {
  return mockViewerRole(searchParams);
}

export { REPORT_RANGE_OPTIONS };

/* ── Auth Helpers (to be implemented with Firebase) ── */

export async function signIn(email, password) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    if (email === "merve.kaya@rheo.k12" && password === "demo1234") {
      return {
        success: true,
        user: {
          uid: "teacher-merve-kaya",
          email: "merve.kaya@rheo.k12",
          displayName: "Merve Kaya",
          role: "teacher"
        },
        token: "mock-jwt-token-" + Date.now()
      };
    }
    throw new Error("Geçersiz e-posta veya şifre.");
  }
  // Real: Firebase Auth signInWithEmailAndPassword
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function signOut() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { success: true };
  }
  // Real: Firebase Auth signOut
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function getCurrentUser() {
  if (USE_MOCK) {
    // Check if there's a mock session
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("rheo-session");
      if (session) {
        try { return JSON.parse(session); } catch (e) { return null; }
      }
    }
    return null;
  }
  try {
    return await apiFetch("/auth/me");
  } catch (e) {
    return null;
  }
}
