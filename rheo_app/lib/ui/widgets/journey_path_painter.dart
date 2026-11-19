import 'package:flutter/material.dart';
import '../../data/journey_data.dart';

/// Cosmic energy bridge path painter
/// Glowing, thick arcing paths with particle trail effect
class JourneyPathPainter extends CustomPainter {
  final List<Offset> nodePositions;
  final List<NodeStatus> nodeStatuses;
  final double animationValue;

  static const Color completedColor = Color(0xFF58CC02);
  static const Color completedGlow = Color(0xFF7FFF00);
  static const Color lockedColor = Color(0xFF2B2B2B);

  JourneyPathPainter({
    required this.nodePositions,
    required this.nodeStatuses,
    this.animationValue = 0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (nodePositions.length < 2) return;

    for (int i = 0; i < nodePositions.length - 1; i++) {
      final from = nodePositions[i];
      final to = nodePositions[i + 1];
      final isSegmentDone = nodeStatuses[i] == NodeStatus.completed;

      final path = _buildCurvePath(from, to);

      if (isSegmentDone) {
        // ── Glow layer (wide, soft) ──
        canvas.drawPath(path, Paint()
          ..color = completedGlow.withOpacity(0.15)
          ..strokeWidth = 20
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12));

        // ── Energy bridge outer ──
        canvas.drawPath(path, Paint()
          ..color = const Color(0xFF3D8C00)
          ..strokeWidth = 12
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round);

        // ── Energy bridge inner (bright) ──
        canvas.drawPath(path, Paint()
          ..color = completedColor
          ..strokeWidth = 7
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round);

        // ── Center highlight ──
        canvas.drawPath(path, Paint()
          ..color = Colors.white.withOpacity(0.3)
          ..strokeWidth = 2
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round);
      } else {
        // ── Locked: dim path ──
        canvas.drawPath(path, Paint()
          ..color = const Color(0xFF1A1A2A)
          ..strokeWidth = 12
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round);

        canvas.drawPath(path, Paint()
          ..color = lockedColor
          ..strokeWidth = 7
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round);
      }
    }
  }

  Path _buildCurvePath(Offset from, Offset to) {
    final path = Path();
    path.moveTo(from.dx, from.dy);

    final midY = (from.dy + to.dy) / 2;
    path.cubicTo(
      from.dx, midY,
      to.dx, midY,
      to.dx, to.dy,
    );

    return path;
  }

  @override
  bool shouldRepaint(covariant JourneyPathPainter old) => true;
}
