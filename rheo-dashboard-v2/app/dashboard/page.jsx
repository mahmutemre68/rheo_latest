import Link from "next/link";
import { ComparisonChart, SparklineChart } from "@/components/charts";
import { CurriculumTable, PriorityStudentsTable, AssignmentBoard } from "@/components/data-tables";
import {
  EmptyStatePanel,
  InsightPanel,
  StatCard,
  UnauthorizedPanel,
  WelcomeBanner
} from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { QueryToolbar } from "@/components/query-toolbar";
import { RecentNotes } from "@/components/recent-notes";
import {
  REPORT_RANGE_OPTIONS,
  getClassOptions,
  getDashboardOverview,
  getReportFilters,
  getViewerRole
} from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default function DashboardPage({ searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const filters = getReportFilters(searchParams);
  const data = getDashboardOverview(filters);
  const classOptions = getClassOptions();

  if (data.emptyState) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Rapor Odaklı Dashboard"
          title="Öğretmen Genel Bakış"
          description="Sınıf, müfredat ve teslim görünürlüğü için tasarlanan haftalık çalışma alanı."
          meta={[filters.periodLabel]}
        />
        <QueryToolbar
          controls={[
            { key: "dateRange", label: "Dönem", value: filters.dateRange, options: REPORT_RANGE_OPTIONS },
            { key: "classId", label: "Sınıf", value: filters.classId, options: classOptions }
          ]}
          secondaryAction={{ label: "Yeni ödev", href: "/assignments/new" }}
          showPrint
        />
        <EmptyStatePanel {...data.emptyState} />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Rapor Odaklı Dashboard"
        title="Öğretmen Genel Bakış"
        description="Ödev ilerlemesi, müfredat kapsama ve müdahale gerektiren öğrenciler tek yüzeyde toplanır."
        meta={[
          filters.periodLabel,
          data.selectedClass ? data.selectedClass.name : "Tüm sınıflar",
          `Son güncelleme ${formatDateTime(data.lastUpdatedAt)}`
        ]}
      />

      <QueryToolbar
        controls={[
          { key: "dateRange", label: "Dönem", value: filters.dateRange, options: REPORT_RANGE_OPTIONS },
          { key: "classId", label: "Sınıf", value: filters.classId, options: classOptions }
        ]}
        secondaryAction={{ label: "Yeni ödev", href: "/assignments/new" }}
        showPrint
        note="PDF çıktısı mevcut filtreleri birebir yansıtır."
      />

      <WelcomeBanner
        teacherName={data.teacher.name}
        todayDueCount={data.assignmentBuckets.today.length}
        overdueCount={data.assignmentBuckets.overdue.length}
        atRiskCount={data.kpis.find(k => k.kind === "count" && k.tone === "coral")?.value || 0}
        urgentStudent={data.priorityStudents[0] || null}
      />

      <section className="stats-grid">
        {data.kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </section>

      {/* Hızlı Aksiyonlar */}
      <section className="quick-actions">
        <Link className="quick-action-card" href="/students?risk=at_risk">
          <span className="quick-action-icon risk">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          Riskli Öğrencileri Gör
        </Link>
        <Link className="quick-action-card" href="/assignments">
          <span className="quick-action-icon overdue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          Gecikmiş Ödevler
        </Link>
        <Link className="quick-action-card" href="/assignments/new">
          <span className="quick-action-icon create">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          Yeni Ödev Oluştur
        </Link>
      </section>

      <div className="content-grid">
        <ComparisonChart
          title={`${filters.periodLabel} vs önceki dönem`}
          description="Tamamlama çizgisindeki ivme, öğretmenin müdahale zamanını görünür kılar."
          trend={data.trend}
        />
        <SparklineChart title="Haftalık ritim görünümü" data={data.trend.current} />
      </div>

      <CurriculumTable rows={data.curriculumRows} />
      <PriorityStudentsTable students={data.priorityStudents} />
      <RecentNotes />
      <AssignmentBoard buckets={data.assignmentBuckets} />
      <InsightPanel {...data.actionRecommendation} />
    </div>
  );
}

