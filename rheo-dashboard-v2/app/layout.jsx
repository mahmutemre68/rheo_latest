import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";

export const metadata = {
  title: "Rheo Öğretmen Dashboard",
  description: "Rheo K-12 öğretmenleri için premium raporlama dashboard'u"
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="mobile-blocker">
          <div className="mobile-card">
            <p className="eyebrow">Desktop First</p>
            <h2>Masaüstü kullanım önerilir</h2>
            <p>Dashboard deneyimi 768px ve üzeri ekranlarda optimize edilmiştir.</p>
          </div>
        </div>
        <div className="desktop-app">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
