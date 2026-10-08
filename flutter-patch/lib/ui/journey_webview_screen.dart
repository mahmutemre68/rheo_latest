import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:ui' show PlatformDispatcher;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../logic/notification_service.dart';

/// Loads the React Journey web app from bundled assets inside a WebView.
///
/// Strategy: Copy assets to temp dir → start a local HTTP server → load via
/// http://localhost so that all relative resource references (JS, CSS, images)
/// work without file:// permissions issues.
///
/// Asset discovery uses a triple-fallback strategy:
///   1. Flutter's official AssetManifest API (works with both .json and .bin)
///   2. Direct AssetManifest.json parsing for older Flutter bundles
///   3. Build-generated assets/journey-web/asset-manifest.json
class JourneyWebViewScreen extends StatefulWidget {
  const JourneyWebViewScreen({super.key});
  @override
  State<JourneyWebViewScreen> createState() => _JourneyWebViewScreenState();
}

class _JourneyWebViewScreenState extends State<JourneyWebViewScreen> {
  WebViewController? _controller;
  HttpServer? _server;
  // WebView'a yukleme emri verildikten sonra gelen bascibos async hatalar
  // ekrani devralmamali; kullanici o sirada dersin ortasinda olabilir.
  bool _loadStarted = false;
  bool _loading = true;
  String? _error;

  // Where the claimed server port is remembered. See _bindStableServer.
  static const List<int> _preferredPorts = [47653, 47654, 47655, 47656, 47657];

  /// The bundled web app carries its own TR/EN strings, but these few shell
  /// messages sit outside it. App Review reads the app in English, so they must
  /// not be Turkish-only.
  static bool get _isTurkish =>
      PlatformDispatcher.instance.locale.languageCode == 'tr';
  static String _tr(String turkish, String english) =>
      _isTurkish ? turkish : english;

  // Hashed Vite filenames are discovered dynamically. The stable path-only
  // asset-manifest.json is generated together with the web bundle and keeps
  // the final fallback in sync without a hardcoded hash list.

  @override
  void initState() {
    super.initState();
    // Wrap in its own zone so FFI-level errors (e.g. objective_c.dylib on
    // iOS 26 beta) don't escape to the root zone and crash the whole app.
    runZonedGuarded(
      () => _initWebView(),
      (error, stack) {
        debugPrint('⚠️ JourneyWebView zone error: $error');
        debugPrint('Stack: $stack');
        // Only take over the screen when there is nothing to take over — if the
        // WebView is already up, the learner is mid-lesson and a stray async
        // error must not throw away their round. _initWebView reports its own
        // failures through _error; this is the last-resort net for everything
        // that never reached it.
        if (mounted && !_loadStarted) {
          setState(() {
            _error = _tr('Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
                'Something went wrong. Please try again.');
            _loading = false;
          });
        }
      },
    );
  }

  @override
  void dispose() {
    _server?.close(force: true);
    super.dispose();
  }

  /// Handle messages posted from JS via the `RheoNative` channel.
  /// Payload is JSON, e.g. {"action":"openUrl","url":"https://…"}.
  void _handleNativeMessage(String raw) {
    try {
      final data = json.decode(raw) as Map<String, dynamic>;
      switch (data['action']) {
        case 'openUrl':
          if (data['url'] is String) _openExternal(data['url'] as String);
          break;
        case 'haptic':
          _triggerHaptic(data['style'] as String?);
          break;
        case 'share':
          _shareText(data['text'] as String?, data['url'] as String?);
          break;
        // Daily reminders. The service was fully written and had no caller,
        // so reminders defaulted to off and nothing could ever turn them on.
        case 'notificationsEnable':
          _setReminders(true, data['hour'], data['minute']);
          break;
        case 'notificationsDisable':
          _setReminders(false, null, null);
          break;
        case 'notificationsQuery':
          _replyReminderState();
          break;
      }
    } catch (e) {
      debugPrint('⚠️ RheoNative message parse error: $e');
    }
  }

  /// Turn daily reminders on or off, then tell the web app what happened so
  /// its toggle reflects the real OS permission rather than the tap.
  Future<void> _setReminders(bool on, dynamic hour, dynamic minute) async {
    try {
      if (on) {
        if (hour is int && minute is int) {
          await notificationService.setReminderTime(hour, minute);
        }
        // Asks the OS the first time; returns false if the learner declines,
        // which must leave the toggle off rather than silently on.
        final granted = await notificationService.requestPermissions();
        if (!granted) await notificationService.setEnabled(false);
      } else {
        await notificationService.setEnabled(false);
      }
    } catch (e) {
      debugPrint('⚠️ reminder toggle failed: $e');
    }
    await _replyReminderState();
  }

  /// Push the current reminder state into the page as window.__rheoReminders.
  Future<void> _replyReminderState() async {
    try {
      final on = notificationService.isEnabled;
      final h = notificationService.hour;
      final m = notificationService.minute;
      await _controller?.runJavaScript(
        'window.__rheoReminders = {enabled: $on, hour: $h, minute: $m};'
        'window.dispatchEvent(new Event("rheo-reminders"));',
      );
    } catch (e) {
      debugPrint('⚠️ reminder state push failed: $e');
    }
  }

  /// Native haptic feedback — something a plain web page cannot do on iOS,
  /// where the Web Vibration API is unsupported.
  void _triggerHaptic(String? style) {
    switch (style) {
      case 'light':
      case 'selection':
        HapticFeedback.selectionClick();
        break;
      case 'medium':
      case 'success':
      case 'warning':
        HapticFeedback.mediumImpact();
        break;
      case 'heavy':
      case 'error':
        HapticFeedback.heavyImpact();
        break;
      default:
        HapticFeedback.selectionClick();
    }
  }

  /// Open the native OS share sheet.
  Future<void> _shareText(String? text, String? url) async {
    if (text == null && url == null) return;
    final message = [text, url].where((e) => e != null && e.isNotEmpty).join(' ');
    try {
      await SharePlus.instance.share(ShareParams(text: message));
    } catch (e) {
      debugPrint('⚠️ share failed: $e');
    }
  }

  /// Open a URL outside the WebView using the OS default handler.
  Future<void> _openExternal(String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        debugPrint('⚠️ Cannot launch external URL: $url');
      }
    } catch (e) {
      debugPrint('⚠️ _openExternal failed for $url: $e');
    }
  }

  /// Bind the loopback server to a port that survives restarts.
  ///
  /// The port is part of the WebView's origin (`http://127.0.0.1:<port>`), and
  /// WebKit scopes localStorage — where the entire learning journey lives: XP,
  /// streak, gems, completed nodes, league standing, language — to that origin.
  /// Binding to port 0 handed out a *different* port on every launch, so every
  /// restart silently dropped the learner back to a blank profile. Claiming one
  /// stable port keeps the origin, and therefore the progress, intact.
  ///
  /// The port is remembered in a plain file rather than Hive. Hive needs
  /// path_provider, and when path_provider cannot load its native library
  /// `Hive.openBox` throws an error that escapes a surrounding try/catch and
  /// surfaces as an unhandled async error — which used to take the whole
  /// screen down to "Bağlantı hatası" on launch even though the server went on
  /// to bind normally. A file has no such failure mode, and it lands in the
  /// same directory the web assets already use, which has its own fallbacks.
  /// Where to keep the remembered port.
  ///
  /// Application support, not the temp dir: iOS purges temp under storage
  /// pressure, and losing this file loses the port, which loses the WebView
  /// origin, which loses every learner's progress. Falls back to the caller's
  /// directory only when path_provider itself is unusable.
  Future<Directory> _portDir(Directory fallbackDir) async {
    for (final get in [getApplicationSupportDirectory, getApplicationDocumentsDirectory]) {
      try {
        final dir = await get();
        if (!await dir.exists()) await dir.create(recursive: true);
        return dir;
      } catch (_) {
        // path_provider unavailable — try the next one, then the fallback.
      }
    }
    return fallbackDir;
  }

  Future<HttpServer> _bindStableServer(Directory fallbackDir) async {
    final portFile = File('${(await _portDir(fallbackDir)).path}/.web_server_port');
    int? saved;
    try {
      if (await portFile.exists()) {
        saved = int.tryParse((await portFile.readAsString()).trim());
      }
    } catch (e) {
      debugPrint('⚠️ could not read remembered port: $e');
    }

    final candidates = <int>[
      if (saved != null && saved > 1024) saved,
      ..._preferredPorts.where((p) => p != saved),
    ];

    for (final port in candidates) {
      try {
        final server = await HttpServer.bind(InternetAddress.loopbackIPv4, port);
        if (saved != port) {
          try {
            await portFile.writeAsString('$port');
          } catch (e) {
            debugPrint('⚠️ could not persist port $port: $e');
          }
        }
        debugPrint('🌐 Bound stable port $port');
        return server;
      } on SocketException catch (e) {
        debugPrint('⚠️ port $port unavailable: ${e.osError?.message}');
      }
    }

    // Every candidate was busy. An ephemeral port means this session starts
    // with empty web storage, which is bad — but far better than refusing to
    // launch at all.
    debugPrint('⚠️ all preferred ports busy; falling back to an ephemeral one');
    return HttpServer.bind(InternetAddress.loopbackIPv4, 0);
  }

  Future<void> _initWebView() async {
    try {
      // 1) Copy all bundled assets to a temp directory
      final webDir = await _copyAssets();

      // 2) Start a local HTTP server serving from that directory
      // webDir her acilista silinip yeniden olusturuluyor; port dosyasi bir
      // ust klasorde durmali, yoksa her acilista kaybolur ve sabit port
      // hatirlanamaz.
      final server = await _bindStableServer(webDir.parent);
      _server = server;
      final port = server.port;
      debugPrint('🌐 Local server started on port $port');

      server.listen((HttpRequest request) async {
        try {
          // Any app on the device can reach this loopback port, so a request
          // for `/../../Documents/…` must not hand out files from our own
          // sandbox. normalizePath applies RFC 3986 remove_dot_segments, which
          // drops `..` segments that would climb above the root; the prefix
          // check below is the belt to that suspenders.
          String path = Uri.parse(request.uri.path).normalizePath().path;
          if (path == '/' || path.isEmpty) path = '/index.html';

          final root = webDir.absolute.path;
          final file = File('$root$path');
          if (!file.path.startsWith('$root/')) {
            debugPrint('🚫 rejected path escape: ${request.uri.path}');
            request.response.statusCode = HttpStatus.forbidden;
            request.response.write('Forbidden');
            await request.response.close();
            return;
          }
          if (await file.exists()) {
            final ext = path.split('.').last.toLowerCase();
            request.response.headers.set('Content-Type', _mimeType(ext));
            request.response.headers.set('Access-Control-Allow-Origin', '*');
            await request.response.addStream(file.openRead());
          } else {
            debugPrint('🔍 404: $path');
            request.response.statusCode = HttpStatus.notFound;
            request.response.write('File not found: $path');
          }
        } catch (e) {
          // The client is usually WKWebView cancelling a request it no longer
          // needs, which aborts the response mid-stream. Touching the response
          // after that throws again, and a throw here escapes into the zone —
          // where the handler used to swap the whole app for an error screen
          // over one dropped sub-resource. Swallow it: the page is fine.
          debugPrint('⚠️ request failed (${request.uri.path}): $e');
        }
        try {
          await request.response.close();
        } catch (_) {
          // Already closed or aborted by the client — nothing left to do.
        }
      });

      // 3) Load the page in WebView via localhost
      final controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xFF0F172A))
        // Bridge so the bundled web app can ask the OS to open external links
        // (privacy policy, feedback mailto, App Store rating, …). WKWebView
        // ignores window.open('_blank'), so the web app posts here instead.
        ..addJavaScriptChannel(
          'RheoNative',
          onMessageReceived: (message) => _handleNativeMessage(message.message),
        )
        ..setNavigationDelegate(
          NavigationDelegate(
            // Keep localhost navigations inside the WebView; send anything else
            // (external https, mailto, tel, …) to the system browser/handler.
            onNavigationRequest: (request) {
              final uri = Uri.tryParse(request.url);
              final isLocal = uri != null &&
                  (uri.host == '127.0.0.1' || uri.host == 'localhost');
              if (uri != null && !isLocal) {
                _openExternal(request.url);
                return NavigationDecision.prevent;
              }
              return NavigationDecision.navigate;
            },
            onPageFinished: (_) {
              if (mounted) setState(() => _loading = false);
            },
            onWebResourceError: (error) {
              debugPrint('🔴 WebView error: ${error.description} '
                  '(isMainFrame: ${error.isForMainFrame})');
              // Only set error for main frame failures, not sub-resource issues
              if (error.isForMainFrame ?? true) {
                if (mounted) {
                  setState(() {
                    _error = _tr('Sayfa yüklenemedi. Lütfen tekrar deneyin.',
                        'The page could not be loaded. Please try again.');
                    _loading = false;
                  });
                }
              }
            },
          ),
        )
        ..loadRequest(Uri.parse('http://127.0.0.1:$port/index.html'));

      // From here on the page is on its way; a stray async error from some
      // unrelated plugin must not replace it with the error screen.
      _loadStarted = true;

      if (mounted) {
        setState(() => _controller = controller);
      }
    } catch (e, stack) {
      debugPrint('❌ _initWebView failed: $e');
      debugPrint('Stack: $stack');
      if (mounted) {
        setState(() {
          // Show user-friendly message, log the real error
          _error = _tr('İçerik yüklenemedi. Lütfen tekrar deneyin.',
              'Content could not be loaded. Please try again.');
          _loading = false;
        });
      }
    }
  }

  /// Copy all files under assets/journey-web/ to a temp directory.
  ///
  /// Uses a triple-fallback strategy for maximum reliability:
  ///   1. Flutter's official AssetManifest API
  ///   2. Hardcoded file list with verification
  ///   3. Direct rootBundle.load probing
  Future<Directory> _copyAssets() async {
    // Get a writable directory — multiple fallbacks for iOS compatibility
    final dir = await _getWritableDirectory();
    final webDir = Directory('${dir.path}/journey-web');
    if (await webDir.exists()) await webDir.delete(recursive: true);
    await webDir.create(recursive: true);

    const prefix = 'assets/journey-web/';

    // Discover all journey-web assets using triple-fallback
    List<String> journeyAssets = await _discoverAssets(prefix);

    debugPrint('📦 Journey assets to copy: ${journeyAssets.length}');
    for (final a in journeyAssets) {
      debugPrint('  → $a');
    }

    // Safety check: if discovery found too few assets, something is wrong
    if (journeyAssets.length < 3) {
      throw Exception(
        'Asset discovery found only ${journeyAssets.length} assets. '
        'Expected at least index.html + JS + CSS.',
      );
    }

    int copied = 0;
    int failed = 0;

    for (final assetKey in journeyAssets) {
      // Derive the relative path within journey-web/
      final relativePath = assetKey.substring(prefix.length);
      final destPath = '${webDir.path}/$relativePath';

      // Ensure parent directory exists
      final lastSlash = destPath.lastIndexOf('/');
      if (lastSlash > 0) {
        final parentDir = Directory(destPath.substring(0, lastSlash));
        if (!await parentDir.exists()) {
          await parentDir.create(recursive: true);
        }
      }

      // Copy the file using binary load to avoid encoding issues
      try {
        final data = await rootBundle.load(assetKey);
        final bytes =
            data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
        await File(destPath).writeAsBytes(bytes);
        debugPrint('  ✅ $relativePath (${bytes.length} bytes)');
        copied++;
      } catch (e) {
        failed++;
        debugPrint('  ⚠️ FAILED to copy $assetKey: $e');
      }
    }

    debugPrint('📊 Copy result: $copied OK, $failed failed');

    // Verify critical files exist on disk
    final indexFile = File('${webDir.path}/index.html');
    if (!await indexFile.exists()) {
      throw Exception(
        'CRITICAL: index.html not found after copying $copied assets!',
      );
    }

    // Verify at least one JS file exists
    final assetsDir = Directory('${webDir.path}/assets');
    if (await assetsDir.exists()) {
      final jsFiles = await assetsDir
          .list()
          .where((e) => e is File && e.path.endsWith('.js'))
          .length;
      debugPrint('📄 JS files in output: $jsFiles');
      if (jsFiles == 0) {
        throw Exception(
          'CRITICAL: No JS files found in output assets/ directory!',
        );
      }
    } else {
      throw Exception(
        'CRITICAL: assets/ subdirectory not created!',
      );
    }

    // Debug: list all files in the output directory
    await _debugListDir(webDir, '');

    return webDir;
  }

  /// Get a writable directory with multiple fallbacks.
  Future<Directory> _getWritableDirectory() async {
    // Try getTemporaryDirectory first (fastest, auto-cleaned)
    try {
      final dir = await getTemporaryDirectory();
      debugPrint('📁 Using temp directory: ${dir.path}');
      return dir;
    } catch (e) {
      debugPrint('⚠️ getTemporaryDirectory failed: $e');
    }

    // Fallback to application support directory
    try {
      final dir = await getApplicationSupportDirectory();
      debugPrint('📁 Using app support directory: ${dir.path}');
      return dir;
    } catch (e) {
      debugPrint('⚠️ getApplicationSupportDirectory failed: $e');
    }

    // Fallback to application documents directory
    try {
      final dir = await getApplicationDocumentsDirectory();
      debugPrint('📁 Using documents directory: ${dir.path}');
      return dir;
    } catch (e) {
      debugPrint('⚠️ getApplicationDocumentsDirectory failed: $e');
    }

    // Last resort: /tmp (always available on iOS/macOS)
    debugPrint('📁 Using /tmp as last resort');
    return Directory('/tmp');
  }

  /// Recursively list all files in a directory for debug logging.
  Future<void> _debugListDir(Directory dir, String indent) async {
    await for (final entity in dir.list()) {
      if (entity is File) {
        final size = await entity.length();
        debugPrint('$indent📄 ${entity.path.split('/').last} ($size bytes)');
      } else if (entity is Directory) {
        debugPrint('$indent📁 ${entity.path.split('/').last}/');
        await _debugListDir(entity, '$indent  ');
      }
    }
  }

  /// Discover assets using triple-fallback strategy.
  ///
  /// Strategy 1: Flutter's official AssetManifest API
  ///   - Works with both AssetManifest.json (Flutter <3.7) and
  ///     AssetManifest.bin (Flutter ≥3.7)
  ///   - This is the recommended approach
  ///
  /// Strategy 2: Direct AssetManifest.json parsing
  ///   - Compatibility path for bundles that still expose the JSON manifest
  ///
  /// Strategy 3: Build-generated asset-manifest.json
  ///   - Stable filename with every clean Vite output path
  ///   - Avoids hardcoded hashed JS/CSS filenames
  Future<List<String>> _discoverAssets(String prefix) async {
    // ── Strategy 1: Official Flutter AssetManifest API ──
    try {
      debugPrint('🔎 Strategy 1: AssetManifest API...');
      final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
      final allAssets = manifest.listAssets();
      final journeyAssets = allAssets
          .where((key) => key.startsWith(prefix))
          .toList();

      if (journeyAssets.isNotEmpty) {
        debugPrint(
            '✅ Strategy 1 SUCCESS: ${journeyAssets.length} journey assets');
        return journeyAssets;
      }
      debugPrint('⚠️ Strategy 1: API returned 0 journey assets');
    } catch (e) {
      debugPrint('⚠️ Strategy 1 FAILED: $e');
    }

    // ── Strategy 2: Direct load and parse of AssetManifest.json ──
    // Bypasses the Flutter SDK AssetManifest API, loading the raw manifest
    // file directly. Highly resilient fallback.
    try {
      debugPrint('🔎 Strategy 2: Direct AssetManifest.json load...');
      final manifestStr = await rootBundle.loadString('AssetManifest.json');
      final Map<String, dynamic> manifestMap = json.decode(manifestStr);
      final journeyAssets = manifestMap.keys
          .where((key) => key.startsWith(prefix))
          .toList();

      if (journeyAssets.isNotEmpty) {
        debugPrint(
            '✅ Strategy 2 SUCCESS: ${journeyAssets.length} journey assets');
        return journeyAssets;
      }
    } catch (e) {
      debugPrint('⚠️ Strategy 2 FAILED: $e');
    }

    // ── Strategy 3: Stable build-generated manifest ──
    // This file is declared through the existing assets/journey-web/ pubspec
    // directory entry, so it remains loadable even when framework manifest
    // discovery is unavailable.
    try {
      debugPrint('🔎 Strategy 3: journey asset manifest...');
      final manifestStr =
          await rootBundle.loadString('${prefix}asset-manifest.json');
      final decoded = json.decode(manifestStr);
      final rawFiles = decoded is Map<String, dynamic> ? decoded['files'] : null;
      if (rawFiles is! List) {
        throw const FormatException('files must be a list');
      }

      final journeyAssets = rawFiles
          .whereType<String>()
          .where((path) =>
              path.isNotEmpty &&
              !path.startsWith('/') &&
              !path.contains('..') &&
              !path.contains('\\'))
          .map((path) => '$prefix$path')
          .toSet()
          .toList();
      if (journeyAssets.length < 3 ||
          !journeyAssets.contains('${prefix}index.html')) {
        throw const FormatException(
            'manifest must contain index.html and at least two resources');
      }
      debugPrint(
          '✅ Strategy 3 SUCCESS: ${journeyAssets.length} journey assets');
      return journeyAssets;
    } catch (e) {
      debugPrint('⚠️ Strategy 3 FAILED: $e');
      throw Exception('Could not discover bundled Journey assets: $e');
    }
  }

  /// Return MIME type for common web file extensions.
  String _mimeType(String ext) {
    switch (ext) {
      case 'html':
        return 'text/html; charset=utf-8';
      case 'js':
        return 'application/javascript; charset=utf-8';
      case 'css':
        return 'text/css; charset=utf-8';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'svg':
        return 'image/svg+xml';
      case 'json':
        return 'application/json';
      case 'woff':
      case 'woff2':
        return 'font/woff2';
      case 'ico':
        return 'image/x-icon';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      case 'map':
        return 'application/json';
      default:
        return 'application/octet-stream';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        // No top/bottom padding — React app handles its own layout
        top: false,
        bottom: false,
        child: _error != null
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.error_outline,
                          color: Colors.red, size: 48),
                      const SizedBox(height: 16),
                      Text(_error!,
                          style: const TextStyle(
                              color: Colors.red, fontSize: 14),
                          textAlign: TextAlign.center),
                      const SizedBox(height: 20),
                      ElevatedButton.icon(
                        // Await the close before rebinding: the old socket
                        // still holds the stable port, and racing it would
                        // land us on a fallback port — a different origin,
                        // which reads to the learner as "the retry wiped my
                        // progress".
                        onPressed: () async {
                          setState(() {
                            _error = null;
                            _loading = true;
                            _loadStarted = false;
                          });
                          await _server?.close(force: true);
                          _server = null;
                          await _initWebView();
                        },
                        icon: const Icon(Icons.refresh),
                        label: Text(_tr('Tekrar Dene', 'Try Again')),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF58CC02),
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            : Stack(
                children: [
                  if (_controller != null)
                    WebViewWidget(controller: _controller!),
                  if (_loading)
                    const Center(
                      child: CircularProgressIndicator(
                          color: Color(0xFF58CC02)),
                    ),
                ],
              ),
      ),
    );
  }
}
