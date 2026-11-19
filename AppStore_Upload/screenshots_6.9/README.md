# App Store ekran goruntuleri — 6.9" (1320x2868)

Bu goruntuler App Store Connect'e **oldugu gibi yuklenebilir**. Boyut, Apple'in
6.9" (iPhone 16/17 Pro Max) gereksinimiyle birebir uyusuyor ve tek bir 6.9" seti
tum kucuk iPhone boyutlarini kapsar — baska boyut yuklemeniz gerekmez.

## Nasil uretildi
Uygulamanin gonderilen paketteki web yigini (rheo_app/assets/journey-web) sistem
Chrome'unda 440x956 CSS / 3x olcekle acilip yakalandi. Yani icerik, IPA'nin
icindekiyle byte olarak ayni yigin. Emojiler macOS'un Apple Color Emoji
fontuyla cizildi — iOS'takiyle ayni glifler.

Neden iOS simulatorunden alinmadi: bu Mac'teki iOS 26.3 simulator runtime'inda
AppleColorEmoji.ttc dosyasi eksik, dolayisiyla oradaki her emoji tofu kutusu
cikiyor.

## Iceriik
| Dosya | Ekran |
|---|---|
| 01_journey.png  | Ogrenme yolculugu haritasi |
| 02_lesson.png   | Ders — kod okuma sorusu |
| 03_quests.png   | Gunluk ve haftalik gorevler |
| 04_league.png   | Lig / duello |
| 05_profile.png  | Profil, seri kalkani, istatistikler |

`tr-TR/` Turkce arayuz, `en-US/` Ingilizce arayuz. App Store Connect'te her
yerellestirmenin kendi ekran goruntusu setine yukleyin.

## Not
Goruntulerde durum cubugu (saat/pil) yok. Apple bunu zorunlu tutmuyor; birçok
uygulama pazarlama gorsellerini bu sekilde yukluyor.
