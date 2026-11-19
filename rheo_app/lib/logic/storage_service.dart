import 'package:hive_flutter/hive_flutter.dart';
import '../data/user_progress.dart';

/// Service for managing local storage with Hive
class StorageService {
  static const String _boxName = 'rheo_progress';
  static const String _progressKey = 'user_progress';
  
  Box? _box;
  UserProgress? _cachedProgress;

  /// Initialize Hive and open the box
  Future<void> init() async {
    await Hive.initFlutter();
    _box = await Hive.openBox(_boxName);
    _cachedProgress = loadProgress();
    
    // Check if streak should be reset
    if (_cachedProgress != null && _cachedProgress!.shouldResetStreak) {
      _cachedProgress!.currentStreak = 0;
      await saveProgress(_cachedProgress!);
    }
  }

  /// Get current user progress
  UserProgress get progress {
    _cachedProgress ??= loadProgress();
    return _cachedProgress!;
  }

  /// Load progress from storage
  UserProgress loadProgress() {
    if (_box == null) return UserProgress();
    
    final data = _box!.get(_progressKey);
    if (data == null) return UserProgress();
    
    return UserProgress.fromMap(Map<dynamic, dynamic>.from(data));
  }

  /// Save progress to storage
  Future<void> saveProgress(UserProgress progress) async {
    _cachedProgress = progress;
    await _box?.put(_progressKey, progress.toMap());
  }

  /// Update after answering a question
  Future<void> recordAnswer({
    required bool isCorrect,
    required int newElo,
  }) async {
    final p = progress;
    
    // Check if new day - reset daily counter
    final now = DateTime.now();
    if (p.lastPlayedDate != null) {
      final lastDate = p.lastPlayedDate!;
      if (lastDate.year != now.year || lastDate.month != now.month || lastDate.day != now.day) {
        p.dailyQuestionsToday = 0;
      }
    }
    
    p.elo = newElo;
    p.dailyQuestionsToday++;
    
    if (isCorrect) {
      p.totalCorrect++;
      p.currentStreak++;
      if (p.currentStreak > p.bestStreak) {
        p.bestStreak = p.currentStreak;
      }
    } else {
      p.totalWrong++;
      p.currentStreak = 0;
    }
    
    p.lastPlayedDate = now;
    
    await saveProgress(p);
  }

  /// Reset all progress
  Future<void> resetProgress() async {
    _cachedProgress = UserProgress();
    await saveProgress(_cachedProgress!);
  }

  /// Close the Hive box
  Future<void> close() async {
    await _box?.close();
  }
}

/// Global instance
final storageService = StorageService();
