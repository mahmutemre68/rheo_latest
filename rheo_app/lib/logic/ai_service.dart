import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../data/question_model.dart';

/// AI Service - Google Gemini (Flash-Lite) ile dinamik soru üretimi
/// Caching + Fallback mekanizması ile güvenli çalışır


/// Global singleton instance
final aiService = AIService();

class AIService {
  static final AIService _instance = AIService._internal();
  factory AIService() => _instance;
  AIService._internal();

  String? _apiKey;
  Box? _cacheBox;
  bool _isInitialized = false;
  bool _isDemoMode = false;
  String? lastError;

  static const String _baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  static const String _model = 'gemini-2.5-flash';

  /// System prompt - Senior Software Engineer rolü
  static const String _systemPrompt = '''
You are a Senior Software Engineer creating coding quiz questions. Generate ONE unique Python question.

CRITICAL RULES FOR VARIETY:
- NEVER repeat the same code pattern. Each question MUST use DIFFERENT variables, functions, and logic.
- Use creative, descriptive variable names from real-world contexts (shopping_cart, student_scores, recipe_ingredients — NOT x, y, a, b).
- Mix different Python concepts: string methods, dictionary operations, set operations, tuple unpacking, enumerate, zip, map, filter, list comprehensions, generators, exception handling, class inheritance, magic methods, decorators, closures.
- Code snippets MUST be between 5-12 lines. Make them substantial enough to require careful reading.
- The 4 answer options MUST all be plausible — include common mistakes as wrong answers.

DIFFICULTY LEVELS (you MUST follow this strictly):
- Easy: single concept, straightforward logic, basic operations. A beginner solves in 10 seconds.
- Medium: 2-3 concepts combined, minor edge cases, requires tracing through code carefully.
- Hard: subtle traps (mutable defaults, scope issues, operator precedence, shallow copy, generator exhaustion, closure late binding). Even experienced developers should pause and think.

Question types (pick ONE randomly):
1. type: "output" — "What is the output of this code?" The code must have a non-obvious output that requires careful mental execution.
2. type: "missing_code" — Show code with one line replaced by "_____" and ask what should fill the blank to achieve the described goal.
3. type: "debug" — "Which line contains a bug?" Code with a subtle logical error.

Respond with ONLY valid JSON, no markdown, no extra text:
{"type": "output", "question_text": "...", "code_snippet": "...", "options": ["a","b","c","d"], "correct_index": 0, "explanation": "Step-by-step explanation of why the answer is correct"}
''';

  /// Initialize AI service
  Future<void> init() async {
    if (_isInitialized) return;

    try {
      _cacheBox = await Hive.openBox('ai_questions_cache');

      // 1. Önce dart-define'dan kontrol et (web build için en güvenilir)
      var apiKey = const String.fromEnvironment('GEMINI_API_KEY');
      if (apiKey.isNotEmpty) {
        debugPrint('🔑 Using dart-define API key (${apiKey.length} chars)');
      } else {
        // 2. dotenv'den kontrol et (mobil ve dev server için)
        apiKey = dotenv.env['GEMINI_API_KEY'] ?? '';
        if (apiKey.isNotEmpty && apiKey != 'your_gemini_api_key_here') {
          debugPrint('🔑 Using dotenv API key (${apiKey.length} chars)');
        } else {
          apiKey = '';
        }
      }
      
      if (apiKey.isEmpty) {
        debugPrint('⚠️ GEMINI_API_KEY not configured');
        _isDemoMode = true;
        debugPrint('✅ AIService started in DEMO MODE');
        _isInitialized = true;
        return;
      }

      _apiKey = apiKey;
      _isInitialized = true;
      debugPrint('✅ AIService initialized (Gemini Flash-Lite)');
    } catch (e) {
      debugPrint('❌ AIService init error: $e');
      _isDemoMode = true; // Fallback to Demo Mode on error
      _isInitialized = true;
    }
  }

  /// AI ile soru üret
  Future<Question?> generateQuestion({
    required String topic,
    int difficulty = 2,
  }) async {
    if (!_isInitialized) await init();

    // DEMO MODE CHECK
    if (_isDemoMode) {
      debugPrint('🤖 Generating DEMO question for $topic');
      return _generateDemoQuestion(topic);
    }

    final topicLabel = _getTopicLabel(topic);
    final difficultyLabel = _getDifficultyLabel(difficulty);

    // 1. Önce API'den dene
    if (_apiKey != null) {
      try {
        final question = await _generateFromAPI(topicLabel, difficultyLabel, topic);
        if (question != null) {
          await _cacheQuestion(topic, question);
          return question;
        }
      } catch (e) {
        debugPrint('⚠️ AI generation failed, trying cache: $e');
        lastError = e.toString();
      }
    }

    // 2. Cache'den dene (Fallback)
    final cachedQuestion = _getCachedQuestion(topic);
    if (cachedQuestion != null) {
      debugPrint('📦 Serving from cache');
      return cachedQuestion;
    }

    // 3. Hiçbiri yoksa null döner
    debugPrint('❌ No questions available (no API, no cache)');
    return null;
  }

  /// Demo Modu için statik sorular
  Question _generateDemoQuestion(String topic) {
    // Simulate network delay for realism
    // await Future.delayed(const Duration(milliseconds: 1500));
    
    final random = DateTime.now().millisecondsSinceEpoch;
    
    if (topic == 'ai_arrays') {
      return Question(
        id: 'demo_arrays_$random',
        type: 'output',
        difficulty: 2,
        topic: topic,
        codeSnippet: '''
nums = [2, 7, 11, 15]
target = 9
seen = {}

for i, num in enumerate(nums):
    diff = target - num
    if diff in seen:
        print([seen[diff], i])
        break
    seen[num] = i
''',
        questionText: "What is the output of this Two Sum implementation?",
        correctAnswer: "[0, 1]",
        wrongOptions: ["[1, 0]", "[2, 7]", "None"],
        explanation: "The code finds two numbers that add up to target (9). 2 (index 0) and 7 (index 1) match. It prints the indices [0, 1].",
        language: 'python',
      );
    } else if (topic == 'ai_linked_lists') {
      return Question(
        id: 'demo_linked_$random',
        type: 'missing_code',
        difficulty: 2,
        topic: topic,
        codeSnippet: '''
class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        _____
        prev = curr
        curr = next_temp
    return prev
''',
        questionText: "Fill in the blank to correctly reverse the linked list.",
        correctAnswer: "curr.next = prev",
        wrongOptions: ["curr.next = next_temp", "prev.next = curr", "curr = prev"],
        explanation: "To reverse the list, we need to point the current node's next pointer to the previous node: curr.next = prev.",
        language: 'python',
      );
    } else {
      // Trees or default
      return Question(
        id: 'demo_tree_$random',
        type: 'debug',
        difficulty: 2,
        topic: topic,
        codeSnippet: '''
def maxDepth(root):
    if not root:
        return 0
    
    left = maxDepth(root.left)
    right = maxDepth(root.right)
    
    return max(left, right)
''',
        questionText: "Which line contains a bug in this Maximum Depth of Binary Tree function?",
        correctAnswer: "return max(left, right)",
        wrongOptions: ["if not root:", "return 0", "left = maxDepth(root.left)"],
        explanation: "The correct height calculation should include the current node itself: return 1 + max(left, right).",
        language: 'python',
      );
    }
  }

  /// Çeşitlilik için rastgele odak noktası seç — geçmiş takibi ile
  static final _random = Random();
  final List<String> _recentFocusAreas = [];
  final List<String> _recentScenarios = [];
  
  static const List<String> _focusAreas = [
    'string manipulation and formatting',
    'dictionary operations and methods',
    'list slicing and negative indexing',
    'set operations (union, intersection, difference)',
    'tuple unpacking and immutability',
    'boolean logic and short-circuit evaluation',
    'integer division and modulo edge cases',
    'nested data structures',
    'exception handling (try/except/finally)',
    'class methods and inheritance',
    'lambda functions and higher-order functions',
    'generator expressions and yield',
    'file-like operations and context managers',
    'enumerate and zip patterns',
    'list comprehension with conditions',
    'mutable default arguments trap',
    'scope and closure behavior',
    'shallow vs deep copy',
    'chained comparisons',
    'walrus operator (:=)',
    'f-string formatting tricks',
    'unpacking operators (* and **)',
    'itertools patterns',
    'recursion with base cases',
    'decorator pattern',
  ];
  static const List<String> _scenarios = [
    'online shopping cart and discounts',
    'student exam grades and GPA calculator',
    'weather temperature data analysis',
    'social media follower counts',
    'recipe ingredient quantities',
    'video game score leaderboard',
    'library book catalog system',
    'fitness workout tracker',
    'music playlist manager',
    'restaurant menu ordering',
    'bank account transactions',
    'traffic light simulation',
    'movie rating database',
    'parking lot management',
    'pet adoption shelter records',
  ];

  String _getRandomFocus(String topicLabel) {
    // Pick a focus area NOT recently used
    String focus;
    final available = _focusAreas.where((f) => !_recentFocusAreas.contains(f)).toList();
    if (available.isEmpty) {
      _recentFocusAreas.clear();
      focus = _focusAreas[_random.nextInt(_focusAreas.length)];
    } else {
      focus = available[_random.nextInt(available.length)];
    }
    _recentFocusAreas.add(focus);
    if (_recentFocusAreas.length > 15) _recentFocusAreas.removeAt(0);

    // Pick a scenario NOT recently used
    String scenario;
    final availableScenarios = _scenarios.where((s) => !_recentScenarios.contains(s)).toList();
    if (availableScenarios.isEmpty) {
      _recentScenarios.clear();
      scenario = _scenarios[_random.nextInt(_scenarios.length)];
    } else {
      scenario = availableScenarios[_random.nextInt(availableScenarios.length)];
    }
    _recentScenarios.add(scenario);
    if (_recentScenarios.length > 10) _recentScenarios.removeAt(0);

    final seed = _random.nextInt(99999);
    
    // Build anti-repetition context
    String avoidNote = '';
    if (_recentFocusAreas.length > 1) {
      final recentList = _recentFocusAreas.take(5).join(', ');
      avoidNote = '\nDO NOT use these recent topics: $recentList. Be completely different!';
    }

    return 'Topic: $topicLabel.\n'
        'Focus on: $focus.\n'
        'Scenario: $scenario.\n'
        'Seed: $seed (make variables/logic unique).'
        '$avoidNote';
  }

  /// Gemini API'den soru üret
  Future<Question?> _generateFromAPI(
    String topicLabel,
    String difficultyLabel,
    String topicId,
  ) async {
    final userMessage = _getRandomFocus(topicLabel) + 
        '\nDifficulty: $difficultyLabel. '
        '${_getDifficultyInstruction(difficultyLabel)}';

    final url = '$_baseUrl/$_model:generateContent?key=$_apiKey';

    final body = json.encode({
      'system_instruction': {
        'parts': [{'text': _systemPrompt}]
      },
      'contents': [
        {
          'parts': [{'text': userMessage}]
        }
      ],
      'generationConfig': {
        'temperature': 1.0,
        'responseMimeType': 'application/json',
      },
    });

    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    );

    if (response.statusCode != 200) {
      throw Exception('Gemini API error ${response.statusCode}: ${response.body}');
    }

    final responseData = json.decode(response.body) as Map<String, dynamic>;
    final content = responseData['candidates']?[0]?['content']?['parts']?[0]?['text'] as String?;

    if (content == null || content.isEmpty) return null;

    // JSON parse - content içinden JSON'ı çıkar
    try {
      // Bazen model markdown ile sarabilir, temizle
      String cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.substring(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.substring(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.substring(0, cleanContent.length - 3);
      }
      cleanContent = cleanContent.trim();

      final jsonData = json.decode(cleanContent) as Map<String, dynamic>;
      return _parseAIResponse(jsonData, topicId);
    } catch (e) {
      debugPrint('❌ JSON parse error: $e\nResponse: $content');
      return null;
    }
  }

  /// AI yanıtını Question modeline dönüştür
  Question _parseAIResponse(Map<String, dynamic> json, String topicId) {
    final options = List<String>.from(json['options'] as List);
    final correctIndex = json['correct_index'] as int;
    final correctAnswer = options[correctIndex];
    final wrongOptions = List<String>.from(options)..removeAt(correctIndex);
    final questionType = (json['type'] as String?) ?? 'output';

    return Question(
      id: 'ai_${DateTime.now().millisecondsSinceEpoch}',
      type: questionType,
      difficulty: _currentDifficulty,
      topic: topicId,
      codeSnippet: json['code_snippet'] as String,
      questionText: json['question_text'] as String,
      correctAnswer: correctAnswer,
      wrongOptions: wrongOptions,
      explanation: json['explanation'] as String,
      language: 'python',
    );
  }

  /// Soruyu Hive cache'e kaydet
  Future<void> _cacheQuestion(String topic, Question question) async {
    if (_cacheBox == null) return;
    try {
      final cacheKey = 'cache_$topic';
      final existing = _cacheBox!.get(cacheKey, defaultValue: <dynamic>[]) as List;
      final questionJson = {
        'id': question.id,
        'type': question.type,
        'difficulty': question.difficulty,
        'topic': question.topic,
        'code_snippet': question.codeSnippet,
        'question_text': question.questionText,
        'correct_answer': question.correctAnswer,
        'wrong_options': question.wrongOptions,
        'explanation': question.explanation,
        'language': question.language,
      };
      existing.add(questionJson);
      if (existing.length > 20) existing.removeAt(0);
      await _cacheBox!.put(cacheKey, existing);
      debugPrint('💾 Cached question for $topic (${existing.length} total)');
    } catch (e) {
      debugPrint('❌ Cache write error: $e');
    }
  }

  /// Cache'den rastgele soru getir
  Question? _getCachedQuestion(String topic) {
    if (_cacheBox == null) return null;
    try {
      final cacheKey = 'cache_$topic';
      final cached = _cacheBox!.get(cacheKey, defaultValue: <dynamic>[]) as List;
      if (cached.isEmpty) return null;
      cached.shuffle();
      final json = Map<String, dynamic>.from(cached.first as Map);
      return Question.fromJson(json);
    } catch (e) {
      debugPrint('❌ Cache read error: $e');
      return null;
    }
  }

  String _getTopicLabel(String topicId) {
    switch (topicId) {
      // Standart kategoriler
      case 'variable':
        return 'Python variables, data types (int, float, str, bool), type casting, and basic syntax';
      case 'loop':
        return 'For loops, while loops, nested loops, break/continue statements, loop edge cases';
      case 'if_else':
        return 'If/elif/else conditions, boolean logic, ternary operators, truthy/falsy values';
      case 'function':
        return 'Lambda functions, recursion, variable scope, *args/**kwargs, default arguments, closures';
      case 'list':
        return 'Lists, list comprehensions, slicing, sorting, nested lists, list methods';
      case 'string':
        return 'String operations, slicing, methods (upper, lower, split, join, replace, find), string formatting, regex basics';
      case 'array':
        return 'Arrays/Lists, indexing, append/insert/remove, sorting, filtering, map/reduce, 2D arrays, array methods';
      case 'oop':
        return 'Object-Oriented Programming: classes, objects, constructors, inheritance, polymorphism, encapsulation, static methods';
      case 'recursion':
        return 'Recursive functions, base cases, factorial, fibonacci, recursive data structures, tree traversal, divide and conquer';
      case 'sorting':
        return 'Sorting algorithms concepts, built-in sort methods, custom comparators, key functions, stable sorting, reverse sorting';
      case 'stack_queue':
        return 'Stack (LIFO) operations push/pop/peek, Queue (FIFO) operations enqueue/dequeue, deque, parenthesis matching, BFS/DFS basics';
      // AI kategorileri
      case 'ai_arrays':
        return 'Arrays and Hashing (Two Sum, Contains Duplicate, Group Anagrams, Hash Maps)';
      case 'ai_linked_lists':
        return 'Linked Lists (Reverse, Merge, Detect Cycle, Floyd\'s Algorithm, Dummy Nodes)';
      case 'ai_trees':
        return 'Trees and Graphs (BFS, DFS, Binary Search Trees, Graph Traversal, Tree Recursion)';
      default:
        return topicId;
    }
  }

  int _currentDifficulty = 2;

  String _getDifficultyLabel(int difficulty) {
    _currentDifficulty = difficulty;
    switch (difficulty) {
      case 1: return 'Easy';
      case 3: return 'Hard';
      default: return 'Medium';
    }
  }

  String _getDifficultyInstruction(String level) {
    switch (level) {
      case 'Easy':
        return 'This MUST be EASY: simple variable assignment, basic print, single if/else, basic loop. A beginner should solve it in 10 seconds.';
      case 'Hard':
        return 'This MUST be HARD: use subtle traps like mutable defaults, scope issues, operator precedence, shallow copy gotchas, or tricky recursion. Even experienced devs should think twice.';
      default:
        return 'This should be MEDIUM difficulty: combine 2-3 concepts, include a minor edge case, require some thought but no deep tricks.';
    }
  }

  int getCachedCount(String topic) {
    if (_cacheBox == null) return 0;
    final cached = _cacheBox!.get('cache_$topic', defaultValue: <dynamic>[]) as List;
    return cached.length;
  }

  Future<void> clearCache() async {
    await _cacheBox?.clear();
    debugPrint('🗑️ AI cache cleared');
  }

  bool get isAvailable => _apiKey != null || _isDemoMode;
}
