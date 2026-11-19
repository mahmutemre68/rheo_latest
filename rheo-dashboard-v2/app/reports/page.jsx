"use client";

import { useSearchParams } from "next/navigation";
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

export default function ReportsPage() {
  const sp = useSearchParams();
  const searchParams = Object.fromEntries(sp.entries());

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

      {/* Haftalık Rapor Önizleme */}
      <section className="panel report-preview">
        <div className="section-head">
          <div>
            <h3>📄 Haftalık Rapor Önizleme</h3>
            <p>{filters.periodLabel} dönemi için hazırlanan özet rapor.</p>
          </div>
          <button className="button button-primary" onClick={() => typeof window !== "undefined" && window.print()}>
            🖨 Yazdır / PDF
          </button>
        </div>
        <div className="report-preview-grid">
          {overview.archive.map((report) => (
            <div key={report.id} className="report-preview-card">
              <h4>{report.title.split(" · ")[0]}</h4>
              <div className="report-preview-stats">
                <div>
                  <span className="report-stat-label">Durum</span>
                  <strong className="report-stat-value">{report.summary.split(",")[0]}</strong>
                </div>
                <div>
                  <span className="report-stat-label">Dönem</span>
                  <strong className="report-stat-value">{filters.periodLabel}</strong>
                </div>
                <div>
                  <span className="report-stat-label">Tarih</span>
                  <strong className="report-stat-value">{formatDateTime(report.createdAt)}</strong>
                </div>
              </div>
              <p className="report-preview-summary">{report.summary}</p>
            </div>
          ))}
        </div>
      </section>

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
