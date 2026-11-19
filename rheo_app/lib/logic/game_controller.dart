import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../data/question_model.dart';
import '../data/user_progress.dart';
import 'elo_calculator.dart';
import 'storage_service.dart';

/// Controls quiz logic with adaptive difficulty system.
/// Questions start EASY, then progress to MEDIUM and HARD based on performance.
class GameController {
  List<Question> _questions = [];
  int _currentIndex = 0;
  int _sessionScore = 0;
  int _sessionCorrect = 0;
  int _sessionWrong = 0;

  // Adaptive difficulty pools
  List<Question> _easyPool = [];
  List<Question> _mediumPool = [];
  List<Question> _hardPool = [];
  
  // Adaptive difficulty state
  int _currentDifficulty = 1; // 1=easy, 2=medium, 3=hard
  int _consecutiveCorrect = 0;
  int _consecutiveWrong = 0;

  // Getters
  Question? get currentQuestion => 
      _currentIndex < _questions.length ? _questions[_currentIndex] : null;
  
  int get currentIndex => _currentIndex;
  int get totalQuestions => _questions.length;
  int get sessionScore => _sessionScore;
  int get sessionCorrect => _sessionCorrect;
  int get sessionWrong => _sessionWrong;
  bool get isFinished => _currentIndex >= _questions.length;
  double get progress => _questions.isEmpty ? 0 : _currentIndex / _questions.length;
  int get currentDifficulty => _currentDifficulty;

  // User progress from storage
  UserProgress get userProgress => storageService.progress;
  int get currentElo => userProgress.elo;
  int get currentStreak => userProgress.currentStreak;
  int get bestStreak => userProgress.bestStreak;
  String get rankTitle => EloCalculator.getRankTitle(currentElo);

  /// Initialize storage
  Future<void> init() async {
    await storageService.init();
  }

  /// Load questions from assets/questions.json with adaptive difficulty.
  /// Session of 10 questions: starts EASY, adapts based on performance.
  Future<void> loadQuestions({int? maxQuestions, String? language, String? topic}) async {
    try {
      final jsonString = await rootBundle.loadString('assets/questions.json');
      final List<dynamic> jsonList = json.decode(jsonString);
      
      // Parse all questions with error handling
      List<Question> allQuestions = [];
      for (final jsonItem in jsonList) {
        try {
          allQuestions.add(Question.fromJson(jsonItem));
        } catch (e) {
          continue;
        }
      }
      
      // Filter by language
      if (language != null && language.isNotEmpty) {
        allQuestions = allQuestions.where((q) => q.language == language).toList();
      }
      
      // Filter by topic
      if (topic != null && topic.isNotEmpty) {
        allQuestions = allQuestions.where((q) => q.topic == topic).toList();
      }
      
      // Split into difficulty pools
      _easyPool = allQuestions.where((q) => q.difficulty == 1).toList()..shuffle();
      _mediumPool = allQuestions.where((q) => q.difficulty == 2).toList()..shuffle();
      _hardPool = allQuestions.where((q) => q.difficulty == 3).toList()..shuffle();
      
      debugPrint('🎯 Pools: easy=${_easyPool.length}, medium=${_mediumPool.length}, hard=${_hardPool.length}');
      
      // Build adaptive question list
      final totalCount = maxQuestions ?? 10;
      _questions = _buildAdaptiveQuestionList(totalCount);
      
      // Log the question order
      for (int i = 0; i < _questions.length; i++) {
        final q = _questions[i];
        final label = q.difficulty == 1 ? 'KOLAY' : q.difficulty == 2 ? 'ORTA' : 'ZOR';
        debugPrint('  Q${i+1}: $label (diff=${q.difficulty}) topic=${q.topic} lang=${q.language}');
      }
      
    } catch (e) {
      _questions = [];
    }
    
    _currentIndex = 0;
    _sessionScore = 0;
    _sessionCorrect = 0;
    _sessionWrong = 0;
    _currentDifficulty = 1; // Always start EASY
    _consecutiveCorrect = 0;
    _consecutiveWrong = 0;
  }

  /// Build initial question list with ELO-based difficulty distribution.
  /// Low ELO (Çaylak): 60% easy, 30% medium, 10% hard
  /// Mid ELO: 30% easy, 40% medium, 30% hard
  /// High ELO: 10% easy, 30% medium, 60% hard
  List<Question> _buildAdaptiveQuestionList(int count) {
    final rng = Random();
    final List<Question> result = [];
    final elo = storageService.progress.elo;
    
    // ELO-based difficulty ratios
    double easyRatio, hardRatio;
    if (elo < 1100) {
      // Çaylak: mostly easy
      easyRatio = 0.6; hardRatio = 0.1;
    } else if (elo < 1300) {
      // Acemi/Orta: balanced
      easyRatio = 0.3; hardRatio = 0.3;
    } else if (elo < 1500) {
      // İleri: harder
      easyRatio = 0.2; hardRatio = 0.5;
    } else {
      // Usta/Efsane: mostly hard
      easyRatio = 0.1; hardRatio = 0.6;
    }
    
    final easyCount = (count * easyRatio).ceil().clamp(1, _easyPool.length);
    final hardCount = (count * hardRatio).round().clamp(0, _hardPool.length);
    final mediumCount = (count - easyCount - hardCount).clamp(0, _mediumPool.length);
    
    // Pick from each pool
    final easyPick = _pickRandom(_easyPool, easyCount, rng);
    final mediumPick = _pickRandom(_mediumPool, mediumCount, rng);
    final hardPick = _pickRandom(_hardPool, hardCount, rng);
    
    // Order: easy first, then medium, then hard (progressive)
    result.addAll(easyPick);
    result.addAll(mediumPick);
    result.addAll(hardPick);
    
    // If not enough questions, fill from any pool
    if (result.length < count) {
      final remaining = [..._easyPool, ..._mediumPool, ..._hardPool]
        ..removeWhere((q) => result.any((r) => r.id == q.id));
      remaining.shuffle(rng);
      result.addAll(remaining.take(count - result.length));
    }
    
    return result.take(count).toList();
  }

  /// Pick n random questions from a pool
  List<Question> _pickRandom(List<Question> pool, int n, Random rng) {
    if (pool.isEmpty || n <= 0) return [];
    final shuffled = List<Question>.from(pool)..shuffle(rng);
    return shuffled.take(n).toList();
  }

  /// Adapt difficulty based on current performance.
  /// Called after each answer to potentially swap upcoming questions.
  void _adaptDifficulty(bool isCorrect) {
    if (isCorrect) {
      _consecutiveCorrect++;
      _consecutiveWrong = 0;
      
      // 2 consecutive correct → increase difficulty
      if (_consecutiveCorrect >= 2 && _currentDifficulty < 3) {
        _currentDifficulty++;
        _consecutiveCorrect = 0;
        _swapUpcomingQuestions();
      }
    } else {
      _consecutiveWrong++;
      _consecutiveCorrect = 0;
      
      // 2 consecutive wrong → decrease difficulty
      if (_consecutiveWrong >= 2 && _currentDifficulty > 1) {
        _currentDifficulty--;
        _consecutiveWrong = 0;
        _swapUpcomingQuestions();
      }
    }
  }

  /// Swap remaining upcoming questions to match current difficulty level.
  void _swapUpcomingQuestions() {
    final nextIdx = _currentIndex + 1;
    if (nextIdx >= _questions.length) return;
    
    // Get the pool for current difficulty
    List<Question> targetPool;
    switch (_currentDifficulty) {
      case 1: targetPool = _easyPool; break;
      case 3: targetPool = _hardPool; break;
      default: targetPool = _mediumPool; break;
    }
    
    // Get IDs of questions already used in this session
    final usedIds = _questions.take(nextIdx).map((q) => q.id).toSet();
    
    // Get available questions from target pool
    final available = targetPool.where((q) => !usedIds.contains(q.id)).toList()..shuffle();
    
    if (available.isEmpty) return;
    
    // Replace upcoming questions with ones matching current difficulty
    int availIdx = 0;
    for (int i = nextIdx; i < _questions.length && availIdx < available.length; i++) {
      if (_questions[i].difficulty != _currentDifficulty) {
        _questions[i] = available[availIdx++];
      }
    }
  }

  /// Check if the selected answer is correct and update ELO
  Future<bool> checkAnswer(String selectedAnswer) async {
    if (currentQuestion == null) return false;
    
    final isCorrect = selectedAnswer == currentQuestion!.correctAnswer;
    final difficulty = currentQuestion!.difficulty;
    
    // Calculate new ELO
    final newElo = EloCalculator.calculateNewElo(
      currentElo: currentElo,
      questionDifficulty: difficulty,
      isCorrect: isCorrect,
    );
    
    // Update score
    if (isCorrect) {
      _sessionScore += 10 * difficulty;
      _sessionCorrect++;
    } else {
      _sessionWrong++;
    }
    
    // Save to storage
    await storageService.recordAnswer(
      isCorrect: isCorrect,
      newElo: newElo,
    );
    
    // Adapt difficulty for next question
    _adaptDifficulty(isCorrect);
    
    return isCorrect;
  }

  /// Record timeout as wrong answer (for Time Attack mode)
  Future<void> recordTimeOut() async {
    if (currentQuestion == null) return;
    
    final difficulty = currentQuestion!.difficulty;
    final newElo = EloCalculator.calculateNewElo(
      currentElo: currentElo,
      questionDifficulty: difficulty,
      isCorrect: false,
    );
    
    _sessionWrong++;
    
    await storageService.recordAnswer(
      isCorrect: false,
      newElo: newElo,
    );
    
    // Timeout counts as wrong for adaptation
    _adaptDifficulty(false);
  }

  /// Move to next question
  void nextQuestion() {
    if (_currentIndex < _questions.length) {
      _currentIndex++;
    }
  }

  /// Add a single AI-generated question to the queue
  void addAIQuestion(Question question) {
    _questions.add(question);
    _currentIndex = _questions.length - 1;
  }

  /// Reset the game for a new session
  void reset() {
    _currentIndex = 0;
    _sessionScore = 0;
    _sessionCorrect = 0;
    _sessionWrong = 0;
    _currentDifficulty = 1;
    _consecutiveCorrect = 0;
    _consecutiveWrong = 0;
    _questions = _buildAdaptiveQuestionList(_questions.length > 0 ? _questions.length : 10);
  }

  /// Get session summary
  Map<String, dynamic> getSessionSummary() {
    return {
      'score': _sessionScore,
      'correct': _sessionCorrect,
      'wrong': _sessionWrong,
      'accuracy': _sessionCorrect + _sessionWrong > 0
          ? (_sessionCorrect / (_sessionCorrect + _sessionWrong) * 100).round()
          : 0,
      'elo': currentElo,
      'rank': rankTitle,
      'streak': currentStreak,
      'bestStreak': bestStreak,
    };
  }
}
