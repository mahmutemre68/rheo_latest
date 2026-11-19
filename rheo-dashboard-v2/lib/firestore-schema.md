# Rheo K-12 Firestore Database Schema

Bu belge, Rheo'nun K-12 B2B dashboard çözümü için kullanılacak Firebase Firestore veritabanı yapısını tanımlar. Tasarım, okuma ağırlıklı dashboard sorgularını optimize edecek şekilde no-sql denormalizasyonu ile kurgulanmıştır.

---

## 🏫 Collections: `schools`

Okul (müşteri) bazlı organizasyon birimleri. Tüm sistemdeki en üst hiyerarşi.

```typescript
interface School {
  id: string;                 // "school-rheo-ankara"
  name: string;               // "Rheo Ankara Pilot Okulu"
  domain: string;             // "rheo.k12"
  activeAcademicYear: string; // "2025-2026"
  createdAt: timestamp;
  settings: {
    features: string[];       // ["duelo", "reports", "assignments"]
  };
}
```

---

## 👩‍🏫 Collections: `users`

Platforma erişimi olan kullanıcılar (öğretmenler ve yöneticiler). Firebase Auth UID'si ile birebir eşleşir.

```typescript
interface User {
  id: string;                 // Firebase Auth UID ("teacher-merve-kaya")
  email: string;              // "merve.kaya@rheo.k12"
  displayName: string;        // "Merve Kaya"
  role: "teacher" | "admin";  
  schoolId: string;           // Reference to schools
  assignedClassIds: string[]; // ["class-7a", "class-8b"]
  preferences: {
    emailNotifications: boolean;
    riskAlerts: boolean;
    weeklyReport: boolean;
    language: "tr" | "en";
  };
}
```

---

## 📚 Collections: `classrooms`

Öğretmenlerin atandığı şubeler. Dashboard özet sorguları için öğrenci sayısı gibi aggregasyon verilerini içerir.

```typescript
interface Classroom {
  id: string;                 // "class-7a"
  schoolId: string;           // "school-rheo-ankara"
  name: string;               // "7-A Algoritma"
  gradeBand: string;          // "7-8"
  inviteCode: string;         // "RHEO-7A-26"
  studentCount: number;       // Denormalized count
  teachers: string[];         // Array of user IDs
  status: "active" | "archived";
}
```

---

## 🎒 Collections: `students`

Rheo platformunu kullanan öğrenciler. Öğrencilerin genel risk skoru düzenli olarak (örn: Cloud Function ile) hesaplanarak `riskScore` ve `riskLevel` alanlarına yazılır.

```typescript
interface Student {
  id: string;                 // "std-101"
  schoolId: string;
  classId: string;            // Primary class reference
  name: string;
  email: string;
  avatarUrl: string;
  lastActiveAt: timestamp;    // Son giriş tarihi
  
  // Dashboard Aggregations (Cloud Functions ile güncellenir)
  metrics: {
    completionRate: number;   // %47
    xpTotal: number;          // 2450
    currentStreak: number;    // 3
    avgQuizScore: number;     // 82
  };
  
  // Risk Algoritması
  riskLevel: "at_risk" | "needs_attention" | "on_track";
  riskScore: number;          // 0-100 arası risk skoru
}
```

---

## 📝 Collections: `assignments`

Öğretmenlerin sınıflara gönderdiği görevler (ödevler, projeler, Duelo setleri).

```typescript
interface Assignment {
  id: string;                 // "assign-1"
  schoolId: string;
  classId: string;
  teacherId: string;          // Oluşturan
  title: string;              // "Hata Avcısı Seti"
  type: "homework" | "duelo" | "project";
  topic: string;              // "Algoritma"
  dueDate: timestamp;         
  createdAt: timestamp;
  
  // Stats
  studentCount: number;       // Toplam atanan öğrenci
  completionCount: number;    // Teslim edenler
  status: "active" | "completed" | "draft";
}
```

---

## 🔔 Collections: `notifications`

Kullanıcılara (öğretmen/admin) gönderilen in-app bildirimleri.

```typescript
interface Notification {
  id: string;                 // Otomatik ID
  userId: string;             // Alıcı (Teacher/Admin ID)
  type: "risk" | "assignment" | "achievement" | "system";
  priority: "high" | "medium" | "low";
  title: string;              // "Elif Şahin riskli seviyeye geçti"
  body: string;               // Detaylı mesaj
  isRead: boolean;
  createdAt: timestamp;
  actionUrl: string | null;   // "/students/std-104"
}
```

---

## ⚙️ Cloud Functions (Tavsiye Edilen)

Dashboard'un performanslı çalışması için aşağıdaki asenkron işlemlerin Firebase Cloud Functions ile yapılması önerilir:

1. **`calculateStudentRisk`**: Her gece çalışarak (Cron) öğrencilerin `lastActiveAt`, ödev teslim süreleri ve quiz skorlarını baz alıp `riskLevel`'ı günceller.
2. **`updateClassMetrics`**: Yeni bir öğrenci eklendiğinde/çıkarıldığında veya ödev tamamlandığında `classrooms` dökümanındaki `studentCount` ve genel tamamlama oranını günceller.
3. **`generateWeeklyReports`**: Her pazartesi sabahı öğretmenlerin `preferences.weeklyReport` ayarlarına bakarak özet PDF'ler oluşturup e-posta ile gönderir.
