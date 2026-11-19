import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/foundation.dart';

/// Analytics Service - Firebase Analytics entegrasyonu
class AnalyticsService {
  static final AnalyticsService _instance = AnalyticsService._internal();
  factory AnalyticsService() => _instance;
  AnalyticsService._internal();

  FirebaseAnalytics? _analytics;
  FirebaseAnalyticsObserver? _observer;

  /// Initialize analytics
  Future<void> init() async {
    if (kIsWeb) {
      debugPrint('AnalyticsService: Web platformunda çalışıyor');
    }
    _analytics = FirebaseAnalytics.instance;
    _observer = FirebaseAnalyticsObserver(analytics: _analytics!);
  }

  /// Get observer for navigation tracking
  FirebaseAnalyticsObserver? get observer => _observer;

  // ==================== EVENTS ====================

  /// Quiz tamamlandığında
  Future<void> logQuizCompleted({
    required String language,
    required bool isCorrect,
    required int eloChange,
    required int newElo,
  }) async {
    await _analytics?.logEvent(
      name: 'quiz_completed',
      parameters: {
        'language': language,
        'is_correct': isCorrect,
        'elo_change': eloChange,
        'new_elo': newElo,
      },
    );
  }

  /// Bug hunt tamamlandığında
  Future<void> logBugHuntCompleted({
    required String language,
    required bool isCorrect,
    required int timeRemaining,
  }) async {
    await _analytics?.logEvent(
      name: 'bug_hunt_completed',
      parameters: {
        'language': language,
        'is_correct': isCorrect,
        'time_remaining': timeRemaining,
      },
    );
  }

  /// Time attack tamamlandığında
  Future<void> logTimeAttackCompleted({
    required String language,
    required int correctCount,
    required int totalQuestions,
    required int score,
  }) async {
    await _analytics?.logEvent(
      name: 'time_attack_completed',
      parameters: {
        'language': language,
        'correct_count': correctCount,
        'total_questions': totalQuestions,
        'score': score,
      },
    );
  }

  /// Achievement kazanıldığında
  Future<void> logAchievementUnlocked({
    required String achievementId,
    required String achievementTitle,
  }) async {
    await _analytics?.logEvent(
      name: 'achievement_unlocked',
      parameters: {
        'achievement_id': achievementId,
        'achievement_title': achievementTitle,
      },
    );
  }

  /// Streak güncelleme
  Future<void> logStreakUpdated({
    required int currentStreak,
    required int bestStreak,
  }) async {
    await _analytics?.logEvent(
      name: 'streak_updated',
      parameters: {
        'current_streak': currentStreak,
        'best_streak': bestStreak,
      },
    );
  }

  /// Dil değişikliği
  Future<void> logLanguageChanged({
    required String newLanguage,
  }) async {
    await _analytics?.logEvent(
      name: 'language_changed',
      parameters: {
        'new_language': newLanguage,
      },
    );
  }

  /// Onboarding tamamlandı
  Future<void> logOnboardingCompleted() async {
    await _analytics?.logEvent(name: 'onboarding_completed');
  }

  // ==================== USER PROPERTIES ====================

  /// Set user ELO level
  Future<void> setUserElo(int elo) async {
    String eloTier;
    if (elo < 1100) {
      eloTier = 'rookie';
    } else if (elo < 1300) {
      eloTier = 'bronze';
    } else if (elo < 1500) {
      eloTier = 'silver';
    } else if (elo < 1700) {
      eloTier = 'gold';
    } else if (elo < 1900) {
      eloTier = 'platinum';
    } else {
      eloTier = 'diamond';
    }
    
    await _analytics?.setUserProperty(name: 'elo_tier', value: eloTier);
    await _analytics?.setUserProperty(name: 'elo_score', value: elo.toString());
  }

  /// Set preferred language
  Future<void> setPreferredLanguage(String language) async {
    await _analytics?.setUserProperty(name: 'preferred_language', value: language);
  }
}

/// Global instance
final analyticsService = AnalyticsService();
