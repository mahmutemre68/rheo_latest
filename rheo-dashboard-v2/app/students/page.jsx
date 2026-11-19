import { StudentsTable } from "@/components/data-tables";
import { EngagementPanel } from "@/components/engagement-charts";
import { EmptyStatePanel, InfoPanel, UnauthorizedPanel } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { QueryToolbar } from "@/components/query-toolbar";
import {
  getClassOptions,
  getReportFilters,
  getStudentsOverview,
  getViewerRole
} from "@/lib/data";
import { formatInteger } from "@/lib/format";

const riskOptions = [
  { value: "all", label: "Tüm risk seviyeleri" },
  { value: "on_track", label: "Takipte" },
  { value: "warning", label: "Uyarı" },
  { value: "at_risk", label: "Riskli" }
];

const activityOptions = [
  { value: "all", label: "Tüm aktiflik" },
  { value: "active", label: "Son 3 gün aktif" },
  { value: "inactive", label: "3+ gün inaktif" }
];

const assignmentOptions = [
  { value: "all", label: "Tüm ödev durumları" },
  { value: "overdue", label: "Geciken ödevi olanlar" },
  { value: "caught_up", label: "Takibi temiz öğrenciler" }
];

export default function StudentsPage({ searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const filters = getReportFilters(searchParams);
  const overview = getStudentsOverview(filters);
  const classOptions = getClassOptions();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Öğrenci İzleme"
        title="Öğrenciler"
        description="Risk, aktiflik ve ödev tamamlanma durumuna göre filtrelenebilir öğrenci tablosu."
        meta={[
          `${overview.students.length} öğrenci görünür`,
          overview.relatedAssignment ? `${overview.relatedAssignment.title} filtresi aktif` : "Genel görünüm"
        ]}
      />

      <QueryToolbar
        controls={[
          { key: "classId", label: "Sınıf", value: filters.classId, options: classOptions },
          { key: "risk", label: "Risk", value: filters.risk, options: riskOptions },
          { key: "activity", label: "Aktiflik", value: filters.activity, options: activityOptions },
          { key: "assignmentStatus", label: "Ödev durumu", value: filters.assignmentStatus, options: assignmentOptions }
        ]}
        note={overview.relatedAssignment ? "Seçili ödevin tamamlamayan öğrenci kümesi listeleniyor." : ""}
      />

      <section className="stats-grid">
        <InfoPanel title="Takipte" value={formatInteger(overview.allStudents.filter((s) => s.status === "on_track").length)} caption="Öğrenci" />
        <InfoPanel title="Uyarı" value={formatInteger(overview.allStudents.filter((s) => s.status === "warning").length)} caption="Öğrenci" />
        <InfoPanel title="Riskli" value={formatInteger(overview.allStudents.filter((s) => s.status === "at_risk").length)} caption="Öğrenci" />
        <InfoPanel title="Sync bekleyen" value={formatInteger(overview.allStudents.filter((s) => s.status === "pending").length)} caption="Öğrenci" />
      </section>

      {overview.students.length ? (
        <>
          <EngagementPanel students={overview.allStudents} />
          <StudentsTable students={overview.students} showClass />
        </>
      ) : (
        <EmptyStatePanel
          title="Bu filtrelerle eşleşen öğrenci bulunamadı"
          description="Risk, aktiflik veya ödev filtresini gevşeterek daha geniş öğrenci kümesine dönebilirsiniz."
        />
      )}
    </div>
  );
}
