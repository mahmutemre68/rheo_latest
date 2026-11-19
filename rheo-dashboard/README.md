# Rheo Dashboard

Rheo K-12 için tasarlanmış bu MVP, öğretmenlerin sınıf performansını raporlama odaklı bir panelde görmesini amaçlayan ayrı bir `Next.js` uygulamasıdır.

## Bu sürümde neler var

- `app/dashboard`: ödev tamamlama, müfredat kapsama, müdahale listesi ve öğretmen aksiyon kutusu
- `app/classes`: sınıf kartları ve detay rapor görünümü
- `app/students`: filtrelenebilir öğrenci tablosu ve öğrenci detay hikayesi
- `app/assignments`: ödev durumu panosu ve demo amaçlı ödev oluşturucu
- `app/reports`: yazdırılabilir rapor ekranı ve arşiv kartları
- `lib/data.js`: öğretmen, sınıf, öğrenci, risk skoru ve rapor snapshot mock verileri

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000/dashboard` açılmalıdır.

## Demo notları

- Varsayılan rol `teacher` olarak gelir. Yetkisiz durum için URL’de `?role=student` denenebilir.
- Dashboard, `window.print()` tabanlı PDF export akışı kullanır.
- `class-10a` yeni açılmış sınıfı temsil eder; ödev ve sync boş durumları bu sınıfta görülebilir.
- Öğrenci ve ödev akışları mock veriyle beslendiği için backend yazma operasyonları demo seviyesindedir.
