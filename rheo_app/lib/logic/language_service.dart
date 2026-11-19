import 'package:hive_flutter/hive_flutter.dart';

/// Supported programming languages
enum ProgrammingLanguage {
  python('Python', '🐍', 'python', 0xFF3572A5),
  java('Java', '☕', 'java', 0xFFB07219),
  javascript('JavaScript', '🟨', 'javascript', 0xFFF7DF1E);

  final String label;
  final String emoji;
  final String highlightLang;
  final int colorValue;

  const ProgrammingLanguage(this.label, this.emoji, this.highlightLang, this.colorValue);
}

/// Service for managing selected programming language
class LanguageService {
  static const String _boxName = 'rheo_settings';
  static const String _languageKey = 'selected_language';
  
  Box? _box;
  ProgrammingLanguage _selected = ProgrammingLanguage.python;
  
  /// Initialize the service
  Future<void> init() async {
    _box = await Hive.openBox(_boxName);
    final savedLang = _box?.get(_languageKey);
    if (savedLang != null) {
      _selected = ProgrammingLanguage.values.firstWhere(
        (lang) => lang.name == savedLang,
        orElse: () => ProgrammingLanguage.python,
      );
    }
  }
  
  /// Get currently selected language
  ProgrammingLanguage get selected => _selected;
  
  /// Set selected language
  Future<void> setLanguage(ProgrammingLanguage lang) async {
    _selected = lang;
    await _box?.put(_languageKey, lang.name);
  }
  
  /// Get all available languages
  List<ProgrammingLanguage> get availableLanguages => ProgrammingLanguage.values.toList();
}

/// Global instance
final languageService = LanguageService();
