import { AssignmentComposer } from "@/components/assignment-composer";
import { UnauthorizedPanel } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { getClassOptions, getReportFilters, getViewerRole } from "@/lib/data";

export default function NewAssignmentPage({ searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const filters = getReportFilters(searchParams);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Ödev Oluşturucu"
        title="Yeni Ödev"
        description="Dashboard'da görülen zayıf konuya göre hızlı aksiyon aldıran öğretmen formu."
        meta={["Demo form", "Backend entegrasyonu için hazır arayüz"]}
      />
      <AssignmentComposer classOptions={getClassOptions()} initialClassId={filters.classId} />
    </div>
  );
}
