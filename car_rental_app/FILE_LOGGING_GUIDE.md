# Flutter App File-Based Logging

This document explains how to use the file-based logging system implemented in the Flutter car rental app.

## Features

- **Dual Output**: Logs are written to both console and files simultaneously
- **Daily Log Files**: Each day gets its own log file with timestamp
- **Automatic Cleanup**: Old log files (>7 days) are automatically removed
- **Log Levels**: Support for Debug, Info, Warning, Error, and Fatal levels
- **In-App Viewer**: View logs directly within the app
- **External Monitoring**: Watch log files from terminal

## File Locations

Log files are stored in the app's document directory:
- **Android**: `/data/data/com.example.car_rental_app/app_flutter/logs/`
- **iOS**: `~/Library/Application Support/car_rental_app/logs/`
- **Web**: Browser's IndexedDB (limited functionality)
- **Desktop**: `~/Documents/car_rental_app/logs/`

## Log File Format

Files are named with the pattern: `app_log_YYYY-MM-DD.log`

Example log entries:
```
[2024-01-15 14:30:25.123] 💙 [D] Debug log message - 2024-01-15 14:30:25.123456
[2024-01-15 14:30:25.456] 💚 [I] Info log message - Testing file logging
[2024-01-15 14:30:25.789] 💛 [W] Warning log message - This is a test warning
[2024-01-15 14:30:26.012] ❤️ [E] Error log message - Test error for debugging
```

## Using the Logger

### Basic Usage

```dart
import '../../core/utils/logger.dart';

// Debug messages (verbose information)
AppLogger.d('User tapped vehicle card');

// Info messages (general information)
AppLogger.i('Vehicle list loaded successfully');

// Warning messages (potential issues)
AppLogger.w('Network response took longer than expected');

// Error messages (recoverable errors)
AppLogger.e('Failed to load vehicles', error, stackTrace);

// Fatal messages (critical errors)
AppLogger.wtf('Critical system error', error, stackTrace);
```

### Advanced Usage

```dart
// Get current log file path
String? logPath = AppLogger.logFilePath;

// Get all available log files
List<File> logFiles = await AppLogger.getLogFiles();

// Clean up old log files manually
await AppLogger.clearOldLogs();
```

## Monitoring Logs

### Method 1: In-App Debug Viewer

1. Run the Flutter app
2. Navigate to Profile page
3. Tap the Settings icon (⚙️)
4. Select "Debug Logs"
5. View, copy, and generate test logs

### Method 2: Terminal Log Watcher

Use the provided script to watch logs in real-time:

```bash
# Make the script executable (first time only)
chmod +x scripts/watch_logs.sh

# Watch logs in real-time
./scripts/watch_logs.sh
```

### Method 3: Manual File Access

```bash
# Find log files manually (adjust path for your platform)
find ~ -name "app_log_*.log" -type f 2>/dev/null

# Watch the most recent log file
tail -f ~/Documents/car_rental_app/logs/app_log_$(date +%Y-%m-%d).log

# View all log files
ls -la ~/Documents/car_rental_app/logs/
```

## Development Workflow

### For Daily Development

1. **Start the app**: `flutter run -d chrome`
2. **Start log watcher**: `./scripts/watch_logs.sh` (in another terminal)
3. **Use the app**: Navigate, interact, trigger features
4. **Monitor logs**: Watch real-time output in the log watcher terminal

### For Debugging Issues

1. **Generate test logs**: Use the in-app debug viewer to create test logs
2. **Reproduce the issue**: Perform the steps that cause the problem
3. **Check logs**: Look for error messages, warnings, or unexpected behavior
4. **Copy logs**: Use the in-app viewer or terminal to copy relevant log sections

### For Bug Reports

1. **Access logs**: Use the in-app debug viewer
2. **Copy relevant section**: Select and copy the problematic log entries
3. **Include context**: Add timestamps and steps to reproduce
4. **Attach to issue**: Include log excerpt in bug reports

## Configuration

### Log Levels

The logger supports these levels (in order of severity):
- `Debug`: Detailed information for debugging
- `Info`: General operational information
- `Warning`: Something unexpected but recoverable
- `Error`: Error conditions but app continues
- `Fatal`: Critical errors that may crash the app

### File Rotation

- **Daily rotation**: New file created each day
- **Automatic cleanup**: Files older than 7 days are removed
- **Manual cleanup**: Call `AppLogger.clearOldLogs()` if needed

### Performance Impact

- **Minimal overhead**: File I/O is performed asynchronously
- **Fail-safe**: Falls back to console-only if file operations fail
- **Memory efficient**: Logs are written directly to files, not buffered

## Troubleshooting

### Log Files Not Created

1. Check permissions (mobile apps)
2. Verify path_provider dependency is installed
3. Check console for initialization errors
4. Try generating test logs from the debug viewer

### Cannot Find Log Files

```dart
// Get the exact path programmatically
String? path = AppLogger.logFilePath;
print('Log file path: $path');
```

### Log Watcher Script Not Working

```bash
# Make sure it's executable
chmod +x scripts/watch_logs.sh

# Run with bash explicitly
bash scripts/watch_logs.sh

# Check if Flutter is running
ps aux | grep flutter
```

### Large Log Files

```bash
# Check log file sizes
du -h ~/Documents/car_rental_app/logs/

# Compress old logs
gzip ~/Documents/car_rental_app/logs/app_log_*.log

# Clean up manually
rm ~/Documents/car_rental_app/logs/app_log_2024-01-*.log
```

## Platform-Specific Notes

### Web Development

- File-based logging has limited functionality on web
- Logs are stored in browser's IndexedDB
- Use browser developer tools for primary debugging
- Console output remains the most reliable method

### Mobile Development

- Requires device/simulator access for file inspection
- Use `flutter logs` command for additional system logs
- Debug viewer within app is most convenient method

### Desktop Development

- Full file system access available
- Log files easily accessible through file manager
- Terminal monitoring works best on desktop platforms

## Best Practices

1. **Use appropriate log levels**: Don't use debug logs for production
2. **Include context**: Add relevant information (user ID, operation, etc.)
3. **Avoid sensitive data**: Never log passwords, tokens, or personal data
4. **Monitor file sizes**: Clean up logs regularly in production
5. **Structure log messages**: Use consistent formatting for easier parsing

## Example Integration

```dart
class VehicleService {
  Future<List<Vehicle>> loadVehicles() async {
    AppLogger.i('Starting vehicle load operation');
    
    try {
      final response = await api.getVehicles();
      AppLogger.d('Received ${response.data.length} vehicles from API');
      
      final vehicles = response.data.map((json) => Vehicle.fromJson(json)).toList();
      AppLogger.i('Successfully loaded ${vehicles.length} vehicles');
      
      return vehicles;
    } catch (e, stackTrace) {
      AppLogger.e('Failed to load vehicles', e, stackTrace);
      rethrow;
    }
  }
}
```

This logging system provides comprehensive debugging capabilities while maintaining good performance and user experience.
