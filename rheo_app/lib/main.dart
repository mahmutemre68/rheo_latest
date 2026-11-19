import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:rheo_app/ui/journey_webview_screen.dart';

import 'logic/language_service.dart';
import 'logic/analytics_service.dart';
import 'logic/ai_service.dart';
import 'logic/sound_service.dart';
import 'logic/notification_service.dart';

void main() async {
  // Zone ile tüm hataları yakala
  runZonedGuarded<Future<void>>(() async {
    WidgetsFlutterBinding.ensureInitialized();
    
    // Firebase başlat
    try {
      await Firebase.initializeApp();
      debugPrint('✅ Firebase initialized');
      
      // Crashlytics'e Flutter hatalarını gönder
      if (!kIsWeb) {
        FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
      }
      
      // Analytics başlat
      await analyticsService.init();
      debugPrint('✅ Analytics initialized');
    } catch (e) {
      debugPrint('⚠️ Firebase init error (google-services.json eksik olabilir): $e');
    }
    
    // Global error handler (fallback)
    FlutterError.onError ??= (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      debugPrint('Flutter Error: ${details.exception}');
    };
    
    // Hive başlat — path_provider FFI hatası olursa uygulama yine de çalışsın
    try {
      await Hive.initFlutter();
    } catch (e) {
      debugPrint('⚠️ Hive.initFlutter failed: $e (app continues without Hive)');
    }
    
    // Load environment variables (.env)
    try {
      await dotenv.load(fileName: '.env');
      debugPrint('✅ dotenv loaded');
    } catch (e) {
      debugPrint('⚠️ .env file not found: $e');
    }
    
    // Initialize AI service
    try {
      await aiService.init();
    } catch (e) {
      debugPrint('⚠️ AI service init failed: $e');
    }
    
    // Initialize services
    try {
      await languageService.init();
    } catch (e) {
      debugPrint('⚠️ Language service init failed: $e');
    }
    try {
      await soundService.init();
    } catch (e) {
      debugPrint('⚠️ Sound service init failed: $e');
    }
    try {
      await notificationService.init();
    } catch (e) {
      debugPrint('⚠️ Notification service init failed: $e');
    }
    
    runApp(const RheoApp());
  }, (error, stack) {
    // Zone dışı hatalar
    try {
      if (!kIsWeb) {
        FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      }
    } catch (_) {
      // Firebase başlatılmamışsa sessizce devam et
    }
    debugPrint('Zone Error: $error');
  });
}

class RheoApp extends StatelessWidget {
  const RheoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rheo',
      debugShowCheckedModeBanner: false,
      navigatorObservers: [
        if (analyticsService.observer != null) analyticsService.observer!,
      ],
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00D9FF),
          secondary: Color(0xFF00D9FF),
          surface: Color(0xFF1E1E1E),
        ),
      ),
      home: const JourneyWebViewScreen(),
    );
  }
}

