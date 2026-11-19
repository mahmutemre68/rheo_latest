/// Question model for parsing questions.json
import 'app_strings.dart';

class Question {
  final String id;
  final String type;
  final int difficulty;
  final String topic;
  final String codeSnippet;
  final String questionText;
  final String? questionTextEn;
  final String correctAnswer;
  final List<String> wrongOptions;
  final String explanation;
  final String? explanationEn;
  final String language;

  Question({
    required this.id,
    required this.type,
    required this.difficulty,
    required this.topic,
    required this.codeSnippet,
    required this.questionText,
    this.questionTextEn,
    required this.correctAnswer,
    required this.wrongOptions,
    required this.explanation,
    this.explanationEn,
    this.language = 'python',
  });

  /// Locale-aware question text
  String get localizedQuestionText {
    if (S.isEn && questionTextEn != null && questionTextEn!.isNotEmpty) {
      return questionTextEn!;
    }
    return questionText;
  }

  /// Locale-aware explanation
  String get localizedExplanation {
    if (S.isEn && explanationEn != null && explanationEn!.isNotEmpty) {
      return explanationEn!;
    }
    return explanation;
  }

  /// Factory constructor to parse JSON — error-safe
  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id']?.toString() ?? 'unknown',
      type: json['type']?.toString() ?? 'output',
      difficulty: (json['difficulty'] is int) ? json['difficulty'] : int.tryParse(json['difficulty']?.toString() ?? '1') ?? 1,
      topic: json['topic']?.toString() ?? '',
      codeSnippet: json['code_snippet']?.toString() ?? '',
      questionText: json['question_text']?.toString() ?? '',
      questionTextEn: json['question_text_en']?.toString(),
      correctAnswer: json['correct_answer']?.toString() ?? '',
      wrongOptions: (json['wrong_options'] as List?)?.map((e) => e.toString()).toList() ?? [],
      explanation: json['explanation']?.toString() ?? '',
      explanationEn: json['explanation_en']?.toString(),
      language: json['language']?.toString() ?? 'python',
    );
  }

  /// Get all options (shuffled: correct + wrong)
  List<String> getShuffledOptions() {
    final options = [correctAnswer, ...wrongOptions];
    options.shuffle();
    return options;
  }
}
