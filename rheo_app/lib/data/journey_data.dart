/// Learning Journey data models
/// Duolingo-style path map with chapters, lesson nodes, and progression
/// v2 — 10 chapters, ~42 nodes per language, matching React curriculum

/// Type of node on the journey path
enum NodeType {
  lesson,   // Regular lesson (quiz questions on a specific topic)
  review,   // Review node (mix of previous topics)
  chest,    // Treasure chest reward
  boss,     // Boss challenge (harder questions)
}

/// Visual status of a node
enum NodeStatus {
  locked,     // Cannot be accessed yet (grey)
  available,  // Can be tapped (bright, pulsing)
  completed,  // Already done (green with stars)
}

/// A single node on the journey path
class LessonNode {
  final String id;
  final String titleTr;
  final String titleEn;
  final String icon;           // Emoji or icon identifier
  final NodeType type;
  final String topic;          // Maps to question bank topic (variable, loop, etc.)
  final int requiredCorrect;   // Correct answers needed to pass (e.g. 4 out of 5)
  int stars;                   // 0-3 based on performance
  NodeStatus status;

  LessonNode({
    required this.id,
    required this.titleTr,
    required this.titleEn,
    required this.icon,
    this.type = NodeType.lesson,
    required this.topic,
    this.requiredCorrect = 4,
    this.stars = 0,
    this.status = NodeStatus.locked,
  });

  String get title => icon; // Icon is used as visual, title shown in dialog

  bool get isPlayable => status == NodeStatus.available || status == NodeStatus.completed;
  bool get isCompleted => status == NodeStatus.completed;
  bool get isLocked => status == NodeStatus.locked;
}

/// A chapter (section) containing multiple nodes
class JourneyChapter {
  final String id;
  final String titleTr;
  final String titleEn;
  final String subtitleTr;
  final String subtitleEn;
  final List<LessonNode> nodes;
  final int colorValue;  // Accent color for the chapter

  JourneyChapter({
    required this.id,
    required this.titleTr,
    required this.titleEn,
    required this.subtitleTr,
    required this.subtitleEn,
    required this.nodes,
    this.colorValue = 0xFF58CC02,  // Duolingo green by default
  });
}

/// Complete journey for a programming language
class JourneyMap {
  final String languageId;  // python, java, javascript
  final List<JourneyChapter> chapters;

  JourneyMap({
    required this.languageId,
    required this.chapters,
  });

  /// Get all nodes as a flat list
  List<LessonNode> get allNodes => 
      chapters.expand((c) => c.nodes).toList();

  /// Count total stars earned
  int get totalStars => allNodes.fold(0, (sum, n) => sum + n.stars);

  /// Count total possible stars (only lessons and reviews, 3 each)
  int get maxStars => allNodes
      .where((n) => n.type == NodeType.lesson || n.type == NodeType.review || n.type == NodeType.boss)
      .length * 3;

  /// Get current progress percentage
  double get progressPercent {
    final total = allNodes.where((n) => n.type != NodeType.chest).length;
    final done = allNodes.where((n) => n.isCompleted).length;
    return total > 0 ? done / total : 0;
  }
}

// ─────────────────────────────────────────────
// Journey Content Definitions — 10 Chapters
// ─────────────────────────────────────────────

/// Python Journey — 10 chapters, 42 nodes
JourneyMap buildPythonJourney() {
  return JourneyMap(
    languageId: 'python',
    chapters: [
      // ═══ CH1: BASICS ═══
      JourneyChapter(
        id: 'py_ch1',
        titleTr: 'Python Temelleri',
        titleEn: 'Python Basics',
        subtitleTr: '1. Kısım • Değişkenler & Tipler',
        subtitleEn: 'Section 1 • Variables & Types',
        colorValue: 0xFF58CC02,
        nodes: [
          LessonNode(id: 'py_1_1', titleTr: 'Oku & Takip Et', titleEn: 'Read & Trace', icon: '⭐', topic: 'variable', status: NodeStatus.available),
          LessonNode(id: 'py_1_2', titleTr: 'Veri Tipleri', titleEn: 'Data Types', icon: '📖', topic: 'variable'),
          LessonNode(id: 'py_1_3', titleTr: 'Çıktı Tahmini', titleEn: 'Output Predict', icon: '⭐', topic: 'variable'),
          LessonNode(id: 'py_1_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'variable', type: NodeType.review),
          LessonNode(id: 'py_1_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH2: FLOW CONTROL ═══
      JourneyChapter(
        id: 'py_ch2',
        titleTr: 'Akış Kontrolü',
        titleEn: 'Flow Control',
        subtitleTr: '2. Kısım • Koşullar & Mantık',
        subtitleEn: 'Section 2 • Conditionals & Logic',
        colorValue: 0xFFCE82FF,
        nodes: [
          LessonNode(id: 'py_2_1', titleTr: 'Koşullu Mantık', titleEn: 'Conditional Logic', icon: '⭐', topic: 'if_else'),
          LessonNode(id: 'py_2_2', titleTr: 'Boolean Ustalığı', titleEn: 'Boolean Mastery', icon: '📖', topic: 'if_else'),
          LessonNode(id: 'py_2_3', titleTr: 'İç İçe Dallanma', titleEn: 'Nested Branching', icon: '⭐', topic: 'if_else'),
          LessonNode(id: 'py_2_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'if_else', type: NodeType.review),
          LessonNode(id: 'py_2_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH3: LOOPS ═══
      JourneyChapter(
        id: 'py_ch3',
        titleTr: 'Döngüler',
        titleEn: 'Loops',
        subtitleTr: '3. Kısım • For, While & İterasyon',
        subtitleEn: 'Section 3 • For, While & Iteration',
        colorValue: 0xFF1CB0F6,
        nodes: [
          LessonNode(id: 'py_3_1', titleTr: 'For Döngüsü', titleEn: 'For Loop', icon: '⭐', topic: 'loop'),
          LessonNode(id: 'py_3_2', titleTr: 'While Döngüsü', titleEn: 'While Loop', icon: '📖', topic: 'loop'),
          LessonNode(id: 'py_3_3', titleTr: 'İç İçe Döngü', titleEn: 'Nested Loop', icon: '🎧', topic: 'loop'),
          LessonNode(id: 'py_3_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'loop', type: NodeType.review),
          LessonNode(id: 'py_3_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH4: FUNCTIONS ═══
      JourneyChapter(
        id: 'py_ch4',
        titleTr: 'Fonksiyonlar',
        titleEn: 'Functions',
        subtitleTr: '4. Kısım • Tanım, Parametre & Return',
        subtitleEn: 'Section 4 • Definition, Params & Return',
        colorValue: 0xFFFF9600,
        nodes: [
          LessonNode(id: 'py_4_1', titleTr: 'Fonksiyon Tanım', titleEn: 'Function Def', icon: '⭐', topic: 'function'),
          LessonNode(id: 'py_4_2', titleTr: 'Parametreler', titleEn: 'Parameters', icon: '📖', topic: 'function'),
          LessonNode(id: 'py_4_3', titleTr: 'Scope & Return', titleEn: 'Scope & Return', icon: '⭐', topic: 'function'),
          LessonNode(id: 'py_4_4', titleTr: 'Lambda & Map', titleEn: 'Lambda & Map', icon: '🎧', topic: 'function'),
          LessonNode(id: 'py_4_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH5: DATA STRUCTURES I ═══
      JourneyChapter(
        id: 'py_ch5',
        titleTr: 'Veri Yapıları I',
        titleEn: 'Data Structures I',
        subtitleTr: '5. Kısım • Liste, Sözlük, Tuple, Set',
        subtitleEn: 'Section 5 • List, Dict, Tuple, Set',
        colorValue: 0xFFFF4B4B,
        nodes: [
          LessonNode(id: 'py_5_1', titleTr: 'Liste Temelleri', titleEn: 'List Basics', icon: '⭐', topic: 'list'),
          LessonNode(id: 'py_5_2', titleTr: 'Sözlük & Set', titleEn: 'Dict & Set', icon: '📖', topic: 'list'),
          LessonNode(id: 'py_5_3', titleTr: 'Tuple & Comprehension', titleEn: 'Tuple & Comprehension', icon: '⭐', topic: 'list'),
          LessonNode(id: 'py_5_4', titleTr: 'Boss Savaşı', titleEn: 'Boss Battle', icon: '👑', topic: 'list', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'py_5_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH6: ALGORITHMS I ═══
      JourneyChapter(
        id: 'py_ch6',
        titleTr: 'Algoritmalar I',
        titleEn: 'Algorithms I',
        subtitleTr: '6. Kısım • Sıralama & Arama',
        subtitleEn: 'Section 6 • Sorting & Search',
        colorValue: 0xFF2DD4BF,
        nodes: [
          LessonNode(id: 'py_6_1', titleTr: 'Sıralama Temelleri', titleEn: 'Sorting Basics', icon: '⭐', topic: 'sorting'),
          LessonNode(id: 'py_6_2', titleTr: 'Binary Search', titleEn: 'Binary Search', icon: '📖', topic: 'sorting'),
          LessonNode(id: 'py_6_3', titleTr: 'Zaman Karmaşıklığı', titleEn: 'Time Complexity', icon: '⭐', topic: 'sorting'),
          LessonNode(id: 'py_6_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'sorting', type: NodeType.review),
          LessonNode(id: 'py_6_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH7: DATA STRUCTURES II ═══
      JourneyChapter(
        id: 'py_ch7',
        titleTr: 'Veri Yapıları II',
        titleEn: 'Data Structures II',
        subtitleTr: '7. Kısım • Stack, Queue & Linked List',
        subtitleEn: 'Section 7 • Stack, Queue & Linked List',
        colorValue: 0xFFF472B6,
        nodes: [
          LessonNode(id: 'py_7_1', titleTr: 'Stack', titleEn: 'Stack', icon: '⭐', topic: 'stack_queue'),
          LessonNode(id: 'py_7_2', titleTr: 'Queue', titleEn: 'Queue', icon: '📖', topic: 'stack_queue'),
          LessonNode(id: 'py_7_3', titleTr: 'Linked List', titleEn: 'Linked List', icon: '⭐', topic: 'stack_queue'),
          LessonNode(id: 'py_7_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH8: ALGORITHMS II ═══
      JourneyChapter(
        id: 'py_ch8',
        titleTr: 'Algoritmalar II',
        titleEn: 'Algorithms II',
        subtitleTr: '8. Kısım • Recursion & Trees',
        subtitleEn: 'Section 8 • Recursion & Trees',
        colorValue: 0xFF818CF8,
        nodes: [
          LessonNode(id: 'py_8_1', titleTr: 'Özyineleme', titleEn: 'Recursion', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'py_8_2', titleTr: 'Ağaç Yapısı', titleEn: 'Tree Structure', icon: '📖', topic: 'recursion'),
          LessonNode(id: 'py_8_3', titleTr: 'DFS & BFS', titleEn: 'DFS & BFS', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'py_8_4', titleTr: 'Boss Savaşı', titleEn: 'Boss Battle', icon: '👑', topic: 'recursion', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'py_8_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH9: ADVANCED ═══
      JourneyChapter(
        id: 'py_ch9',
        titleTr: 'İleri Seviye',
        titleEn: 'Advanced',
        subtitleTr: '9. Kısım • DP, Graph & Optimizasyon',
        subtitleEn: 'Section 9 • DP, Graph & Optimization',
        colorValue: 0xFFFB923C,
        nodes: [
          LessonNode(id: 'py_9_1', titleTr: 'Dinamik Prog.', titleEn: 'Dynamic Prog.', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'py_9_2', titleTr: 'Graf Temelleri', titleEn: 'Graph Basics', icon: '📖', topic: 'recursion'),
          LessonNode(id: 'py_9_3', titleTr: 'Sliding Window', titleEn: 'Sliding Window', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'py_9_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'recursion', type: NodeType.review),
          LessonNode(id: 'py_9_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      // ═══ CH10: MASTERY ═══
      JourneyChapter(
        id: 'py_ch10',
        titleTr: 'Ustalık',
        titleEn: 'Mastery',
        subtitleTr: '10. Kısım • Final Meydan Okuması',
        subtitleEn: 'Section 10 • Final Challenge',
        colorValue: 0xFFFCD34D,
        nodes: [
          LessonNode(id: 'py_10_1', titleTr: 'Final Tekrar', titleEn: 'Final Review', icon: '🎯', topic: 'function', type: NodeType.review),
          LessonNode(id: 'py_10_boss', titleTr: 'Final Boss', titleEn: 'Final Boss', icon: '🏆', topic: 'function', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'py_10_chest', titleTr: 'Mezuniyet', titleEn: 'Graduation', icon: '🎓', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
    ],
  );
}

/// Java Journey — 10 chapters, 42 nodes
JourneyMap buildJavaJourney() {
  return JourneyMap(
    languageId: 'java',
    chapters: [
      JourneyChapter(
        id: 'java_ch1',
        titleTr: 'Java Temelleri',
        titleEn: 'Java Basics',
        subtitleTr: '1. Kısım • Değişkenler & Tipler',
        subtitleEn: 'Section 1 • Variables & Types',
        colorValue: 0xFFA85502,
        nodes: [
          LessonNode(id: 'java_1_1', titleTr: 'Değişkenler', titleEn: 'Variables', icon: '⭐', topic: 'variable', status: NodeStatus.available),
          LessonNode(id: 'java_1_2', titleTr: 'Veri Tipleri', titleEn: 'Data Types', icon: '📖', topic: 'variable'),
          LessonNode(id: 'java_1_3', titleTr: 'Operatörler', titleEn: 'Operators', icon: '⭐', topic: 'variable'),
          LessonNode(id: 'java_1_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'variable', type: NodeType.review),
          LessonNode(id: 'java_1_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch2',
        titleTr: 'Koşullar',
        titleEn: 'Conditionals',
        subtitleTr: '2. Kısım • If/Else & Switch',
        subtitleEn: 'Section 2 • If/Else & Switch',
        colorValue: 0xFFCE82FF,
        nodes: [
          LessonNode(id: 'java_2_1', titleTr: 'If/Else', titleEn: 'If/Else', icon: '⭐', topic: 'if_else'),
          LessonNode(id: 'java_2_2', titleTr: 'Switch', titleEn: 'Switch', icon: '📖', topic: 'if_else'),
          LessonNode(id: 'java_2_3', titleTr: 'Ternary', titleEn: 'Ternary', icon: '⭐', topic: 'if_else'),
          LessonNode(id: 'java_2_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'if_else', type: NodeType.review),
          LessonNode(id: 'java_2_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch3',
        titleTr: 'Döngüler',
        titleEn: 'Loops',
        subtitleTr: '3. Kısım • For, While & Iteration',
        subtitleEn: 'Section 3 • For, While & Iteration',
        colorValue: 0xFF1CB0F6,
        nodes: [
          LessonNode(id: 'java_3_1', titleTr: 'For Döngüsü', titleEn: 'For Loop', icon: '⭐', topic: 'loop'),
          LessonNode(id: 'java_3_2', titleTr: 'While', titleEn: 'While', icon: '📖', topic: 'loop'),
          LessonNode(id: 'java_3_3', titleTr: 'Do-While', titleEn: 'Do-While', icon: '🎧', topic: 'loop'),
          LessonNode(id: 'java_3_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'loop', type: NodeType.review),
          LessonNode(id: 'java_3_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch4',
        titleTr: 'Fonksiyonlar',
        titleEn: 'Functions',
        subtitleTr: '4. Kısım • Method, Parametre & Return',
        subtitleEn: 'Section 4 • Method, Params & Return',
        colorValue: 0xFFFF9600,
        nodes: [
          LessonNode(id: 'java_4_1', titleTr: 'Method Tanım', titleEn: 'Method Def', icon: '⭐', topic: 'function'),
          LessonNode(id: 'java_4_2', titleTr: 'Parametreler', titleEn: 'Parameters', icon: '📖', topic: 'function'),
          LessonNode(id: 'java_4_3', titleTr: 'Overloading', titleEn: 'Overloading', icon: '⭐', topic: 'function'),
          LessonNode(id: 'java_4_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch5',
        titleTr: 'Veri Yapıları I',
        titleEn: 'Data Structures I',
        subtitleTr: '5. Kısım • Array, ArrayList & HashMap',
        subtitleEn: 'Section 5 • Array, ArrayList & HashMap',
        colorValue: 0xFFFF4B4B,
        nodes: [
          LessonNode(id: 'java_5_1', titleTr: 'Array', titleEn: 'Array', icon: '⭐', topic: 'list'),
          LessonNode(id: 'java_5_2', titleTr: 'ArrayList', titleEn: 'ArrayList', icon: '📖', topic: 'list'),
          LessonNode(id: 'java_5_3', titleTr: 'HashMap', titleEn: 'HashMap', icon: '⭐', topic: 'list'),
          LessonNode(id: 'java_5_boss', titleTr: 'Boss Savaşı', titleEn: 'Boss Battle', icon: '👑', topic: 'list', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'java_5_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch6',
        titleTr: 'Algoritmalar I',
        titleEn: 'Algorithms I',
        subtitleTr: '6. Kısım • Sıralama & Arama',
        subtitleEn: 'Section 6 • Sorting & Search',
        colorValue: 0xFF2DD4BF,
        nodes: [
          LessonNode(id: 'java_6_1', titleTr: 'Sıralama', titleEn: 'Sorting', icon: '⭐', topic: 'sorting'),
          LessonNode(id: 'java_6_2', titleTr: 'Binary Search', titleEn: 'Binary Search', icon: '📖', topic: 'sorting'),
          LessonNode(id: 'java_6_3', titleTr: 'Karmaşıklık', titleEn: 'Complexity', icon: '⭐', topic: 'sorting'),
          LessonNode(id: 'java_6_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch7',
        titleTr: 'OOP',
        titleEn: 'OOP',
        subtitleTr: '7. Kısım • Class, Inheritance & Polymorphism',
        subtitleEn: 'Section 7 • Class, Inheritance & Polymorphism',
        colorValue: 0xFFF472B6,
        nodes: [
          LessonNode(id: 'java_7_1', titleTr: 'Class & Object', titleEn: 'Class & Object', icon: '⭐', topic: 'oop'),
          LessonNode(id: 'java_7_2', titleTr: 'Kalıtım', titleEn: 'Inheritance', icon: '📖', topic: 'oop'),
          LessonNode(id: 'java_7_3', titleTr: 'Polimorfizm', titleEn: 'Polymorphism', icon: '⭐', topic: 'oop'),
          LessonNode(id: 'java_7_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch8',
        titleTr: 'Algoritmalar II',
        titleEn: 'Algorithms II',
        subtitleTr: '8. Kısım • Recursion & Trees',
        subtitleEn: 'Section 8 • Recursion & Trees',
        colorValue: 0xFF818CF8,
        nodes: [
          LessonNode(id: 'java_8_1', titleTr: 'Özyineleme', titleEn: 'Recursion', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'java_8_2', titleTr: 'Ağaçlar', titleEn: 'Trees', icon: '📖', topic: 'recursion'),
          LessonNode(id: 'java_8_3', titleTr: 'DFS & BFS', titleEn: 'DFS & BFS', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'java_8_boss', titleTr: 'Boss Savaşı', titleEn: 'Boss Battle', icon: '👑', topic: 'recursion', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'java_8_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch9',
        titleTr: 'İleri Seviye',
        titleEn: 'Advanced',
        subtitleTr: '9. Kısım • DP & Graflar',
        subtitleEn: 'Section 9 • DP & Graphs',
        colorValue: 0xFFFB923C,
        nodes: [
          LessonNode(id: 'java_9_1', titleTr: 'Dinamik Prog.', titleEn: 'Dynamic Prog.', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'java_9_2', titleTr: 'Graf Temelleri', titleEn: 'Graph Basics', icon: '📖', topic: 'recursion'),
          LessonNode(id: 'java_9_3', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'recursion', type: NodeType.review),
          LessonNode(id: 'java_9_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'java_ch10',
        titleTr: 'Ustalık',
        titleEn: 'Mastery',
        subtitleTr: '10. Kısım • Final Meydan Okuması',
        subtitleEn: 'Section 10 • Final Challenge',
        colorValue: 0xFFFCD34D,
        nodes: [
          LessonNode(id: 'java_10_1', titleTr: 'Final Tekrar', titleEn: 'Final Review', icon: '🎯', topic: 'function', type: NodeType.review),
          LessonNode(id: 'java_10_boss', titleTr: 'Final Boss', titleEn: 'Final Boss', icon: '🏆', topic: 'function', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'java_10_chest', titleTr: 'Mezuniyet', titleEn: 'Graduation', icon: '🎓', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
    ],
  );
}

/// JavaScript Journey — 10 chapters, 42 nodes
JourneyMap buildJavaScriptJourney() {
  return JourneyMap(
    languageId: 'javascript',
    chapters: [
      JourneyChapter(
        id: 'js_ch1',
        titleTr: 'JS Temelleri',
        titleEn: 'JS Basics',
        subtitleTr: '1. Kısım • let/const & Tipler',
        subtitleEn: 'Section 1 • let/const & Types',
        colorValue: 0xFF029C25,
        nodes: [
          LessonNode(id: 'js_1_1', titleTr: 'let & const', titleEn: 'let & const', icon: '⭐', topic: 'variable', status: NodeStatus.available),
          LessonNode(id: 'js_1_2', titleTr: 'Veri Tipleri', titleEn: 'Data Types', icon: '📖', topic: 'variable'),
          LessonNode(id: 'js_1_3', titleTr: 'Template Literal', titleEn: 'Template Literal', icon: '⭐', topic: 'variable'),
          LessonNode(id: 'js_1_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'variable', type: NodeType.review),
          LessonNode(id: 'js_1_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch2',
        titleTr: 'Koşullar & Döngüler',
        titleEn: 'Conditionals & Loops',
        subtitleTr: '2. Kısım • If/Else, For & While',
        subtitleEn: 'Section 2 • If/Else, For & While',
        colorValue: 0xFFCE82FF,
        nodes: [
          LessonNode(id: 'js_2_1', titleTr: 'If/Else', titleEn: 'If/Else', icon: '⭐', topic: 'if_else'),
          LessonNode(id: 'js_2_2', titleTr: 'For Loop', titleEn: 'For Loop', icon: '📖', topic: 'loop'),
          LessonNode(id: 'js_2_3', titleTr: 'While & Switch', titleEn: 'While & Switch', icon: '⭐', topic: 'loop'),
          LessonNode(id: 'js_2_4', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'if_else', type: NodeType.review),
          LessonNode(id: 'js_2_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch3',
        titleTr: 'Fonksiyonlar',
        titleEn: 'Functions',
        subtitleTr: '3. Kısım • Arrow, Callback & Closure',
        subtitleEn: 'Section 3 • Arrow, Callback & Closure',
        colorValue: 0xFF1CB0F6,
        nodes: [
          LessonNode(id: 'js_3_1', titleTr: 'Arrow Fonksiyon', titleEn: 'Arrow Function', icon: '⭐', topic: 'function'),
          LessonNode(id: 'js_3_2', titleTr: 'Callback', titleEn: 'Callback', icon: '📖', topic: 'function'),
          LessonNode(id: 'js_3_3', titleTr: 'Closure', titleEn: 'Closure', icon: '⭐', topic: 'function'),
          LessonNode(id: 'js_3_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch4',
        titleTr: 'Array & Object',
        titleEn: 'Arrays & Objects',
        subtitleTr: '4. Kısım • map, filter, reduce & Object',
        subtitleEn: 'Section 4 • map, filter, reduce & Object',
        colorValue: 0xFFFF9600,
        nodes: [
          LessonNode(id: 'js_4_1', titleTr: 'Array Metodları', titleEn: 'Array Methods', icon: '⭐', topic: 'list'),
          LessonNode(id: 'js_4_2', titleTr: 'Object & JSON', titleEn: 'Object & JSON', icon: '📖', topic: 'list'),
          LessonNode(id: 'js_4_3', titleTr: 'Destructuring', titleEn: 'Destructuring', icon: '⭐', topic: 'list'),
          LessonNode(id: 'js_4_boss', titleTr: 'Boss Savaşı', titleEn: 'Boss Battle', icon: '👑', topic: 'list', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'js_4_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch5',
        titleTr: 'Async & Promise',
        titleEn: 'Async & Promise',
        subtitleTr: '5. Kısım • Promise, async/await',
        subtitleEn: 'Section 5 • Promise, async/await',
        colorValue: 0xFFFF4B4B,
        nodes: [
          LessonNode(id: 'js_5_1', titleTr: 'Promise', titleEn: 'Promise', icon: '⭐', topic: 'function'),
          LessonNode(id: 'js_5_2', titleTr: 'async/await', titleEn: 'async/await', icon: '📖', topic: 'function'),
          LessonNode(id: 'js_5_3', titleTr: 'Error Handling', titleEn: 'Error Handling', icon: '⭐', topic: 'function'),
          LessonNode(id: 'js_5_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch6',
        titleTr: 'Algoritmalar I',
        titleEn: 'Algorithms I',
        subtitleTr: '6. Kısım • Sıralama & Arama',
        subtitleEn: 'Section 6 • Sorting & Search',
        colorValue: 0xFF2DD4BF,
        nodes: [
          LessonNode(id: 'js_6_1', titleTr: 'Sıralama', titleEn: 'Sorting', icon: '⭐', topic: 'sorting'),
          LessonNode(id: 'js_6_2', titleTr: 'Binary Search', titleEn: 'Binary Search', icon: '📖', topic: 'sorting'),
          LessonNode(id: 'js_6_3', titleTr: 'Karmaşıklık', titleEn: 'Complexity', icon: '⭐', topic: 'sorting'),
          LessonNode(id: 'js_6_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch7',
        titleTr: 'DOM & OOP',
        titleEn: 'DOM & OOP',
        subtitleTr: '7. Kısım • DOM, Class & Prototype',
        subtitleEn: 'Section 7 • DOM, Class & Prototype',
        colorValue: 0xFFF472B6,
        nodes: [
          LessonNode(id: 'js_7_1', titleTr: 'Class', titleEn: 'Class', icon: '⭐', topic: 'oop'),
          LessonNode(id: 'js_7_2', titleTr: 'Prototype', titleEn: 'Prototype', icon: '📖', topic: 'oop'),
          LessonNode(id: 'js_7_3', titleTr: 'DOM', titleEn: 'DOM', icon: '⭐', topic: 'oop'),
          LessonNode(id: 'js_7_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch8',
        titleTr: 'Algoritmalar II',
        titleEn: 'Algorithms II',
        subtitleTr: '8. Kısım • Recursion & Trees',
        subtitleEn: 'Section 8 • Recursion & Trees',
        colorValue: 0xFF818CF8,
        nodes: [
          LessonNode(id: 'js_8_1', titleTr: 'Özyineleme', titleEn: 'Recursion', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'js_8_2', titleTr: 'Ağaçlar', titleEn: 'Trees', icon: '📖', topic: 'recursion'),
          LessonNode(id: 'js_8_3', titleTr: 'DFS & BFS', titleEn: 'DFS & BFS', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'js_8_boss', titleTr: 'Boss Savaşı', titleEn: 'Boss Battle', icon: '👑', topic: 'recursion', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'js_8_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch9',
        titleTr: 'İleri Seviye',
        titleEn: 'Advanced',
        subtitleTr: '9. Kısım • DP & Graflar',
        subtitleEn: 'Section 9 • DP & Graphs',
        colorValue: 0xFFFB923C,
        nodes: [
          LessonNode(id: 'js_9_1', titleTr: 'Dinamik Prog.', titleEn: 'Dynamic Prog.', icon: '⭐', topic: 'recursion'),
          LessonNode(id: 'js_9_2', titleTr: 'Graflar', titleEn: 'Graphs', icon: '📖', topic: 'recursion'),
          LessonNode(id: 'js_9_3', titleTr: 'Tekrar', titleEn: 'Review', icon: '🎯', topic: 'recursion', type: NodeType.review),
          LessonNode(id: 'js_9_chest', titleTr: 'Hazine', titleEn: 'Treasure', icon: '🎁', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
      JourneyChapter(
        id: 'js_ch10',
        titleTr: 'Ustalık',
        titleEn: 'Mastery',
        subtitleTr: '10. Kısım • Final Meydan Okuması',
        subtitleEn: 'Section 10 • Final Challenge',
        colorValue: 0xFFFCD34D,
        nodes: [
          LessonNode(id: 'js_10_1', titleTr: 'Final Tekrar', titleEn: 'Final Review', icon: '🎯', topic: 'function', type: NodeType.review),
          LessonNode(id: 'js_10_boss', titleTr: 'Final Boss', titleEn: 'Final Boss', icon: '🏆', topic: 'function', type: NodeType.boss, requiredCorrect: 5),
          LessonNode(id: 'js_10_chest', titleTr: 'Mezuniyet', titleEn: 'Graduation', icon: '🎓', topic: '', type: NodeType.chest, requiredCorrect: 0),
        ],
      ),
    ],
  );
}
