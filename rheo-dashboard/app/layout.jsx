import "./globals.css";

import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "Rheo Öğretmen Dashboard",
  description: "Rheo K-12 öğretmenleri için raporlama odaklı dashboard MVP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <div className="mobile-blocker">
          <div className="mobile-card">
            <p className="eyebrow">Desktop First</p>
            <h2>Bu MVP masaüstü kullanım için tasarlandı</h2>
            <p>768px altı ekranlarda rapor yoğunluğu yerine masaüstünden kullanım önerilir.</p>
          </div>
        </div>
        <div className="desktop-app">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
