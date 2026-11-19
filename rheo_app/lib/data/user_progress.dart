/// User progress model for Hive storage
/// Stores ELO rating, streaks, and game statistics
class UserProgress {
  int elo;
  int currentStreak;
  int bestStreak;
  int totalCorrect;
  int totalWrong;
  DateTime? lastPlayedDate;
  int dailyQuestionsToday;
  int dailyGoal;
  int selectedAvatarIndex;
  String nickname;
  bool hasSelectedInitialRank;
  bool isDarkMode;
  String locale;

  UserProgress({
    this.elo = 100,
    this.currentStreak = 0,
    this.bestStreak = 0,
    this.totalCorrect = 0,
    this.totalWrong = 0,
    this.lastPlayedDate,
    this.dailyQuestionsToday = 0,
    this.dailyGoal = 0,
    this.selectedAvatarIndex = 0,
    this.nickname = 'Oyuncu',
    this.hasSelectedInitialRank = false,
    this.isDarkMode = false,
    this.locale = 'tr',
  });

  /// Total questions answered
  int get totalQuestions => totalCorrect + totalWrong;

  /// Accuracy percentage
  double get accuracy => 
      totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  /// Whether user has set a daily goal
  bool get hasDailyGoal => dailyGoal > 0;

  /// Daily goal progress (0.0 - 1.0)
  double get dailyProgress => dailyGoal > 0 ? (dailyQuestionsToday / dailyGoal).clamp(0.0, 1.0) : 0.0;

  /// Is daily goal completed
  bool get dailyGoalCompleted => dailyGoal > 0 && dailyQuestionsToday >= dailyGoal;

  /// Check if played today
  bool get playedToday {
    if (lastPlayedDate == null) return false;
    final now = DateTime.now();
    return lastPlayedDate!.year == now.year &&
           lastPlayedDate!.month == now.month &&
           lastPlayedDate!.day == now.day;
  }

  /// Check if streak should be reset (missed a day)
  bool get shouldResetStreak {
    if (lastPlayedDate == null) return false;
    final now = DateTime.now();
    final yesterday = now.subtract(const Duration(days: 1));
    
    // If last played was before yesterday, streak is broken
    return lastPlayedDate!.isBefore(
      DateTime(yesterday.year, yesterday.month, yesterday.day)
    );
  }

  /// Convert to Map for Hive storage
  Map<String, dynamic> toMap() {
    return {
      'elo': elo,
      'currentStreak': currentStreak,
      'bestStreak': bestStreak,
      'totalCorrect': totalCorrect,
      'totalWrong': totalWrong,
      'lastPlayedDate': lastPlayedDate?.toIso8601String(),
      'dailyQuestionsToday': dailyQuestionsToday,
      'dailyGoal': dailyGoal,
      'selectedAvatarIndex': selectedAvatarIndex,
      'nickname': nickname,
      'hasSelectedInitialRank': hasSelectedInitialRank,
      'isDarkMode': isDarkMode,
      'locale': locale,
    };
  }

  /// Create from Map (Hive storage)
  factory UserProgress.fromMap(Map<dynamic, dynamic> map) {
    return UserProgress(
      elo: map['elo'] ?? 0,
      currentStreak: map['currentStreak'] ?? 0,
      bestStreak: map['bestStreak'] ?? 0,
      totalCorrect: map['totalCorrect'] ?? 0,
      totalWrong: map['totalWrong'] ?? 0,
      lastPlayedDate: map['lastPlayedDate'] != null 
          ? DateTime.tryParse(map['lastPlayedDate'].toString()) 
          : null,
      dailyQuestionsToday: map['dailyQuestionsToday'] ?? 0,
      dailyGoal: map['dailyGoal'] ?? 0,
      selectedAvatarIndex: map['selectedAvatarIndex'] ?? 0,
      nickname: map['nickname'] ?? 'Oyuncu',
      hasSelectedInitialRank: map['hasSelectedInitialRank'] ?? false,
      isDarkMode: map['isDarkMode'] ?? false,
      locale: map['locale'] ?? 'tr',
    );
  }
}
