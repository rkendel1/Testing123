#!/bin/bash
# Build and Test Script for AI Development Studio

set -e

echo "=========================================="
echo "  AI Development Studio - Build & Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Step 1: Validate JSON files
echo "Step 1: Validating JSON files..."
for f in $(find . -name "*.json" | grep -v node_modules); do
    if python3 -m json.tool "$f" > /dev/null 2>&1; then
        print_status "Valid: $f"
    else
        print_error "Invalid JSON: $f"
        exit 1
    fi
done
echo ""

# Step 2: Validate JavaScript files
echo "Step 2: Validating JavaScript files..."
if [ -f "ai-router/server.js" ]; then
    if node --check ai-router/server.js; then
        print_status "Valid: ai-router/server.js"
    else
        print_error "Syntax error in ai-router/server.js"
        exit 1
    fi
fi

if [ -f "extensions/ai-coder/src/extension.js" ]; then
    if node --check extensions/ai-coder/src/extension.js; then
        print_status "Valid: extensions/ai-coder/src/extension.js"
    else
        print_error "Syntax error in extensions/ai-coder/src/extension.js"
        exit 1
    fi
fi
echo ""

# Step 3: Check required files exist
echo "Step 3: Checking required files..."
required_files=(
    "Dockerfile"
    "docker-compose.yml"
    "start.sh"
    "ai-router/package.json"
    "ai-router/server.js"
    "extensions/ai-coder/package.json"
    "extensions/ai-coder/src/extension.js"
    "preview-app/package.json"
    "workspace/.aistudio/config.json"
    "config/code-server/settings.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found: $file"
    else
        print_error "Missing: $file"
        exit 1
    fi
done
echo ""

# Step 4: Check start.sh is executable
echo "Step 4: Checking start.sh permissions..."
if [ -x "start.sh" ]; then
    print_status "start.sh is executable"
else
    print_warning "start.sh is not executable, fixing..."
    chmod +x start.sh
    print_status "Fixed start.sh permissions"
fi
echo ""

# Step 5: Validate docker-compose.yml
echo "Step 5: Validating docker-compose.yml..."
if docker compose config > /dev/null 2>&1; then
    print_status "docker-compose.yml is valid"
else
    print_error "docker-compose.yml has errors"
    docker compose config
    exit 1
fi
echo ""

# Step 6: Build Docker image (optional - commented out to save time)
echo "Step 6: Docker build check..."
print_warning "Docker build skipped (would take 10-20 minutes)"
print_warning "To build, run: docker-compose build --no-cache"
echo ""

# Summary
echo "=========================================="
echo "  Validation Complete!"
echo "=========================================="
echo ""
echo "All checks passed! The AI Development Studio is ready."
echo ""
echo "To build and run:"
echo "  docker-compose up -d"
echo ""
echo "Or use the single command:"
echo "  docker build -t ai-studio . && docker run -p 8080:8080 -p 3000:3000 -p 5173:5173 -v \$(pwd)/workspace:/workspace ai-studio"
echo ""
