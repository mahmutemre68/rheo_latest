import { ComparisonChart } from "@/components/charts";
import { InfoPanel, UnauthorizedPanel } from "@/components/overview-panels";
import { PageHeader } from "@/components/page-header";
import { QueryToolbar } from "@/components/query-toolbar";
import {
  REPORT_RANGE_OPTIONS,
  getClassOptions,
  getReportFilters,
  getReportsOverview,
  getViewerRole
} from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default function ReportsPage({ searchParams }) {
  if (getViewerRole(searchParams) !== "teacher") {
    return <UnauthorizedPanel />;
  }

  const filters = getReportFilters(searchParams);
  const overview = getReportsOverview(filters);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="PDF ve Arşiv"
        title="Raporlar"
        description="Haftalık sınıf raporu, öğrenci bazlı görünüm ve konu bazlı kıyaslar aynı eksende toplanır."
        meta={[filters.periodLabel, `${overview.archive.length} arşiv kartı`]}
      />

      <QueryToolbar
        controls={[
          { key: "dateRange", label: "Dönem", value: filters.dateRange, options: REPORT_RANGE_OPTIONS },
          { key: "classId", label: "Sınıf", value: filters.classId, options: getClassOptions() }
        ]}
        showPrint
        note="Print akışı, filtrelenmiş görünümü PDF olarak dışa aktarmak için hazır."
      />

      <section className="stats-grid">
        <InfoPanel title="Sınıf raporu" value="Hazır" caption="PDF export uyumlu" />
        <InfoPanel title="Öğrenci raporu" value="Hazır" caption="Detay sayfası ile bağlantılı" />
        <InfoPanel title="Konu raporu" value="Hazır" caption="Müfredat tablosundan türetilir" />
        <InfoPanel
          title="Son export"
          value={overview.archive[0] ? formatDateTime(overview.archive[0].createdAt) : "Henüz yok"}
          caption="Demo zaman damgası"
        />
      </section>

      <ComparisonChart
        title="Rapor Dönemi Karşılaştırması"
        description="Seçili periyotta sınıf genel performansı ve önceki dönem referansı."
        trend={overview.trend}
      />

      <section className="report-archive-grid">
        {overview.archive.map((report) => (
          <article key={report.id} className="panel report-card">
            <p className="eyebrow">Arşiv</p>
            <h3>{report.title}</h3>
            <p>{report.summary}</p>
            <span>{formatDateTime(report.createdAt)}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
