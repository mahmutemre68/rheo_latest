import 'package:hive_flutter/hive_flutter.dart';
import 'journey_data.dart';

/// Persists Learning Journey progress in Hive
class JourneyProgressService {
  static final JourneyProgressService _instance = JourneyProgressService._();
  factory JourneyProgressService() => _instance;
  JourneyProgressService._();

  static const String _boxName = 'journey_progress';
  Box? _box;

  /// Initialize the service
  Future<void> init() async {
    _box = await Hive.openBox(_boxName);
  }

  /// Get stars for a specific node (0 if never completed)
  int getNodeStars(String nodeId) {
    return _box?.get('stars_$nodeId', defaultValue: 0) ?? 0;
  }

  /// Check if a node is completed
  bool isNodeCompleted(String nodeId) {
    return _box?.get('completed_$nodeId', defaultValue: false) ?? false;
  }

  /// Mark a node as completed with a star rating
  Future<void> completeNode(String nodeId, int stars) async {
    final currentStars = getNodeStars(nodeId);
    // Only update if new stars are higher (best score)
    if (stars > currentStars) {
      await _box?.put('stars_$nodeId', stars);
    }
    await _box?.put('completed_$nodeId', true);
  }

  /// Check if a chest has been collected
  bool isChestCollected(String chestId) {
    return _box?.get('chest_$chestId', defaultValue: false) ?? false;
  }

  /// Mark a chest as collected
  Future<void> collectChest(String chestId) async {
    await _box?.put('chest_$chestId', true);
  }

  /// Get total XP earned from journey
  int get totalJourneyXP {
    return _box?.get('journey_xp', defaultValue: 0) ?? 0;
  }

  /// Add XP from completing a lesson
  Future<void> addXP(int xp) async {
    final current = totalJourneyXP;
    await _box?.put('journey_xp', current + xp);
  }

  /// Apply saved progress to a JourneyMap
  void applyProgress(JourneyMap map) {
    final allNodes = map.allNodes;
    bool previousWasCompleted = true; // First node should be available

    for (int i = 0; i < allNodes.length; i++) {
      final node = allNodes[i];

      if (isNodeCompleted(node.id)) {
        node.status = NodeStatus.completed;
        node.stars = getNodeStars(node.id);
        previousWasCompleted = true;
      } else if (node.type == NodeType.chest) {
        // Chests are available if previous lesson is completed
        if (previousWasCompleted) {
          node.status = isChestCollected(node.id)
              ? NodeStatus.completed
              : NodeStatus.available;
        } else {
          node.status = NodeStatus.locked;
        }
        previousWasCompleted = node.status == NodeStatus.completed;
      } else if (previousWasCompleted) {
        node.status = NodeStatus.available;
        previousWasCompleted = false; // Only one available at a time after completed ones
      } else {
        node.status = NodeStatus.locked;
      }
    }
  }

  /// Reset all journey progress
  Future<void> resetProgress() async {
    await _box?.clear();
  }
}

/// Global singleton
final journeyProgress = JourneyProgressService();
