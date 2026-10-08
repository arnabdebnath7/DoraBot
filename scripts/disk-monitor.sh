#!/usr/bin/env bash
# ==============================================================================
# DoraBot Auto-Watchdog: Disk & Token / Bridge Health Monitor
# Monitors /home disk usage to keep it strictly below 4GB.
# Cleans temporary caches automatically when threshold is approached.
# Ensures OmniRoute bridge remains active.
# ==============================================================================

LOG_FILE="/home/debnathsusmita098/DoraBot/monitor.log"
THRESHOLD_KB=3800000 # ~3.8GB in KB

echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] Starting DoraBot Watchdog Daemon" >> "$LOG_FILE"

while true; do
  # Get /home used KB
  USED_KB=$(df -k /home | awk 'NR==2 {print $3}')
  AVAIL_KB=$(df -k /home | awk 'NR==2 {print $4}')
  USED_MB=$((USED_KB / 1024))
  AVAIL_MB=$((AVAIL_KB / 1024))

  if [ "$USED_KB" -gt "$THRESHOLD_KB" ]; then
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] [ALERT] /home used: ${USED_MB}MB exceeds 3.8GB threshold! Cleaning caches..." >> "$LOG_FILE"
    
    # Clean caches
    npm cache clean --force 2>/dev/null || true
    rm -rf /home/debnathsusmita098/.npm/_cacache 2>/dev/null || true
    rm -rf /home/debnathsusmita098/.npm/_npx 2>/dev/null || true
    rm -rf /home/debnathsusmita098/.cache/pip 2>/dev/null || true
    rm -rf /tmp/npm-* 2>/dev/null || true
    
    NEW_USED_KB=$(df -k /home | awk 'NR==2 {print $3}')
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] [CLEANED] /home used is now $((NEW_USED_KB / 1024))MB" >> "$LOG_FILE"
  fi

  # Check OmniRoute bridge
  BRIDGE_HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:20129 || true)
  if [ "$BRIDGE_HTTP" != "200" ]; then
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] [WARN] OmniRoute bridge not responding (HTTP $BRIDGE_HTTP). Checking process..." >> "$LOG_FILE"
    if ! pgrep -f "bridge.py" > /dev/null; then
      echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] Restarting bridge.py..." >> "$LOG_FILE"
      nohup python3 /home/debnathsusmita098/.omniroute/bridge.py > /home/debnathsusmita098/.omniroute/bridge.log 2>&1 &
    fi
  fi

  sleep 20
done
