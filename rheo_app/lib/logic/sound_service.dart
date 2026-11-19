import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:audioplayers/audioplayers.dart';

/// Service for managing sound effects
/// Uses audioplayers package which supports web (HTML5 Audio)
class SoundService {
  static const String _settingsBox = 'rheo_settings';
  static const String _soundEnabledKey = 'sound_enabled';
  
  Box? _box;
  bool _soundEnabled = true;
  bool _initialized = false;

  /// Initialize sound service
  Future<void> init() async {
    if (_initialized) return;
    
    try {
      _box = await Hive.openBox(_settingsBox);
      _soundEnabled = _box?.get(_soundEnabledKey, defaultValue: true) ?? true;
      _initialized = true;
    } catch (e) {
      debugPrint('SoundService init error: $e');
      _initialized = false;
    }
  }

  /// Check if sound is enabled
  bool get isSoundEnabled => _soundEnabled;

  /// Toggle sound on/off
  Future<void> toggleSound() async {
    _soundEnabled = !_soundEnabled;
    await _box?.put(_soundEnabledKey, _soundEnabled);
  }

  /// Set sound enabled state
  Future<void> setSoundEnabled(bool enabled) async {
    _soundEnabled = enabled;
    await _box?.put(_soundEnabledKey, _soundEnabled);
  }

  /// Play correct answer sound
  Future<void> playCorrect() async {
    if (!_soundEnabled) return;
    _playAsset('sounds/correct.wav', 0.5);
  }

  /// Play wrong answer sound
  Future<void> playWrong() async {
    if (!_soundEnabled) return;
    _playAsset('sounds/wrong.wav', 0.5);
  }

  /// Play level up sound
  Future<void> playLevelUp() async {
    if (!_soundEnabled) return;
    _playAsset('sounds/levelup.wav', 0.6);
  }

  /// Play tap/click sound
  Future<void> playTap() async {
    if (!_soundEnabled) return;
    _playAsset('sounds/correct.wav', 0.2);
  }

  /// Internal: play an asset sound
  void _playAsset(String path, double volume) {
    try {
      final player = AudioPlayer();
      player.setVolume(volume);
      player.play(AssetSource(path));
      // Auto-dispose after playing
      player.onPlayerComplete.listen((_) {
        player.dispose();
      });
    } catch (e) {
      debugPrint('Sound play error: $e');
    }
  }

  /// Dispose
  Future<void> dispose() async {}
}

/// Global instance
final soundService = SoundService();
