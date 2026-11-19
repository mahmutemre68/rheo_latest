import Link from "next/link";

import { ClassesMatrix } from "@/components/data-tables";
import { InfoPanel, UnauthorizedPanel } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { QueryToolbar } from "@/components/query-toolbar";
import {
  REPORT_RANGE_OPTIONS,
  getClassesOverview,
  getReportFilters,
  getViewerRole
} from "@/lib/data";
import { formatInteger, formatPercent } from "@/lib/format";

export default function ClassesPage({ searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const filters = getReportFilters(searchParams);
  const classes = getClassesOverview(filters);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Sınıf Yapısı"
        title="Sınıflar"
        description="Kart ve tablo hibriti ile hangi sınıfın desteğe daha çok ihtiyaç duyduğu hızla görünür."
        meta={[`${classes.length} sınıf`, filters.periodLabel]}
      />

      <QueryToolbar
        controls={[{ key: "dateRange", label: "Dönem", value: filters.dateRange, options: REPORT_RANGE_OPTIONS }]}
        secondaryAction={{ label: "Davet kodları", href: "/classes" }}
      />

      <section className="class-card-grid">
        {classes.map((item) => (
          <article key={item.id} className="panel class-card">
            <div className="class-card-head">
              <div>
                <p className="eyebrow">{item.gradeBand}</p>
                <h3>{item.name}</h3>
              </div>
              <span className="topic-chip">{item.curriculumTrack}</span>
            </div>
            <p className="class-card-copy">
              {item.hasAssignments
                ? "Aktif sınıf. Haftalık rapor ve teslim durumu izlemeye hazır."
                : "Yeni açılmış sınıf. Önce ilk ödevi atayarak veri toplamaya başlayın."}
            </p>
            <div className="mini-stats">
              <InfoPanel
                title="Aktif öğrenci"
                value={`${formatInteger(item.activeStudents)}/${formatInteger(item.studentCount)}`}
                caption="Son 3 günde hareket"
              />
              <InfoPanel
                title="Tamamlama"
                value={formatPercent(item.report.completionRate)}
                caption="Seçili dönem"
              />
            </div>
            <div className="class-card-foot">
              <span>{formatInteger(item.atRiskStudents)} riskli öğrenci</span>
              <Link className="button button-secondary" href={`/classes/${item.id}?dateRange=${filters.dateRange}`}>
                Raporu aç
              </Link>
            </div>
          </article>
        ))}
      </section>

      <ClassesMatrix classes={classes} />
    </div>
  );
}
