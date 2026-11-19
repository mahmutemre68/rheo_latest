import { AssignmentBoard } from "@/components/data-tables";
import { EmptyStatePanel, InfoPanel, UnauthorizedPanel } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { QueryToolbar } from "@/components/query-toolbar";
import {
  getAssignmentsOverview,
  getClassOptions,
  getReportFilters,
  getViewerRole
} from "@/lib/data";
import { formatInteger } from "@/lib/format";

const assignmentStateOptions = [
  { value: "all", label: "Tüm durumlar" },
  { value: "upcoming", label: "Yaklaşan" },
  { value: "today", label: "Bugün son" },
  { value: "overdue", label: "Gecikmiş" },
  { value: "completed", label: "Tamamlanan" }
];

export default function AssignmentsPage({ searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const filters = getReportFilters(searchParams);
  const overview = getAssignmentsOverview(filters);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Teslim Takibi"
        title="Ödevler"
        description="Aktif, yaklaşan ve tamamlanmış ödevler öğretmenin aksiyon alacağı sırada gruplandı."
        meta={[`${overview.assignments.length} görünür ödev`]}
      />

      <QueryToolbar
        controls={[
          { key: "classId", label: "Sınıf", value: filters.classId, options: getClassOptions() },
          { key: "assignmentStatus", label: "Durum", value: filters.assignmentStatus, options: assignmentStateOptions }
        ]}
        secondaryAction={{ label: "Yeni ödev", href: "/assignments/new" }}
      />

      <section className="stats-grid">
        <InfoPanel title="Yaklaşan" value={formatInteger(overview.buckets.upcoming.length)} caption="Ödev" />
        <InfoPanel title="Bugün son" value={formatInteger(overview.buckets.today.length)} caption="Ödev" />
        <InfoPanel title="Gecikmiş" value={formatInteger(overview.buckets.overdue.length)} caption="Ödev" />
        <InfoPanel title="Tamamlanan" value={formatInteger(overview.buckets.completed.length)} caption="Ödev" />
      </section>

      {overview.assignments.length ? (
        <AssignmentBoard buckets={overview.buckets} showCompleted />
      ) : (
        <EmptyStatePanel
          title="Seçili filtrede gösterilecek ödev yok"
          description="Farklı bir sınıf ya da durum filtresi seçerek panoyu genişletebilirsiniz."
        />
      )}
    </div>
  );
}
