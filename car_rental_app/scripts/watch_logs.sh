#!/bin/bash

# Script to watch Flutter app log files
# Usage: ./scripts/watch_logs.sh

echo "🔍 Flutter App Log Watcher"
echo "=========================="

# Check if flutter is running
if ! pgrep -f "flutter" > /dev/null; then
    echo "⚠️  Flutter doesn't seem to be running. Start your app first with 'flutter run -d chrome'"
    echo ""
fi

# Function to find the most recent log file
find_latest_log() {
    # Common locations for Flutter web logs
    local log_locations=(
        "$HOME/.config/flutter_app/logs"
        "$HOME/Documents/logs"
        "/tmp/flutter_logs"
        "./logs"
    )
    
    local latest_file=""
    local latest_time=0
    
    for dir in "${log_locations[@]}"; do
        if [ -d "$dir" ]; then
            while IFS= read -r -d '' file; do
                if [ -f "$file" ]; then
                    local file_time=$(stat -f "%m" "$file" 2>/dev/null || stat -c "%Y" "$file" 2>/dev/null)
                    if [ "$file_time" -gt "$latest_time" ]; then
                        latest_time=$file_time
                        latest_file=$file
                    fi
                fi
            done < <(find "$dir" -name "*.log" -print0 2>/dev/null)
        fi
    done
    
    echo "$latest_file"
}

# Try to find and watch the log file
log_file=$(find_latest_log)

if [ -n "$log_file" ] && [ -f "$log_file" ]; then
    echo "📁 Watching log file: $log_file"
    echo "📊 File size: $(du -h "$log_file" | cut -f1)"
    echo "🕒 Last modified: $(date -r "$log_file" "+%Y-%m-%d %H:%M:%S")"
    echo ""
    echo "💡 Tip: In another terminal, run your Flutter app with:"
    echo "   cd /home/tannpv/x369-workspace/car_rental_app"
    echo "   flutter run -d chrome"
    echo ""
    echo "📺 Live log output (press Ctrl+C to stop):"
    echo "=========================================="
    
    # Watch the file with color output
    tail -f "$log_file" | while read line; do
        # Add color coding based on log level
        if [[ $line == *"ERROR"* ]] || [[ $line == *"[E]"* ]]; then
            echo -e "\033[31m$line\033[0m"  # Red for errors
        elif [[ $line == *"WARN"* ]] || [[ $line == *"[W]"* ]]; then
            echo -e "\033[33m$line\033[0m"  # Yellow for warnings
        elif [[ $line == *"INFO"* ]] || [[ $line == *"[I]"* ]]; then
            echo -e "\033[32m$line\033[0m"  # Green for info
        elif [[ $line == *"DEBUG"* ]] || [[ $line == *"[D]"* ]]; then
            echo -e "\033[36m$line\033[0m"  # Cyan for debug
        else
            echo "$line"
        fi
    done
else
    echo "❌ No log file found. The app may not have been started yet."
    echo ""
    echo "📋 To generate logs:"
    echo "1. Start your Flutter app: flutter run -d chrome"
    echo "2. Run this script again: ./scripts/watch_logs.sh"
    echo ""
    echo "🔍 Checked these locations:"
    echo "   - $HOME/.config/flutter_app/logs"
    echo "   - $HOME/Documents/logs"
    echo "   - /tmp/flutter_logs"
    echo "   - ./logs"
    echo ""
    echo "📱 You can also check app logs directly in the terminal where Flutter is running."
fi
