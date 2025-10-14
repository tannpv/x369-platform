import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';
import 'package:path_provider/path_provider.dart';
import 'package:intl/intl.dart';

class AppLogger {
  static late Logger _logger;
  static File? _logFile;
  
  static Future<void> init() async {
    try {
      // Get the documents directory for storing log files
      final directory = await getApplicationDocumentsDirectory();
      final logDir = Directory('${directory.path}/logs');
      
      // Create logs directory if it doesn't exist
      if (!await logDir.exists()) {
        await logDir.create(recursive: true);
      }
      
      // Create log file with timestamp
      final timestamp = DateFormat('yyyy-MM-dd').format(DateTime.now());
      _logFile = File('${logDir.path}/app_log_$timestamp.log');
      
      _logger = Logger(
        printer: PrettyPrinter(
          methodCount: 0,
          errorMethodCount: 8,
          lineLength: 120,
          colors: true,
          printEmojis: true,
        ),
        output: MultiOutput([
          ConsoleOutput(),
          FileOutput(file: _logFile!),
        ]),
      );
      
      i('Logger initialized with file output: ${_logFile!.path}');
    } catch (e) {  
      // Fallback to console-only logging if file setup fails
      _logger = Logger(
        printer: PrettyPrinter(
          methodCount: 0,   
          errorMethodCount: 8,
          lineLength: 120,
          colors: true,
          printEmojis: true,
        ),
      );
      debugPrint('Failed to initialize file logging: $e');
    }
  }
  
  static void d(dynamic message) {
    _logger.d(message);
  }
  
  static void i(dynamic message) {
    _logger.i(message);
  }
  
  static void w(dynamic message) {
    _logger.w(message);
  }
  
  static void e(dynamic message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e(message, error: error, stackTrace: stackTrace);
  }
  
  static void wtf(dynamic message, [dynamic error, StackTrace? stackTrace]) {
    _logger.f(message, error: error, stackTrace: stackTrace);
  }
  
  /// Get the current log file path for debugging
  static String? get logFilePath => _logFile?.path;
  
  /// Get all available log files
  static Future<List<File>> getLogFiles() async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final logDir = Directory('${directory.path}/logs');
      
      if (await logDir.exists()) {
        final files = logDir.listSync()
          .whereType<File>()
          .where((file) => file.path.endsWith('.log'))
          .toList();
        
        // Sort by modification date (newest first)
        files.sort((a, b) => b.lastModifiedSync().compareTo(a.lastModifiedSync()));
        return files;
      }
      return [];
    } catch (e) {
      debugPrint('Failed to get log files: $e');
      return [];
    }
  }
  
  /// Clear old log files (keep only last 7 days)
  static Future<void> clearOldLogs() async {
    try {
      final files = await getLogFiles();
      final cutoffDate = DateTime.now().subtract(const Duration(days: 7));
      
      for (final file in files) {
        if (file.lastModifiedSync().isBefore(cutoffDate)) {
          await file.delete();
          i('Deleted old log file: ${file.path}');
        }
      }
    } catch (e) {
      debugPrint('Failed to clear old logs: $e');
    }
  }
}

/// Custom file output for Logger
class FileOutput extends LogOutput {
  final File file;
  
  FileOutput({required this.file});
  
  @override
  void output(OutputEvent event) {
    try {
      final timestamp = DateFormat('yyyy-MM-dd HH:mm:ss.SSS').format(DateTime.now());
      final lines = event.lines.map((line) => '[$timestamp] $line').join('\n');
      file.writeAsStringSync('$lines\n', mode: FileMode.append);
    } catch (e) {
      debugPrint('Failed to write to log file: $e');
    }
  }
}

/// Multiple output handler to write to both console and file
class MultiOutput extends LogOutput {
  final List<LogOutput> outputs;
  
  MultiOutput(this.outputs);
  
  @override
  void output(OutputEvent event) {
    for (final output in outputs) {
      output.output(event);
    }
  }
}
