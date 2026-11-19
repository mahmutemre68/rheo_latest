import { AssignmentBoard, CurriculumTable, StudentsTable } from "@/components/data-tables";
import { EngagementPanel, Leaderboard } from "@/components/engagement-charts";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  EmptyStatePanel,
  InfoPanel,
  NotFoundPanel,
  UnauthorizedPanel
} from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { QueryToolbar } from "@/components/query-toolbar";
import {
  REPORT_RANGE_OPTIONS,
  getClassDetail,
  getReportFilters,
  getViewerRole
} from "@/lib/data";
import { formatInteger, formatPercent } from "@/lib/format";

export default function ClassDetailPage({ params, searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const filters = getReportFilters(searchParams);
  const detail = getClassDetail(params.classId, filters);

  if (!detail) {
    return (
      <NotFoundPanel
        title="İstenen sınıf bulunamadı"
        description="URL'deki sınıf kodu mevcut demo veri kümesinde yer almıyor."
      />
    );
  }

  if (detail.emptyState) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Sınıf Raporu"
          title={detail.classroom.name}
          description="Bu sınıf için veri akışı henüz oluşmamış durumda."
          meta={[detail.classroom.curriculumTrack]}
        />
        <QueryToolbar
          controls={[{ key: "dateRange", label: "Dönem", value: filters.dateRange, options: REPORT_RANGE_OPTIONS }]}
          showPrint
        />
        <EmptyStatePanel {...detail.emptyState} />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <Breadcrumb items={[
        { label: "Sınıflar", href: "/classes" },
        { label: detail.classroom.name }
      ]} />

      <PageHeader
        eyebrow="Sınıf Raporu"
        title={detail.classroom.name}
        description="Tek sınıf seviyesinde müfredat, risk ve gecikme görünümü."
        meta={[detail.classroom.curriculumTrack, filters.periodLabel]}
      />

      <QueryToolbar
        controls={[{ key: "dateRange", label: "Dönem", value: filters.dateRange, options: REPORT_RANGE_OPTIONS }]}
        secondaryAction={{ label: "Yeni ödev", href: `/assignments/new?classId=${detail.classroom.id}` }}
        showPrint
      />

      <section className="stats-grid">
        <InfoPanel title="Tamamlama" value={formatPercent(detail.report.completionRate)} caption="Seçili dönem" />
        <InfoPanel title="Kapsama" value={formatPercent(detail.report.coveragePercent)} caption="Atanan node'lar" />
        <InfoPanel title="Gecikme" value={formatInteger(detail.report.overdueStudentCount)} caption="Öğrenci" />
        <InfoPanel title="Risk" value={formatInteger(detail.report.atRiskCount)} caption="Öğrenci" />
      </section>

      <div className="content-grid">
        <EngagementPanel students={detail.students} className={detail.classroom.name} />
        <Leaderboard students={detail.students} />
      </div>

      <section className="risk-summary-grid">
        <InfoPanel title="Takipte" value={formatInteger(detail.riskGroups.onTrack)} caption="Öğrenci" />
        <InfoPanel title="Uyarı" value={formatInteger(detail.riskGroups.warning)} caption="Öğrenci" />
        <InfoPanel title="Riskli" value={formatInteger(detail.riskGroups.atRisk)} caption="Öğrenci" />
        <InfoPanel title="Sync bekleyen" value={formatInteger(detail.riskGroups.pending)} caption="Öğrenci" />
      </section>

      <CurriculumTable rows={detail.curriculumRows} />
      <StudentsTable students={detail.students.filter((s) => s.hasProgress)} showClass={false} />
      <AssignmentBoard
        buckets={{
          upcoming: detail.assignments.filter((a) => a.bucket === "upcoming"),
          today: detail.assignments.filter((a) => a.bucket === "today"),
          overdue: detail.overdueAssignments
        }}
      />
    </div>
  );
}
