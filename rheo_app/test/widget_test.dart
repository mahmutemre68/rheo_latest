// Basic Flutter test for Rheo App

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rheo_app/main.dart';

void main() {
  testWidgets('App launches successfully', (WidgetTester tester) async {
    // Build our app
    await tester.pumpWidget(const RheoApp());

    // Allow widget to build
    await tester.pump(const Duration(milliseconds: 500));

    // Verify that MaterialApp is built
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
