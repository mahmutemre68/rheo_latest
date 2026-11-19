import { ComparisonChart, SparklineChart } from "@/components/charts";
import { CurriculumTable, PriorityStudentsTable, AssignmentBoard } from "@/components/data-tables";
import {
  EmptyStatePanel,
  InsightPanel,
  StatCard,
  UnauthorizedPanel
} from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { QueryToolbar } from "@/components/query-toolbar";
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

      <section className="stats-grid">
        {data.kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
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
      <AssignmentBoard buckets={data.assignmentBuckets} />
      <InsightPanel {...data.actionRecommendation} />
    </div>
  );
}
