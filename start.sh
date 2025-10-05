#!/bin/bash
# Startup script for AI Development Studio
# Orchestrates Ollama, AI Router, code-server, and live preview

echo "=========================================="
echo "  AI Development Studio"
echo "=========================================="
echo ""
echo "Environment Information:"
echo "  - User: $(whoami)"
echo "  - Working Directory: $(pwd)"
echo "  - Node Version: $(node --version 2>/dev/null || echo 'Not installed')"
echo "  - Python Version: $(python3 --version 2>/dev/null || echo 'Not installed')"
echo "  - Git Version: $(git --version 2>/dev/null || echo 'Not installed')"
echo ""
echo "Configuration:"
echo "  - Provider: ${DEFAULT_PROVIDER:-ollama}"
echo "  - Model: ${DEFAULT_MODEL:-codellama}"
echo "  - Password: ${PASSWORD:-developer}"
echo ""
echo "Services starting..."
echo "=========================================="

# Function to log with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Start Ollama service in background
log "Starting Ollama service..."
ollama serve > /tmp/ollama.log 2>&1 &
OLLAMA_PID=$!
log "Ollama started (PID: $OLLAMA_PID)"

# Wait for Ollama to be ready
sleep 3

# Pull default model if using Ollama
if [ "${DEFAULT_PROVIDER:-ollama}" = "ollama" ]; then
    log "Pulling Ollama model: ${DEFAULT_MODEL:-codellama}"
    ollama pull ${DEFAULT_MODEL:-codellama} > /tmp/ollama-pull.log 2>&1 &
fi

# Start AI Router service in background
log "Starting AI Router on port 3000..."
cd /home/developer/ai-router
node server.js > /tmp/ai-router.log 2>&1 &
AI_ROUTER_PID=$!
log "AI Router started (PID: $AI_ROUTER_PID)"

# Start Vite preview app in background
log "Starting Live Preview on port 5173..."
cd /home/developer/preview-app
npm run dev > /tmp/preview.log 2>&1 &
PREVIEW_PID=$!
log "Preview started (PID: $PREVIEW_PID)"

# Update code-server config with PASSWORD environment variable
sed -i "s/\${PASSWORD}/${PASSWORD:-developer}/g" /home/developer/.config/code-server/config.yaml

# Start code-server in foreground
log "Starting code-server on port 8080..."
log "Default password: ${PASSWORD:-developer}"
log "=========================================="
log ""
log "Access your AI Development Studio:"
log "  - IDE:          http://localhost:8080"
log "  - AI Router:    http://localhost:3000"
log "  - Live Preview: http://localhost:5173"
log ""
log "=========================================="

# Change to workspace directory
cd /workspace

# Start code-server (this runs in foreground)
exec code-server --bind-addr 0.0.0.0:8080 /workspace
