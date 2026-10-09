#!/usr/bin/env bash
# ==============================================================================
# DoraBot Watchdog Daemon Controller
# Controls background daemon that monitors disk usage (<4GB) & OmniRoute bridge
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$DIR/.watchdog.pid"
SCRIPT="$DIR/scripts/disk-monitor.sh"
LOG_FILE="$DIR/monitor.log"

is_running() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
      return 0
    fi
  fi
  # Fallback check
  if pgrep -f "scripts/disk-monitor.sh" > /dev/null; then
    return 0
  fi
  return 1
}

case "$1" in
  start)
    if is_running; then
      echo "DoraBot Watchdog is already running (PID $(cat "$PID_FILE" 2>/dev/null || pgrep -f "scripts/disk-monitor.sh"))."
    else
      echo "Starting DoraBot Watchdog daemon..."
      nohup bash "$SCRIPT" >> "$LOG_FILE" 2>&1 &
      NEW_PID=$!
      disown "$NEW_PID" 2>/dev/null || true
      echo "$NEW_PID" > "$PID_FILE"
      sleep 1
      if kill -0 "$NEW_PID" 2>/dev/null; then
        echo "DoraBot Watchdog started successfully (PID $NEW_PID)."
      else
        echo "Failed to start watchdog daemon. Check $LOG_FILE"
        exit 1
      fi
    fi
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      kill "$PID" 2>/dev/null || true
      rm -f "$PID_FILE"
    fi
    pkill -f "scripts/disk-monitor.sh" 2>/dev/null || true
    echo "DoraBot Watchdog stopped."
    ;;
  status)
    if is_running; then
      PID=$(cat "$PID_FILE" 2>/dev/null || pgrep -f "scripts/disk-monitor.sh")
      echo "DoraBot Watchdog is RUNNING (PID $PID)."
      USED_MB=$(( $(df -k /home | awk 'NR==2 {print $3}') / 1024 ))
      echo "Current /home usage: ${USED_MB}MB / 4800MB (Safe Threshold: 3800MB)"
      tail -n 5 "$LOG_FILE" 2>/dev/null || true
    else
      echo "DoraBot Watchdog is STOPPED."
      exit 1
    fi
    ;;
  restart)
    $0 stop
    sleep 1
    $0 start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
