import '../logic/storage_service.dart';

/// Central localization class for TR/EN support.
/// Usage: `S.get('key')` or `S.homeTitle`
class S {
  S._();

  static String get locale => storageService.progress.locale;
  static bool get isEn => locale == 'en';

  /// Generic getter with key
  static String get(String key) => key;

  /// Convenience: pick between TR/EN directly
  static String tr(String trText, String enText) => isEn ? enText : trText;

  // ═══════════════════════════════════
  // HOME SCREEN
  // ═══════════════════════════════════
  static String get modSec => tr('MOD SEÇ', 'SELECT MODE');
  static String get ciktiTahmini => tr('Çıktı Tahmini', 'Output Prediction');
  static String get ciktiTahminiSub => tr('Kodu oku, çıktıyı tahmin et', 'Read the code, predict the output');
  static String get bugHunter => tr('Bug Hunter', 'Bug Hunter');
  static String get bugHunterSub => tr('Hatalı satırı bul', 'Find the buggy line');
  static String get timeAttack => tr('Time Attack', 'Time Attack');
  static String get timeAttackSub => tr('Zamana karşı yarış', 'Race against time');
  static String get yukselen => tr('Yükselen', 'Rising');
  static String get ustat => tr('Üstat', 'Master');
  static String get lig => tr('Lig', 'League');
  static String get yakinda => tr('Yakında', 'Coming Soon');
  static String get dogruSeri => tr('Doğru Seri', 'Correct Streak');
  static String get gunlukHedef => tr('Günlük Hedef', 'Daily Goal');
  static String get gunlukHedefBelirle => tr('Günlük hedefini belirle!', 'Set your daily goal!');
  static String soruCozuldu(int n) => tr('$n soru çözüldü', '$n questions solved');

  // ═══════════════════════════════════
  // QUIZ SCREEN
  // ═══════════════════════════════════
  static String get buKodunCiktisi => tr('Bu kodun çıktısı nedir?', 'What is the output of this code?');
  static String soruN(int cur, int total) => tr('Soru $cur/$total', 'Question $cur/$total');
  static String get dogruCevap => tr('Doğru Cevap!', 'Correct Answer!');
  static String get yanlisCevap => tr('Yanlış Cevap!', 'Wrong Answer!');
  static String get ilerlemekIcinTikla => tr('İlerlemek için tıklayınız.', 'Tap to continue.');
  static String get aciklama => tr('Açıklama', 'Explanation');
  static String get dogru => tr('Doğru', 'Correct');
  static String get yanlis => tr('Yanlış', 'Wrong');
  static String get basari => tr('Başarı', 'Accuracy');
  static String get apiKotaHatasi => tr('API kota limiti aşıldı.\nBirkaç dakika bekleyip tekrar dene.', 'API quota exceeded.\nWait a few minutes and try again.');
  static String get apiKeyHatasi => tr('API key geçersiz.\n.env dosyasını kontrol et.', 'API key is invalid.\nCheck your .env file.');
  static String get aiSoruHatasi => tr('AI sorusu üretilemedi.\nİnternet bağlantını kontrol et.', 'Could not generate AI question.\nCheck your internet connection.');
  static String get soruYukleniyor => tr('Soru hazırlanıyor...', 'Preparing question...');

  // ═══════════════════════════════════
  // QUIZ RESULT DIALOG
  // ═══════════════════════════════════
  static String get sonuclar => tr('Sonuçlar', 'Results');
  static String get tekrarDene => tr('Tekrar Dene', 'Try Again');
  static String get anaMenu => tr('Ana Menü', 'Main Menu');
  static String get toplam => tr('Toplam', 'Total');
  static String get kolay => tr('Kolay', 'Easy');
  static String get orta => tr('Orta', 'Medium');
  static String get zor => tr('Zor', 'Hard');

  // ═══════════════════════════════════
  // TOPIC DIALOG
  // ═══════════════════════════════════
  static String get konuSec => tr('Konu Seç', 'Select Topic');
  static String get konuSecSub => tr('Çalışmak istediğin konuyu seç', 'Choose a topic to practice');
  static String get tumu => tr('Tümü', 'All');
  static String get degiskenler => tr('Değişkenler', 'Variables');
  static String get donguler => tr('Döngüler', 'Loops');
  static String get kosullar => tr('Koşullar', 'Conditions');
  static String get fonksiyonlar => tr('Fonksiyonlar', 'Functions');
  static String get listeler => tr('Listeler', 'Lists');
  static String get stringler => tr('Stringler', 'Strings');
  static String get diziler => tr('Diziler', 'Arrays');
  static String get oopLabel => tr('OOP', 'OOP');
  static String get ozyineleme => tr('Özyineleme', 'Recursion');
  static String get siralama => tr('Sıralama', 'Sorting');
  static String get yiginKuyruk => tr('Yığın & Kuyruk', 'Stack & Queue');
  static String get aiDestekli => tr('AI Destekli', 'AI Powered');

  // ═══════════════════════════════════
  // SETTINGS SCREEN
  // ═══════════════════════════════════
  static String get ayarlar => tr('Ayarlar', 'Settings');
  static String get sesEfektleri => tr('Ses Efektleri', 'Sound Effects');
  static String get sesEfektleriSub => tr('Doğru/yanlış sesleri', 'Correct/wrong sounds');
  static String get bildirimler => tr('Bildirimler', 'Notifications');
  static String get bildirimlerSub => tr('Günlük hatırlatmalar (18:00)', 'Daily reminders (18:00)');
  static String get tema => tr('Tema', 'Theme');
  static String get temaSub => tr('Koyu arka plan ve açık yazılar', 'Dark background and light text');
  static String get dil => tr('Dil', 'Language');
  static String get dilSub => tr('Arayüz ve içerik dili', 'Interface and content language');
  static String get geriBildirim => tr('Geri Bildirim Gönder', 'Send Feedback');
  static String get geriBildirimSub => tr('Önerilerinizi paylaşın', 'Share your suggestions');
  static String get hakkinda => tr('Hakkında', 'About');
  static String get versiyon => tr('Versiyon', 'Version');
  static String get iletisim => tr('İletişim', 'Contact');
  static String get ilerlemeySifirla => tr('İlerlemeyi Sıfırla', 'Reset Progress');
  static String get ilerlemeySifirlaTitle => tr('İlerlemeyi Sıfırla?', 'Reset Progress?');
  static String get ilerlemeySifirlaMesaj => tr(
    'Tüm ELO puanın, serilerin ve istatistiklerin silinecek. Bu işlem geri alınamaz.',
    'All your ELO points, streaks, and stats will be deleted. This cannot be undone.',
  );
  static String get iptal => tr('İptal', 'Cancel');
  static String get sifirla => tr('Sıfırla', 'Reset');
  static String get ilerlemeSifirlandi => tr('İlerleme sıfırlandı', 'Progress has been reset');
  static String get gizlilikPolitikasi => tr('Gizlilik Politikası', 'Privacy Policy');

  // ═══════════════════════════════════
  // PROFILE SCREEN
  // ═══════════════════════════════════
  static String get ozellestir => tr('Özelleştir', 'Customize');
  static String get istatistikler => tr('İSTATİSTİKLER', 'STATISTICS');
  static String get dogruluk => tr('Doğruluk', 'Accuracy');
  static String get guncelDogruSeri => tr('Güncel Doğru Seri', 'Current Streak');
  static String get enIyiDogruSeri => tr('En İyi Doğru Seri', 'Best Streak');
  static String get guncelGirisSeri => tr('Güncel Giriş Serisi', 'Login Streak');
  static String get enIyiGirisSeri => tr('En İyi Giriş Serisi', 'Best Login Streak');
  static String get basarimlar => tr('Başarımlar', 'Achievements');
  static String basarimKilidi(int unlocked, int total) => tr(
    '$unlocked /$total başarım kilidi açıldı',
    '$unlocked /$total achievements unlocked',
  );
  static String get cokYakinda => tr('Çok Yakında! 🚀', 'Coming Soon! 🚀');

  // ═══════════════════════════════════
  // RANK SCREEN
  // ═══════════════════════════════════
  static String get rankUstat => tr('Üstat', 'Master');
  static String get rankUsta => tr('Usta', 'Expert');
  static String get rankUzman => tr('Uzman', 'Specialist');
  static String get rankDeneyimli => tr('Deneyimli', 'Experienced');
  static String get rankYukselen => tr('Yükselen', 'Rising');
  static String get rankCaylak => tr('Çaylak', 'Rookie');
  static String get rutbeSistemi => tr('Rütbe Sistemi', 'Rank System');
  static String get rutbeler => tr('RÜTBELER', 'RANKS');
  static String get puanimiSifirla => tr('Puanımı Sıfırla', 'Reset My Score');

  // ═══════════════════════════════════
  // ONBOARDING
  // ═══════════════════════════════════
  static String get hosGeldin => tr('Hoş Geldin! 👋', 'Welcome! 👋');
  static String get atla => tr('Atla', 'Skip');
  static String get basla => tr('Başla', 'Start');
  static String get onboardBody1 => tr(
    'Kod parçacıklarını incele ve çıktıyı tahmin et.\nIDE açmadan, sadece parmak ucunuzla.',
    'Examine code snippets and predict the output.\nNo IDE needed, just your fingertips.',
  );
  static String get onboardBody2 => tr(
    'Hatalı satırı bul ve tıkla!\nGerçek debugging kaslarını geliştir.',
    'Find the buggy line and tap it!\nBuild real debugging muscles.',
  );
  static String get yuksel => tr('Yüksel', 'Level Up');
  static String get onboardBody3 => tr(
    'Her doğruyla ELO puanını artır.\nRakiplerini geride bırak.',
    'Increase your ELO with every correct answer.\nOutperform your rivals.',
  );

  // ═══════════════════════════════════
  // ABOUT SCREEN
  // ═══════════════════════════════════
  static String get hakkimizda => tr('Hakkımızda', 'About Us');
  static String get uygulamaHakkinda => tr('Uygulama Hakkında', 'About the App');
  static String get uygulamaAciklama => tr(
    'Rheo, kod okuma becerilerini geliştirmek için tasarlanmış eğlenceli bir oyun. '
    'Python, Java ve JavaScript dillerinde çeşitli kod parçacıklarını analiz ederek çıktılarını tahmin et.',
    'Rheo is a fun game designed to improve your code reading skills. '
    'Analyze code snippets in Python, Java, and JavaScript and predict their outputs.',
  );
  static String get gelistiriciEkip => tr('GELİŞTİRİCİ EKİP', 'DEVELOPER TEAM');

  // ═══════════════════════════════════
  // BUG HUNT SCREEN
  // ═══════════════════════════════════
  static String get hataliSatiriBul => tr('Hatalı satırı bul', 'Find the buggy line');
  static String get satiraTikla => tr('Hatalı satıra tıkla', 'Tap the buggy line');
  static String get buSatirdaHataVar => tr('Bu satırda hata var!', 'This line has a bug!');
  static String get buSatirDogru => tr('Bu satır doğru.', 'This line is correct.');
  static String get bugHuntSonuc => tr('Bug Hunt Sonuçları', 'Bug Hunt Results');

  // ═══════════════════════════════════
  // TIME ATTACK SCREEN
  // ═══════════════════════════════════
  static String get sureBitti => tr('Süre Bitti!', 'Time\'s Up!');
  static String get timeAttackSonuc => tr('Time Attack Sonuçları', 'Time Attack Results');

  // ═══════════════════════════════════
  // LEADERBOARD
  // ═══════════════════════════════════
  static String get liderTablosu => tr('Lider Tablosu', 'Leaderboard');

  // ═══════════════════════════════════
  // DAILY GOAL
  // ═══════════════════════════════════
  static String get gunlukHedefAyarla => tr('Günlük Hedef Ayarla', 'Set Daily Goal');
  static String get gunlukSoruSayisi => tr('Günlük soru sayısı', 'Daily question count');
  static String get kaydet => tr('Kaydet', 'Save');
  static String get tamam => tr('Tamam', 'OK');

  // ═══════════════════════════════════
  // INITIAL RANK / LEVEL SELECT
  // ═══════════════════════════════════
  static String get seviyeSecimi => tr('Seviye Seçimi', 'Select Level');
  static String get onayla => tr('Onayla', 'Confirm');

  // ═══════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════
  static String get yediGunSerisi => tr('7 Gün Serisi', '7-Day Streak');
  static String get yediGunAciklama => tr('7 gün üst üste oyna', 'Play for 7 consecutive days');
  static String get otuzGunSerisi => tr('30 Gün Serisi', '30-Day Streak');
  static String get otuzGunAciklama => tr('30 gün üst üste oyna', 'Play for 30 consecutive days');
  static String get doksanGunSerisi => tr('90 Gün Serisi', '90-Day Streak');
  static String get doksanGunAciklama => tr('90 gün üst üste oyna', 'Play for 90 consecutive days');
  static String get yilSerisi => tr('365 Gün Serisi', '365-Day Streak');
  static String get yilAciklama => tr('1 yıl boyunca her gün oyna', 'Play every day for a whole year');
  static String get onSoru => tr('10 Soru', '10 Questions');
  static String get onSoruAciklama => tr('10 soru çöz', 'Solve 10 questions');
  static String get yuzSoru => tr('100 Soru', '100 Questions');
  static String get yuzSoruAciklama => tr('100 soru çöz', 'Solve 100 questions');
  static String get binSoru => tr('1000 Soru', '1000 Questions');
  static String get binSoruAciklama => tr('1000 soru çöz', 'Solve 1000 questions');
  static String get onDogru => tr('10 Doğru', '10 Correct');
  static String get onDogruAciklama => tr('10 doğru cevap ver', 'Get 10 correct answers');
  static String get yuzDogru => tr('100 Doğru', '100 Correct');
  static String get yuzDogruAciklama => tr('100 doğru cevap ver', 'Get 100 correct answers');
  static String get binDogru => tr('1000 Doğru', '1000 Correct');
  static String get binDogruAciklama => tr('1000 doğru cevap ver', 'Get 1000 correct answers');

  // ═══════════════════════════════════
  // MASCOT MESSAGES
  // ═══════════════════════════════════
  static String get selamSabah => tr('Günaydın! ☀️', 'Good morning! ☀️');
  static String get selamOgle => tr('İyi öğlenler! 🌤️', 'Good afternoon! 🌤️');
  static String get selamAksam => tr('İyi akşamlar! 🌙', 'Good evening! 🌙');
  static String get selamGece => tr('Gece kuşu! 🦉', 'Night owl! 🦉');

  // Correct messages
  static List<String> get correctMessages => isEn
    ? ['Perfect! 🎯', 'You are on fire! 🔥', 'Wow, awesome! ✨', 'Amazing! 💫', 'Keep it up! 🚀',
       'Brilliant! 🌟', 'You got it! ✅', 'Smooth! 😎']
    : ['Mükemmel! 🎯', 'Ateş topusun! 🔥', 'Vay be, harika! ✨', 'İnanılmaz! 💫', 'Devam et! 🚀',
       'Parlak zeka! 🌟', 'Bildin! ✅', 'Pürüzsüz! 😎'];

  // Wrong messages
  static List<String> get wrongMessages => isEn
    ? ['Not quite! 🤔', 'Try again! 💪', 'So close! 😅', 'Don\'t give up! 🌱', 'Mistakes teach! 📚',
       'Keep pushing! 💪', 'You\'ll get it! 🌟', 'Learning moment! 🧠']
    : ['Olmadı! 🤔', 'Tekrar dene! 💪', 'Az kaldı! 😅', 'Pes etme! 🌱', 'Hata öğretir! 📚',
       'Devam! 💪', 'Yaparsın! 🌟', 'Öğrenme fırsatı! 🧠'];

  // Streak warnings
  static List<String> get streakWarnings => isEn
    ? ['Your streak is at risk! 🔥', 'Don\'t break your streak! ⚡', 'One more day, keep going! 💪']
    : ['Serin riske giriyor! 🔥', 'Seriyi bozma! ⚡', 'Bir gün daha, devam! 💪'];

  // Result comments by accuracy
  static List<String> resultComment90 = [];
  static List<String> getResultComment(int accuracy) {
    if (accuracy >= 90) return isEn
      ? ['Legendary! 🏆', 'Incredible! You nailed it! 🤯', 'You\'re a master! 👑']
      : ['Efsane! 🏆', 'Mükemmelsin, çılgın! 🤯', 'Ustasın! Eline sağlık! 👑'];
    if (accuracy >= 70) return isEn
      ? ['Great job! 🌟', 'Impressive! Well done! 💪', 'Super work! 🔥', 'Keep it up! 🚀']
      : ['Çok iyi gidiyorsun! 🌟', 'Etkileyici! Bravo! 💪', 'Süper çalışma! 🔥', 'Böyle devam! 🚀'];
    if (accuracy >= 40) return isEn
      ? ['Not bad! 👍', 'You\'re improving! 📈', 'Keep practicing! 💪', 'Half way there! 💪']
      : ['İyi gidiyorsun! 👍', 'Fena değil, gelişiyorsun! 📈', 'Pratik yap! 💪', 'Yarısını bildin, devam! 💪'];
    return isEn
      ? ['Everyone starts somewhere! 🌱', 'Don\'t give up! 💪', 'Learning takes time! ⏳', 'Every master was once a beginner! 🎓']
      : ['Herkes baştan başlar! 🌱', 'Düşme kalk, devam et! 💪', 'Öğrenmek zaman alır, sabret! ⏳', 'Her usta bir çıraktı! 🎓'];
  }

  // Bug Hunt messages
  static List<String> get bugHuntCorrect => isEn
    ? ['Bug caught! 🐛', 'Sharp eyes! 🔍', 'Bug can\'t escape you! 🐞', 'Bug master! 🏆']
    : ['Bug avladın! 🐛', 'Keskin göz! 🔍', 'Bug senden kaçamaz! 🐞', 'Bug bulma ustası! 🏆'];
  static List<String> get bugHuntWrong => isEn
    ? ['This bug escaped! 🐛', 'Wrong line, try again! 🔄', 'Bug is hiding, look again! 👀']
    : ['Bu bug kaçtı! 🐛', 'Yanlış satır, tekrar bak! 🔄', 'Bug gizlenmiş, tekrar bak! 👀'];

  // Time up messages
  static List<String> get timeUpMessages => isEn
    ? ['Time\'s up! ⏱️', 'So close! ⏰', 'Be a little faster! 🏃']
    : ['Süre bitti! ⏱️', 'Az kaldı! ⏰', 'Biraz daha hızlı ol! 🏃'];

  // Waiting messages
  static List<String> get waitingMessages => isEn
    ? ['Preparing question... 🤖', 'Brain working... 🧠', 'A special question for you! ✨']
    : ['Soru hazırlıyorum... 🤖', 'Beyin çalışıyor... 🧠', 'Senin için özel bir soru! ✨'];

  // Daily goal complete
  static List<String> get dailyGoalComplete => isEn
    ? ['Daily goal done! 🎉', 'Today\'s mission complete! ✅', 'You reached your goal! 🏆', 'Awesome, done for today! 🌟']
    : ['Günlük hedef tamam! 🎉', 'Bugünkü görev tamamlandı! ✅', 'Bravo, hedefine ulaştın! 🏆', 'Müthişsin, bugünlük tamam! 🌟'];

  // Rank comments
  static String getRankComment(int elo) {
    if (elo < 200) return isEn
      ? 'Keep practicing to level up! 📈'
      : 'Bronze\'dan çıkman yakın! 🥉';
    if (elo < 400) return isEn
      ? 'Great progress! Keep going! ⭐'
      : 'Devam et, yükseliyorsun! 📈';
    if (elo < 600) return isEn
      ? 'Your level is impressive! 🥈'
      : 'Silver seviyen harika! 🥈';
    if (elo < 800) return isEn
      ? 'Almost at the top! ⭐'
      : 'Gold\'a az kaldı! ⭐';
    if (elo < 1000) return isEn
      ? 'Platinum! You\'re a legend! 💎'
      : 'Platinum! Efsanesin! 💎';
    return isEn
      ? 'Diamond is near! 💠'
      : 'Diamond yakın! 💠';
  }

  // ═══════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════
  static String get notifKodlarPaslaniyor => tr('🦦 Kodlar paslanıyor!', '🦦 Your coding is getting rusty!');
  static String get notifPratikYapmadinBody => tr(
    'Bugün henüz pratik yapmadın. Gel, birlikte çözelim!',
    'You haven\'t practiced today. Let\'s solve some together!',
  );

  // ═══════════════════════════════════
  // FEEDBACK DIALOG
  // ═══════════════════════════════════
  static String get feedbackTitle => tr(
    'Bir hata mı buldun? Önerilerin mi var?\nBize ulaşmaktan çekinme!',
    'Found a bug? Have suggestions?\nDon\'t hesitate to reach out!',
  );

  // ═══════════════════════════════════
  // ERROR / EMPTY STATES
  // ═══════════════════════════════════
  static String get birSeylerTersGitti => tr('Bir şeyler ters gitti', 'Something went wrong');
  static String get tekrarDeneButon => tr('Tekrar Dene', 'Try Again');

  // ═══════════════════════════════════
  // ELO RANK NAMES (used in elo_calculator)
  // ═══════════════════════════════════
  static String getRankName(int elo) {
    if (elo < 200) return tr('Çaylak', 'Rookie');
    if (elo < 400) return tr('Yükselen', 'Rising');
    if (elo < 600) return tr('Deneyimli', 'Experienced');
    if (elo < 800) return tr('Uzman', 'Specialist');
    if (elo < 1000) return tr('Usta', 'Expert');
    return tr('Üstat', 'Master');
  }

  // ═══════════════════════════════════
  // PRIVACY POLICY (simplified keys)
  // ═══════════════════════════════════
  static String get privacyTitle => tr('Gizlilik Politikası', 'Privacy Policy');

  // ═══════════════════════════════════
  // STATS SCREEN
  // ═══════════════════════════════════
  static String get istatistikBaslik => tr('İstatistikler', 'Statistics');
  static String get toplamSoru => tr('Toplam Soru', 'Total Questions');
  static String get dogruOran => tr('Doğruluk Oranı', 'Accuracy Rate');
  static String get enIyiSeri => tr('En İyi Seri', 'Best Streak');
  static String get mevcutSeri => tr('Mevcut Seri', 'Current Streak');

  // ═══════════════════════════════════
  // MISC
  // ═══════════════════════════════════
  static String get oyuncu => tr('Oyuncu', 'Player');
  static String get devamEt => tr('Devam Et', 'Continue');
  static String get kapat => tr('Kapat', 'Close');
  static String get evet => tr('Evet', 'Yes');
  static String get hayir => tr('Hayır', 'No');

  // ═══════════════════════════════════
  // AI SERVICE PROMPTS
  // ═══════════════════════════════════
  static String get aiPromptLanguage => isEn ? 'English' : 'Turkish';
  static String get aiQuestionTextLabel => isEn ? 'question' : 'soru_metni';
  static String get aiExplanationLabel => isEn ? 'explanation' : 'aciklama';
}
