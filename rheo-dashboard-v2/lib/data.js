import { formatDate, slugify } from "@/lib/format";

export const REFERENCE_DATE = new Date("2026-04-29T10:00:00+03:00");

export const REPORT_RANGE_OPTIONS = [
  { value: "week", label: "Bu Hafta" },
  { value: "last7", label: "Son 7 Gün" },
  { value: "month", label: "Bu Ay" },
  { value: "compare", label: "Geçen Hafta ile Karşılaştır" }
];

export const teacher = {
  id: "teacher-merve-kaya",
  name: "Merve Kaya",
  email: "merve.kaya@rheo.k12",
  schoolId: "school-rheo-ankara",
  assignedClassIds: ["class-7a", "class-8b", "class-10a"],
  locale: "tr-TR",
  role: "teacher"
};

const classrooms = [
  {
    id: "class-7a",
    name: "7-A Algoritma",
    gradeBand: "7-8",
    teacherId: teacher.id,
    studentCount: 24,
    inviteCode: "RHEO-7A-26",
    curriculumTrack: "Python Temelleri",
    activeRate: 0.79,
    lastUpdatedAt: "2026-04-29T09:12:00+03:00"
  },
  {
    id: "class-8b",
    name: "8-B Veri Yapıları",
    gradeBand: "7-8",
    teacherId: teacher.id,
    studentCount: 21,
    inviteCode: "RHEO-8B-26",
    curriculumTrack: "Fonksiyonlar ve Listeler",
    activeRate: 0.71,
    lastUpdatedAt: "2026-04-29T08:46:00+03:00"
  },
  {
    id: "class-10a",
    name: "10-A Pilot Sınıf",
    gradeBand: "9-10",
    teacherId: teacher.id,
    studentCount: 14,
    inviteCode: "RHEO-10A-26",
    curriculumTrack: "Algoritma Hazırlık",
    activeRate: 0,
    lastUpdatedAt: "2026-04-29T08:05:00+03:00"
  }
];

const classSnapshots = {
  "class-7a": {
    week: {
      completionRate: 0.74,
      coveragePercent: 0.68,
      overdueStudentCount: 4,
      atRiskCount: 2,
      lastUpdatedAt: "2026-04-29T09:12:00+03:00",
      trend: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum"],
        current: [0.54, 0.58, 0.64, 0.7, 0.74],
        previous: [0.42, 0.48, 0.52, 0.58, 0.61]
      }
    },
    last7: {
      completionRate: 0.72,
      coveragePercent: 0.65,
      overdueStudentCount: 5,
      atRiskCount: 2,
      lastUpdatedAt: "2026-04-29T09:12:00+03:00",
      trend: {
        labels: ["23 Nis", "24 Nis", "25 Nis", "26 Nis", "27 Nis", "28 Nis", "29 Nis"],
        current: [0.46, 0.52, 0.57, 0.61, 0.66, 0.7, 0.72],
        previous: [0.38, 0.4, 0.44, 0.49, 0.54, 0.56, 0.58]
      }
    },
    month: {
      completionRate: 0.69,
      coveragePercent: 0.63,
      overdueStudentCount: 6,
      atRiskCount: 2,
      lastUpdatedAt: "2026-04-29T09:12:00+03:00",
      trend: {
        labels: ["1. hf", "2. hf", "3. hf", "4. hf"],
        current: [0.41, 0.52, 0.61, 0.69],
        previous: [0.36, 0.45, 0.53, 0.59]
      }
    },
    compare: {
      completionRate: 0.74,
      coveragePercent: 0.68,
      overdueStudentCount: 4,
      atRiskCount: 2,
      lastUpdatedAt: "2026-04-29T09:12:00+03:00",
      trend: {
        labels: ["Geçen", "Bu"],
        current: [0.61, 0.74],
        previous: [0.56, 0.61]
      }
    }
  },
  "class-8b": {
    week: {
      completionRate: 0.67,
      coveragePercent: 0.61,
      overdueStudentCount: 5,
      atRiskCount: 3,
      lastUpdatedAt: "2026-04-29T08:46:00+03:00",
      trend: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum"],
        current: [0.49, 0.53, 0.55, 0.63, 0.67],
        previous: [0.45, 0.47, 0.49, 0.54, 0.56]
      }
    },
    last7: {
      completionRate: 0.64,
      coveragePercent: 0.58,
      overdueStudentCount: 6,
      atRiskCount: 3,
      lastUpdatedAt: "2026-04-29T08:46:00+03:00",
      trend: {
        labels: ["23 Nis", "24 Nis", "25 Nis", "26 Nis", "27 Nis", "28 Nis", "29 Nis"],
        current: [0.41, 0.44, 0.51, 0.53, 0.59, 0.62, 0.64],
        previous: [0.36, 0.39, 0.42, 0.44, 0.47, 0.5, 0.52]
      }
    },
    month: {
      completionRate: 0.62,
      coveragePercent: 0.55,
      overdueStudentCount: 7,
      atRiskCount: 4,
      lastUpdatedAt: "2026-04-29T08:46:00+03:00",
      trend: {
        labels: ["1. hf", "2. hf", "3. hf", "4. hf"],
        current: [0.36, 0.46, 0.55, 0.62],
        previous: [0.31, 0.39, 0.45, 0.51]
      }
    },
    compare: {
      completionRate: 0.67,
      coveragePercent: 0.61,
      overdueStudentCount: 5,
      atRiskCount: 3,
      lastUpdatedAt: "2026-04-29T08:46:00+03:00",
      trend: {
        labels: ["Geçen", "Bu"],
        current: [0.56, 0.67],
        previous: [0.52, 0.56]
      }
    }
  },
  "class-10a": {
    week: {
      completionRate: 0,
      coveragePercent: 0,
      overdueStudentCount: 0,
      atRiskCount: 0,
      lastUpdatedAt: "2026-04-29T08:05:00+03:00",
      trend: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum"],
        current: [0, 0, 0, 0, 0],
        previous: [0, 0, 0, 0, 0]
      }
    },
    last7: {
      completionRate: 0,
      coveragePercent: 0,
      overdueStudentCount: 0,
      atRiskCount: 0,
      lastUpdatedAt: "2026-04-29T08:05:00+03:00",
      trend: {
        labels: ["23 Nis", "24 Nis", "25 Nis", "26 Nis", "27 Nis", "28 Nis", "29 Nis"],
        current: [0, 0, 0, 0, 0, 0, 0],
        previous: [0, 0, 0, 0, 0, 0, 0]
      }
    },
    month: {
      completionRate: 0,
      coveragePercent: 0,
      overdueStudentCount: 0,
      atRiskCount: 0,
      lastUpdatedAt: "2026-04-29T08:05:00+03:00",
      trend: {
        labels: ["1. hf", "2. hf", "3. hf", "4. hf"],
        current: [0, 0, 0, 0],
        previous: [0, 0, 0, 0]
      }
    },
    compare: {
      completionRate: 0,
      coveragePercent: 0,
      overdueStudentCount: 0,
      atRiskCount: 0,
      lastUpdatedAt: "2026-04-29T08:05:00+03:00",
      trend: {
        labels: ["Geçen", "Bu"],
        current: [0, 0],
        previous: [0, 0]
      }
    }
  }
};

const curriculumProgress = [
  { classId: "class-7a", topicId: "python-basics", topicName: "Python Temelleri", assignedCount: 24, completedCount: 20, avgAccuracy: 0.79, coveragePercent: 0.84 },
  { classId: "class-7a", topicId: "loops", topicName: "Döngüler", assignedCount: 24, completedCount: 17, avgAccuracy: 0.64, coveragePercent: 0.71 },
  { classId: "class-7a", topicId: "conditionals", topicName: "Koşullar", assignedCount: 24, completedCount: 19, avgAccuracy: 0.74, coveragePercent: 0.79 },
  { classId: "class-7a", topicId: "debug", topicName: "Hata Tespiti", assignedCount: 18, completedCount: 10, avgAccuracy: 0.51, coveragePercent: 0.56 },
  { classId: "class-8b", topicId: "functions", topicName: "Fonksiyonlar", assignedCount: 21, completedCount: 15, avgAccuracy: 0.68, coveragePercent: 0.71 },
  { classId: "class-8b", topicId: "lists", topicName: "Listeler", assignedCount: 21, completedCount: 14, avgAccuracy: 0.66, coveragePercent: 0.67 },
  { classId: "class-8b", topicId: "flow", topicName: "Akış Kontrolü", assignedCount: 21, completedCount: 16, avgAccuracy: 0.71, coveragePercent: 0.76 },
  { classId: "class-8b", topicId: "comparison", topicName: "Kod Karşılaştırma", assignedCount: 12, completedCount: 7, avgAccuracy: 0.48, coveragePercent: 0.58 },
  { classId: "class-10a", topicId: "orientation", topicName: "Oryantasyon", assignedCount: 0, completedCount: 0, avgAccuracy: 0, coveragePercent: 0 },
  { classId: "class-10a", topicId: "algorithms", topicName: "Algoritma Ön Hazırlık", assignedCount: 0, completedCount: 0, avgAccuracy: 0, coveragePercent: 0 }
];

const students = [
  {
    id: "student-alara-demir",
    name: "Alara Demir",
    classId: "class-7a",
    lastActiveAt: "2026-04-28T18:40:00+03:00",
    xp: 1320,
    streakDays: 14,
    streakBroken: false,
    recentAccuracy: 0.82,
    duelLossStreak: 0,
    missedDailyGoals: 1,
    completionRate: 0.88,
    overdueAssignments: 0,
    hasProgress: true,
    topicMastery: [
      { topicId: "python-basics", topicName: "Python Temelleri", masteryPercent: 0.91 },
      { topicId: "loops", topicName: "Döngüler", masteryPercent: 0.84 },
      { topicId: "debug", topicName: "Hata Tespiti", masteryPercent: 0.62 }
    ],
    history: [0.46, 0.49, 0.56, 0.61, 0.67, 0.71, 0.73, 0.76, 0.79, 0.81, 0.84, 0.86, 0.87, 0.88]
  },
  {
    id: "student-berk-kurt",
    name: "Berk Kurt",
    classId: "class-7a",
    lastActiveAt: "2026-04-24T11:10:00+03:00",
    xp: 920,
    streakDays: 0,
    streakBroken: true,
    recentAccuracy: 0.47,
    duelLossStreak: 4,
    missedDailyGoals: 6,
    completionRate: 0.52,
    overdueAssignments: 2,
    hasProgress: true,
    topicMastery: [
      { topicId: "python-basics", topicName: "Python Temelleri", masteryPercent: 0.63 },
      { topicId: "loops", topicName: "Döngüler", masteryPercent: 0.46 },
      { topicId: "debug", topicName: "Hata Tespiti", masteryPercent: 0.38 }
    ],
    history: [0.42, 0.44, 0.46, 0.51, 0.54, 0.52, 0.55, 0.56, 0.57, 0.55, 0.54, 0.53, 0.53, 0.52]
  },
  {
    id: "student-ceren-ulu",
    name: "Ceren Ulu",
    classId: "class-7a",
    lastActiveAt: "2026-04-27T17:05:00+03:00",
    xp: 1105,
    streakDays: 7,
    streakBroken: false,
    recentAccuracy: 0.58,
    duelLossStreak: 1,
    missedDailyGoals: 2,
    completionRate: 0.67,
    overdueAssignments: 1,
    hasProgress: true,
    topicMastery: [
      { topicId: "python-basics", topicName: "Python Temelleri", masteryPercent: 0.78 },
      { topicId: "loops", topicName: "Döngüler", masteryPercent: 0.6 },
      { topicId: "debug", topicName: "Hata Tespiti", masteryPercent: 0.49 }
    ],
    history: [0.38, 0.41, 0.48, 0.49, 0.53, 0.56, 0.57, 0.59, 0.6, 0.62, 0.63, 0.64, 0.66, 0.67]
  },
  {
    id: "student-deniz-can",
    name: "Deniz Can",
    classId: "class-8b",
    lastActiveAt: "2026-04-28T21:15:00+03:00",
    xp: 1450,
    streakDays: 16,
    streakBroken: false,
    recentAccuracy: 0.86,
    duelLossStreak: 0,
    missedDailyGoals: 0,
    completionRate: 0.91,
    overdueAssignments: 0,
    hasProgress: true,
    topicMastery: [
      { topicId: "functions", topicName: "Fonksiyonlar", masteryPercent: 0.92 },
      { topicId: "lists", topicName: "Listeler", masteryPercent: 0.89 },
      { topicId: "comparison", topicName: "Kod Karşılaştırma", masteryPercent: 0.74 }
    ],
    history: [0.55, 0.58, 0.62, 0.66, 0.69, 0.74, 0.78, 0.8, 0.83, 0.85, 0.88, 0.89, 0.9, 0.91]
  },
  {
    id: "student-elif-sahin",
    name: "Elif Şahin",
    classId: "class-8b",
    lastActiveAt: "2026-04-23T14:30:00+03:00",
    xp: 880,
    streakDays: 2,
    streakBroken: true,
    recentAccuracy: 0.44,
    duelLossStreak: 3,
    missedDailyGoals: 5,
    completionRate: 0.49,
    overdueAssignments: 3,
    hasProgress: true,
    topicMastery: [
      { topicId: "functions", topicName: "Fonksiyonlar", masteryPercent: 0.55 },
      { topicId: "lists", topicName: "Listeler", masteryPercent: 0.46 },
      { topicId: "comparison", topicName: "Kod Karşılaştırma", masteryPercent: 0.33 }
    ],
    history: [0.41, 0.43, 0.47, 0.51, 0.54, 0.53, 0.52, 0.5, 0.48, 0.5, 0.51, 0.49, 0.5, 0.49]
  },
  {
    id: "student-firat-yaman",
    name: "Fırat Yaman",
    classId: "class-8b",
    lastActiveAt: "2026-04-26T16:00:00+03:00",
    xp: 1010,
    streakDays: 5,
    streakBroken: false,
    recentAccuracy: 0.57,
    duelLossStreak: 2,
    missedDailyGoals: 3,
    completionRate: 0.62,
    overdueAssignments: 1,
    hasProgress: true,
    topicMastery: [
      { topicId: "functions", topicName: "Fonksiyonlar", masteryPercent: 0.67 },
      { topicId: "lists", topicName: "Listeler", masteryPercent: 0.61 },
      { topicId: "comparison", topicName: "Kod Karşılaştırma", masteryPercent: 0.42 }
    ],
    history: [0.39, 0.43, 0.46, 0.49, 0.52, 0.54, 0.56, 0.58, 0.57, 0.59, 0.6, 0.61, 0.62, 0.62]
  },
  {
    id: "student-gizem-tuna",
    name: "Gizem Tuna",
    classId: "class-10a",
    lastActiveAt: "2026-04-29T08:02:00+03:00",
    xp: 0,
    streakDays: 0,
    streakBroken: false,
    recentAccuracy: 0,
    duelLossStreak: 0,
    missedDailyGoals: 0,
    completionRate: 0,
    overdueAssignments: 0,
    hasProgress: false,
    topicMastery: [],
    history: []
  },
  {
    id: "student-hakan-yildiz",
    name: "Hakan Yıldız",
    classId: "class-10a",
    lastActiveAt: "2026-04-29T08:01:00+03:00",
    xp: 0,
    streakDays: 0,
    streakBroken: false,
    recentAccuracy: 0,
    duelLossStreak: 0,
    missedDailyGoals: 0,
    completionRate: 0,
    overdueAssignments: 0,
    hasProgress: false,
    topicMastery: [],
    history: []
  }
];

const assignments = [
  {
    id: "assignment-loops-7a",
    classId: "class-7a",
    title: "Döngüler Tekrarı",
    sourceType: "journey_node",
    sourceRef: "journey-loops-01",
    topicTags: ["Döngüler", "Akış"],
    dueAt: "2026-04-30T18:00:00+03:00",
    createdAt: "2026-04-25T09:00:00+03:00",
    completionRate: 0.74,
    averageAccuracy: 0.68,
    pendingStudentIds: ["student-berk-kurt", "student-ceren-ulu"],
    lateStudentIds: []
  },
  {
    id: "assignment-debug-7a",
    classId: "class-7a",
    title: "Hata Avcısı Seti",
    sourceType: "question_set",
    sourceRef: "set-debug-07",
    topicTags: ["Hata Tespiti"],
    dueAt: "2026-04-29T16:30:00+03:00",
    createdAt: "2026-04-22T08:30:00+03:00",
    completionRate: 0.58,
    averageAccuracy: 0.52,
    pendingStudentIds: ["student-berk-kurt", "student-ceren-ulu"],
    lateStudentIds: []
  },
  {
    id: "assignment-functions-8b",
    classId: "class-8b",
    title: "Fonksiyon Atölyesi",
    sourceType: "journey_node",
    sourceRef: "journey-functions-02",
    topicTags: ["Fonksiyonlar"],
    dueAt: "2026-05-02T17:00:00+03:00",
    createdAt: "2026-04-24T10:00:00+03:00",
    completionRate: 0.67,
    averageAccuracy: 0.71,
    pendingStudentIds: ["student-elif-sahin", "student-firat-yaman"],
    lateStudentIds: []
  },
  {
    id: "assignment-comparison-8b",
    classId: "class-8b",
    title: "Kod Karşılaştırma Hız Turu",
    sourceType: "question_set",
    sourceRef: "set-compare-03",
    topicTags: ["Kod Karşılaştırma"],
    dueAt: "2026-04-27T18:00:00+03:00",
    createdAt: "2026-04-19T08:45:00+03:00",
    completionRate: 0.47,
    averageAccuracy: 0.43,
    pendingStudentIds: [],
    lateStudentIds: ["student-elif-sahin"]
  },
  {
    id: "assignment-lists-8b",
    classId: "class-8b",
    title: "Liste İşlemleri Mini Quiz",
    sourceType: "duration_goal",
    sourceRef: "goal-lists-02",
    topicTags: ["Listeler", "Hızlı Sınav"],
    dueAt: "2026-04-26T12:00:00+03:00",
    createdAt: "2026-04-20T09:00:00+03:00",
    completionRate: 1,
    averageAccuracy: 0.77,
    pendingStudentIds: [],
    lateStudentIds: []
  }
];

function readSearchParam(searchParams, key) {
  const value = searchParams?.[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysBetween(referenceDate, targetDate) {
  const diff = startOfDay(referenceDate) - startOfDay(targetDate);
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function calculateRiskProfile(student) {
  if (!student.hasProgress) {
    return { score: 0, status: "pending" };
  }

  let risk = 0;

  if (daysBetween(REFERENCE_DATE, student.lastActiveAt) > 3) {
    risk += 30;
  }

  if (student.streakBroken) {
    risk += 20;
  }

  if (student.recentAccuracy < 0.5) {
    risk += 25;
  }

  if (student.duelLossStreak >= 3) {
    risk += 15;
  }

  if (student.missedDailyGoals >= 5) {
    risk += 10;
  }

  if (risk >= 50) {
    return { score: risk, status: "at_risk" };
  }

  if (risk >= 25) {
    return { score: risk, status: "warning" };
  }

  return { score: risk, status: "on_track" };
}

function getAssignmentBucket(assignment) {
  if (assignment.completionRate >= 0.95) {
    return "completed";
  }

  const dueDate = new Date(assignment.dueAt);
  const dayDiff = daysBetween(REFERENCE_DATE, dueDate);

  if (dayDiff > 0) {
    return "overdue";
  }

  if (dayDiff === 0) {
    return "today";
  }

  return "upcoming";
}

function enrichStudent(student) {
  const risk = calculateRiskProfile(student);
  const classroom = getClassroom(student.classId);

  return {
    ...student,
    ...risk,
    className: classroom?.name ?? student.classId,
    daysSinceActive: daysBetween(REFERENCE_DATE, student.lastActiveAt),
    focusTopic: student.topicMastery.length
      ? [...student.topicMastery].sort((left, right) => left.masteryPercent - right.masteryPercent)[0].topicName
      : "Henüz veri yok"
  };
}

function enrichAssignment(assignment) {
  const classroom = classrooms.find((item) => item.id === assignment.classId);

  return {
    ...assignment,
    className: classroom?.name ?? "Sınıf",
    bucket: getAssignmentBucket(assignment)
  };
}

const enrichedStudents = students.map(enrichStudent);
const enrichedAssignments = assignments.map(enrichAssignment);

export function getViewerRole(searchParams) {
  return readSearchParam(searchParams, "role") ?? teacher.role;
}

export function getReportFilters(searchParams) {
  const classId = readSearchParam(searchParams, "classId") ?? "all";
  const dateRange = readSearchParam(searchParams, "dateRange") ?? "week";
  const risk = readSearchParam(searchParams, "risk") ?? "all";
  const activity = readSearchParam(searchParams, "activity") ?? "all";
  const assignmentStatus = readSearchParam(searchParams, "assignmentStatus") ?? "all";
  const assignmentId = readSearchParam(searchParams, "assignmentId") ?? "";

  return {
    classId,
    dateRange,
    risk,
    activity,
    assignmentStatus,
    assignmentId,
    periodLabel: REPORT_RANGE_OPTIONS.find((option) => option.value === dateRange)?.label ?? "Bu Hafta"
  };
}

export function getClassOptions() {
  return [{ value: "all", label: "Tüm Sınıflar" }].concat(
    classrooms.map((item) => ({
      value: item.id,
      label: item.name
    }))
  );
}

export function getAssignmentsForClass(classId) {
  return enrichedAssignments.filter((assignment) => assignment.classId === classId);
}

export function getStudentsForClass(classId) {
  return enrichedStudents.filter((student) => student.classId === classId);
}

export function getClassroom(classId) {
  return classrooms.find((item) => item.id === classId);
}

function getSelectedClasses(classId) {
  if (!classId || classId === "all") {
    return classrooms;
  }

  return classrooms.filter((item) => item.id === classId);
}

function getSelectedSnapshots(classId, dateRange) {
  return getSelectedClasses(classId).map((item) => ({
    classId: item.id,
    name: item.name,
    ...classSnapshots[item.id][dateRange]
  }));
}

function getSelectedCurriculumRows(classId) {
  const classIds = getSelectedClasses(classId).map((item) => item.id);
  return curriculumProgress
    .filter((row) => classIds.includes(row.classId))
    .map((row) => ({
      ...row,
      className: getClassroom(row.classId)?.name ?? row.classId
    }));
}

function getSelectedStudents(classId) {
  const classIds = getSelectedClasses(classId).map((item) => item.id);
  return enrichedStudents.filter((student) => classIds.includes(student.classId));
}

function getSelectedAssignments(classId) {
  const classIds = getSelectedClasses(classId).map((item) => item.id);
  return enrichedAssignments.filter((assignment) => classIds.includes(assignment.classId));
}

function buildAggregateTrend(snapshots) {
  const fallback = {
    labels: [],
    current: [],
    previous: []
  };

  if (!snapshots.length) {
    return fallback;
  }

  const { labels } = snapshots[0].trend;

  return {
    labels,
    current: labels.map((_, index) => average(snapshots.map((snapshot) => snapshot.trend.current[index] ?? 0))),
    previous: labels.map((_, index) => average(snapshots.map((snapshot) => snapshot.trend.previous[index] ?? 0)))
  };
}

function buildActionRecommendation(curriculumRows, selectedAssignments) {
  const weakestTopic = [...curriculumRows]
    .filter((row) => row.assignedCount > 0)
    .sort((left, right) => left.coveragePercent - right.coveragePercent)[0];

  if (!weakestTopic) {
    return {
      title: "İlk ödevi oluştur",
      description: "Henüz ödev atanmamış sınıfta kısa bir journey node setiyle veri toplamaya başlayın.",
      ctaLabel: "Ödev oluştur",
      href: "/assignments/new"
    };
  }

  const relatedAssignment = selectedAssignments.find((assignment) =>
    assignment.topicTags.some((tag) => slugify(tag).includes(slugify(weakestTopic.topicName)))
  );

  return {
    title: `${weakestTopic.topicName} yeniden güçlendirilmeli`,
    description: `${weakestTopic.topicName} konusu ${formatDate(REFERENCE_DATE)} itibarıyla en düşük kapsama oranına sahip. Öğretmen aksiyonu için aynı konuda kısa bir tekrar ödevi öneriliyor.`,
    ctaLabel: "Aynı konudan yeni ödev ata",
    href: relatedAssignment
      ? `/assignments/new?classId=${relatedAssignment.classId}&topic=${slugify(weakestTopic.topicName)}`
      : "/assignments/new"
  };
}

function buildEmptyState(classId) {
  const selectedClass = classId === "all" ? null : getClassroom(classId);

  if (!classrooms.length) {
    return {
      type: "no_classes",
      title: "İlk sınıfınızı oluşturarak başlayın",
      description: "Dashboard veri göstermek yerine sizi doğrudan ilk sınıf kurulumuna yönlendirir.",
      ctaLabel: "Sınıf oluştur",
      href: "/classes"
    };
  }

  if (selectedClass && !getAssignmentsForClass(selectedClass.id).length) {
    return {
      type: "no_assignments",
      title: `${selectedClass.name} için henüz ödev yok`,
      description: "Öğretmen raporlarının anlamlı hale gelmesi için önce en az bir journey node veya soru seti atanmalı.",
      ctaLabel: "İlk ödevi oluştur",
      href: `/assignments/new?classId=${selectedClass.id}`
    };
  }

  if (
    selectedClass &&
    getStudentsForClass(selectedClass.id).length &&
    getStudentsForClass(selectedClass.id).every((student) => !student.hasProgress)
  ) {
    return {
      type: "no_progress",
      title: `${selectedClass.name} için henüz ilerleme verisi yok`,
      description: "Öğrenciler davet edilmiş görünüyor, ancak öğrenci uygulamasından senkron veri henüz gelmemiş.",
      ctaLabel: "Davet kodunu paylaş",
      href: "/classes"
    };
  }

  return null;
}

export function getDashboardOverview(filters) {
  const selectedSnapshots = getSelectedSnapshots(filters.classId, filters.dateRange);
  const selectedStudents = getSelectedStudents(filters.classId).filter((student) => student.hasProgress);
  const selectedAssignments = getSelectedAssignments(filters.classId);
  const selectedCurriculum = getSelectedCurriculumRows(filters.classId);
  const emptyState = buildEmptyState(filters.classId);
  const aggregateTrend = buildAggregateTrend(selectedSnapshots);
  const lastUpdatedAt = selectedSnapshots
    .map((snapshot) => snapshot.lastUpdatedAt)
    .sort()
    .slice(-1)[0];

  const completionRate = average(selectedSnapshots.map((snapshot) => snapshot.completionRate));
  const coveragePercent = average(selectedSnapshots.map((snapshot) => snapshot.coveragePercent));
  const overdueStudentCount = sum(selectedSnapshots.map((snapshot) => snapshot.overdueStudentCount));
  const atRiskCount = sum(selectedSnapshots.map((snapshot) => snapshot.atRiskCount));

  const kpis = [
    {
      label: "Ödev Tamamlama Oranı",
      value: completionRate,
      delta: completionRate - average(aggregateTrend.previous),
      tone: "teal"
    },
    {
      label: "Müfredat Kapsama",
      value: coveragePercent,
      delta: coveragePercent - average(selectedCurriculum.map((row) => row.avgAccuracy)),
      tone: "navy"
    },
    {
      label: "Geciken Öğrenci",
      value: overdueStudentCount,
      delta: -0.08,
      tone: "amber",
      kind: "count"
    },
    {
      label: "Riskli Öğrenci",
      value: atRiskCount,
      delta: -0.03,
      tone: "coral",
      kind: "count"
    }
  ];

  const priorityStudents = [...selectedStudents]
    .sort((left, right) => right.score - left.score || right.overdueAssignments - left.overdueAssignments)
    .slice(0, 5);

  const assignmentBuckets = {
    upcoming: selectedAssignments.filter((assignment) => assignment.bucket === "upcoming"),
    today: selectedAssignments.filter((assignment) => assignment.bucket === "today"),
    overdue: selectedAssignments.filter((assignment) => assignment.bucket === "overdue")
  };

  return {
    teacher,
    classes: getSelectedClasses(filters.classId),
    classOptions: getClassOptions(),
    selectedClass: filters.classId === "all" ? null : getClassroom(filters.classId),
    filters,
    kpis,
    trend: aggregateTrend,
    curriculumRows: [...selectedCurriculum].sort((left, right) => left.coveragePercent - right.coveragePercent),
    priorityStudents,
    assignmentBuckets,
    actionRecommendation: buildActionRecommendation(selectedCurriculum, selectedAssignments),
    emptyState,
    lastUpdatedAt
  };
}

export function getClassesOverview(filters) {
  return classrooms.map((classroom) => {
    const snapshot = classSnapshots[classroom.id][filters.dateRange];
    const classStudents = getStudentsForClass(classroom.id);
    const activeStudents = classStudents.filter((student) => student.daysSinceActive <= 3 && student.hasProgress).length;

    return {
      ...classroom,
      report: snapshot,
      activeStudents,
      atRiskStudents: classStudents.filter((student) => student.status === "at_risk").length,
      pendingSyncStudents: classStudents.filter((student) => !student.hasProgress).length,
      hasAssignments: getAssignmentsForClass(classroom.id).length > 0
    };
  });
}

export function getClassDetail(classId, filters) {
  const classroom = getClassroom(classId);

  if (!classroom) {
    return null;
  }

  const report = classSnapshots[classId][filters.dateRange];
  const classStudents = getStudentsForClass(classId);
  const classAssignments = getAssignmentsForClass(classId);
  const progressRows = curriculumProgress
    .filter((row) => row.classId === classId)
    .map((row) => ({ ...row, className: classroom.name }))
    .sort((left, right) => left.coveragePercent - right.coveragePercent);

  return {
    classroom,
    report,
    students: classStudents,
    assignments: classAssignments,
    curriculumRows: progressRows,
    riskGroups: {
      onTrack: classStudents.filter((student) => student.status === "on_track").length,
      warning: classStudents.filter((student) => student.status === "warning").length,
      atRisk: classStudents.filter((student) => student.status === "at_risk").length,
      pending: classStudents.filter((student) => student.status === "pending").length
    },
    overdueAssignments: classAssignments.filter((assignment) => assignment.bucket === "overdue"),
    emptyState: buildEmptyState(classId)
  };
}

export function getStudentsOverview(filters) {
  const studentsByClass = getSelectedStudents(filters.classId);
  let filteredStudents = studentsByClass;

  if (filters.risk !== "all") {
    filteredStudents = filteredStudents.filter((student) => student.status === filters.risk);
  }

  if (filters.activity === "inactive") {
    filteredStudents = filteredStudents.filter((student) => student.daysSinceActive > 3);
  }

  if (filters.activity === "active") {
    filteredStudents = filteredStudents.filter((student) => student.daysSinceActive <= 3);
  }

  if (filters.assignmentStatus === "overdue") {
    filteredStudents = filteredStudents.filter((student) => student.overdueAssignments > 0);
  }

  if (filters.assignmentStatus === "caught_up") {
    filteredStudents = filteredStudents.filter((student) => student.overdueAssignments === 0);
  }

  if (filters.assignmentId) {
    const assignment = enrichedAssignments.find((item) => item.id === filters.assignmentId);
    const pendingIds = new Set([...(assignment?.pendingStudentIds ?? []), ...(assignment?.lateStudentIds ?? [])]);
    filteredStudents = filteredStudents.filter((student) => pendingIds.has(student.id));
  }

  return {
    students: filteredStudents,
    allStudents: studentsByClass,
    relatedAssignment: filters.assignmentId
      ? enrichedAssignments.find((assignment) => assignment.id === filters.assignmentId)
      : null
  };
}

export function getStudentDetail(studentId) {
  const student = enrichedStudents.find((item) => item.id === studentId);

  if (!student) {
    return null;
  }

  const studentAssignments = enrichedAssignments.filter(
    (assignment) =>
      assignment.pendingStudentIds.includes(student.id) || assignment.lateStudentIds.includes(student.id)
  );

  return {
    student,
    classroom: getClassroom(student.classId),
    assignments: studentAssignments,
    relatedCurriculum: curriculumProgress.filter((row) => row.classId === student.classId)
  };
}

export function getAssignmentsOverview(filters) {
  const selectedAssignments = getSelectedAssignments(filters.classId);
  const filteredAssignments =
    filters.assignmentStatus === "all"
      ? selectedAssignments
      : selectedAssignments.filter((assignment) => assignment.bucket === filters.assignmentStatus);

  return {
    assignments: filteredAssignments,
    buckets: {
      upcoming: filteredAssignments.filter((assignment) => assignment.bucket === "upcoming"),
      today: filteredAssignments.filter((assignment) => assignment.bucket === "today"),
      overdue: filteredAssignments.filter((assignment) => assignment.bucket === "overdue"),
      completed: filteredAssignments.filter((assignment) => assignment.bucket === "completed")
    }
  };
}

export function getAssignmentDetail(assignmentId) {
  const assignment = enrichedAssignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    return null;
  }

  const classStudents = getStudentsForClass(assignment.classId);

  const submissions = classStudents.map((student) => {
    const isPending = assignment.pendingStudentIds.includes(student.id);
    const isLate = assignment.lateStudentIds.includes(student.id);

    let status = "completed";
    let accuracy = 0.6 + Math.random() * 0.35;
    let attempts = Math.floor(Math.random() * 3) + 1;
    let submittedAt = null;

    if (isPending) {
      status = "pending";
      accuracy = 0;
      attempts = 0;
    } else if (isLate) {
      status = "late";
      accuracy = 0.3 + Math.random() * 0.3;
      attempts = 1;
      const lateDate = new Date(assignment.dueAt);
      lateDate.setDate(lateDate.getDate() + 1 + Math.floor(Math.random() * 2));
      submittedAt = lateDate.toISOString();
    } else {
      const submitDate = new Date(assignment.createdAt);
      submitDate.setDate(submitDate.getDate() + 1 + Math.floor(Math.random() * 4));
      submittedAt = submitDate.toISOString();
    }

    return {
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      status,
      accuracy: Math.round(accuracy * 100) / 100,
      attempts,
      submittedAt
    };
  });

  return {
    assignment,
    submissions: submissions.sort((a, b) => {
      const order = { late: 0, pending: 1, completed: 2 };
      return (order[a.status] ?? 2) - (order[b.status] ?? 2);
    })
  };
}

export function getReportsOverview(filters) {
  const selectedSnapshots = getSelectedSnapshots(filters.classId, filters.dateRange);

  return {
    snapshots: selectedSnapshots,
    archive: selectedSnapshots.map((snapshot, index) => ({
      id: `${snapshot.classId}-${filters.dateRange}-${index}`,
      classId: snapshot.classId,
      title: `${snapshot.name} · ${filters.periodLabel} raporu`,
      summary: `${snapshot.overdueStudentCount} gecikme, ${snapshot.atRiskCount} riskli öğrenci, ${Math.round(
        snapshot.coveragePercent * 100
      )}% kapsama`,
      createdAt: snapshot.lastUpdatedAt
    })),
    trend: buildAggregateTrend(selectedSnapshots)
  };
}

export function getStaticCollections() {
  return {
    classrooms,
    students: enrichedStudents,
    assignments: enrichedAssignments
  };
}

/* ── Notifications ── */

const notifications = [
  {
    id: "notif-1",
    type: "risk_alert",
    title: "Berk Kurt riskli seviyeye geçti",
    description: "Son 5 gündür aktiflik yok, 2 geciken ödev mevcut.",
    studentId: "student-berk-kurt",
    classId: "class-7a",
    createdAt: "2026-04-29T09:00:00+03:00",
    read: false,
    priority: "high"
  },
  {
    id: "notif-2",
    type: "assignment_complete",
    title: "Liste İşlemleri Mini Quiz tamamlandı",
    description: "8-B Veri Yapıları sınıfında %100 tamamlanma oranına ulaşıldı.",
    classId: "class-8b",
    createdAt: "2026-04-29T08:30:00+03:00",
    read: false,
    priority: "low"
  },
  {
    id: "notif-3",
    type: "risk_alert",
    title: "Elif Şahin 6 gündür inaktif",
    description: "Kod Karşılaştırma konusunda %49 mastery, 3 geciken ödev.",
    studentId: "student-elif-sahin",
    classId: "class-8b",
    createdAt: "2026-04-28T14:20:00+03:00",
    read: false,
    priority: "high"
  },
  {
    id: "notif-4",
    type: "streak_break",
    title: "Ceren Ulu streak'ini kaybetti",
    description: "5 günlük seri kırıldı. Mevcut streak: 0 gün.",
    studentId: "student-ceren-ulu",
    classId: "class-7a",
    createdAt: "2026-04-28T10:15:00+03:00",
    read: true,
    priority: "medium"
  },
  {
    id: "notif-5",
    type: "assignment_due",
    title: "Hata Avcısı Seti bugün son gün",
    description: "7-A Algoritma sınıfında %58 tamamlanma. 10 öğrenci henüz teslim etmedi.",
    classId: "class-7a",
    createdAt: "2026-04-29T07:00:00+03:00",
    read: false,
    priority: "medium"
  },
  {
    id: "notif-6",
    type: "milestone",
    title: "Deniz Can 1500 XP'ye ulaştı! 🎉",
    description: "8-B Veri Yapıları sınıfının en aktif öğrencisi.",
    studentId: "student-deniz-can",
    classId: "class-8b",
    createdAt: "2026-04-28T16:45:00+03:00",
    read: true,
    priority: "low"
  },
  {
    id: "notif-7",
    type: "system",
    title: "Haftalık rapor hazır",
    description: "Bu hafta 3 sınıfınız için detaylı rapor oluşturuldu. PDF olarak indirebilirsiniz.",
    createdAt: "2026-04-28T09:00:00+03:00",
    read: true,
    priority: "low"
  },
  {
    id: "notif-8",
    type: "assignment_overdue",
    title: "Kod Karşılaştırma Hız Turu gecikti",
    description: "8-B Veri Yapıları sınıfında son tarih geçti. %47 tamamlanma.",
    classId: "class-8b",
    createdAt: "2026-04-27T18:00:00+03:00",
    read: true,
    priority: "high"
  }
];

export function getNotifications() {
  return {
    items: notifications,
    unreadCount: notifications.filter((n) => !n.read).length
  };
}

export function getTeacherProfile() {
  return {
    ...teacher,
    classrooms: classrooms.map((c) => ({
      id: c.id,
      name: c.name,
      inviteCode: c.inviteCode,
      studentCount: c.studentCount,
      gradeBand: c.gradeBand
    })),
    preferences: {
      language: "tr",
      emailNotifications: true,
      riskAlerts: true,
      weeklyReport: true
    }
  };
}
