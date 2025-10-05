#!/bin/bash
# Startup script for Development Studio

echo "=========================================="
echo "  Welcome to Development Studio!"
echo "=========================================="
echo ""
echo "Environment Information:"
echo "  - User: $(whoami)"
echo "  - Working Directory: $(pwd)"
echo "  - Node Version: $(node --version 2>/dev/null || echo 'Not installed')"
echo "  - Python Version: $(python3 --version 2>/dev/null || echo 'Not installed')"
echo "  - Git Version: $(git --version 2>/dev/null || echo 'Not installed')"
echo ""
echo "Starting code-server on port 8080..."
echo "Default password: developer"
echo ""
echo "=========================================="

# Start code-server
exec code-server --bind-addr 0.0.0.0:8080 /workspace
