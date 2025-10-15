import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/utils/logger.dart';

class DebugLogPage extends StatefulWidget {
  const DebugLogPage({super.key});

  @override
  State<DebugLogPage> createState() => _DebugLogPageState();
}

class _DebugLogPageState extends State<DebugLogPage> {
  List<File> _logFiles = [];
  String? _selectedLogContent;
  bool _isLoading = false;
  File? _selectedFile;

  @override
  void initState() {
    super.initState();
    _loadLogFiles();
  }

  Future<void> _loadLogFiles() async {
    setState(() => _isLoading = true);
    
    try {
      final files = await AppLogger.getLogFiles();
      setState(() {
        _logFiles = files;
        _isLoading = false;
      });
    } catch (e) {
      AppLogger.e('Failed to load log files', e);
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadLogContent(File file) async {
    setState(() => _isLoading = true);
    
    try {
      final content = await file.readAsString();
      setState(() {
        _selectedLogContent = content;
        _selectedFile = file;
        _isLoading = false;
      });
    } catch (e) {
      AppLogger.e('Failed to read log file', e);
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to read log file: $e')),
        );
      }
    }
  }

  void _copyLogPath() {
    final path = AppLogger.logFilePath;
    if (path != null) {
      Clipboard.setData(ClipboardData(text: path));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Log file path copied to clipboard')),
      );
    }
  }

  void _generateTestLogs() {
    AppLogger.d('Debug log message - ${DateTime.now()}');
    AppLogger.i('Info log message - Testing file logging');
    AppLogger.w('Warning log message - This is a test warning');
    AppLogger.e('Error log message - Test error for debugging');
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Test logs generated')),
    );
    
    // Refresh the current log content if viewing
    if (_selectedFile != null) {
      _loadLogContent(_selectedFile!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Debug Logs'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadLogFiles,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _buildContent(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _generateTestLogs,
        icon: const Icon(Icons.bug_report),
        label: const Text('Generate Test Logs'),
      ),
    );
  }

  Widget _buildContent() {
    return Column(
      children: [
        // Header info
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16.0),
          margin: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(8.0),
            border: Border.all(color: Theme.of(context).dividerColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Current Log File',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      AppLogger.logFilePath ?? 'No log file path available',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        fontFamily: 'monospace',
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy),
                    onPressed: _copyLogPath,
                    tooltip: 'Copy log file path',
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Found ${_logFiles.length} log files',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ],
          ),
        ),
        
        // Log files list
        if (_logFiles.isNotEmpty)
          Expanded(
            flex: 1,
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Available Log Files',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: _logFiles.length,
                    itemBuilder: (context, index) {
                      final file = _logFiles[index];
                      final fileName = file.path.split('/').last;
                      final fileSize = file.lengthSync();
                      final lastModified = file.lastModifiedSync();
                      
                      return ListTile(
                        title: Text(fileName),
                        subtitle: Text(
                          'Size: ${(fileSize / 1024).toStringAsFixed(1)} KB\n'
                          'Modified: ${lastModified.toString().substring(0, 19)}',
                        ),
                        trailing: const Icon(Icons.visibility),
                        selected: _selectedFile == file,
                        onTap: () => _loadLogContent(file),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        
        // Log content viewer
        if (_selectedLogContent != null)
          Expanded(
            flex: 2,
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Row(
                    children: [
                      Text(
                        'Log Content',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const Spacer(),
                      TextButton.icon(
                        icon: const Icon(Icons.copy),
                        label: const Text('Copy All'),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: _selectedLogContent!));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Log content copied to clipboard')),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Container(
                    margin: const EdgeInsets.all(8.0),
                    padding: const EdgeInsets.all(12.0),
                    decoration: BoxDecoration(
                      color: Colors.black87,
                      borderRadius: BorderRadius.circular(8.0),
                      border: Border.all(color: Theme.of(context).dividerColor),
                    ),
                    child: SingleChildScrollView(
                      child: SelectableText(
                        _selectedLogContent!,
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 12,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        
        if (_logFiles.isEmpty)
          const Expanded(
            child: Center(
              child: Text(
                'No log files found.\nGenerate some test logs to get started.',
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }
}
