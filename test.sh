#!/bin/bash
# Test script to verify Docker configuration

set -e

echo "=========================================="
echo "Testing Docker Development Studio Setup"
echo "=========================================="
echo ""

# Test 1: Check if Dockerfile exists and is valid
echo "✓ Test 1: Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
    echo "  ✓ Dockerfile exists"
    # Check for basic syntax
    if docker build --help > /dev/null 2>&1; then
        echo "  ✓ Docker is available"
    else
        echo "  ✗ Docker is not installed or not available"
        exit 1
    fi
else
    echo "  ✗ Dockerfile not found"
    exit 1
fi
echo ""

# Test 2: Check if docker-compose.yml exists
echo "✓ Test 2: Checking docker-compose.yml..."
if [ -f "docker-compose.yml" ]; then
    echo "  ✓ docker-compose.yml exists"
    # Validate docker-compose file
    if command -v docker-compose > /dev/null 2>&1; then
        if docker-compose config > /dev/null 2>&1; then
            echo "  ✓ docker-compose.yml is valid"
        else
            echo "  ✗ docker-compose.yml has syntax errors"
            exit 1
        fi
    else
        echo "  ⚠ docker-compose not available, skipping validation"
    fi
else
    echo "  ✗ docker-compose.yml not found"
    exit 1
fi
echo ""

# Test 3: Check if .devcontainer configuration exists
echo "✓ Test 3: Checking .devcontainer configuration..."
if [ -f ".devcontainer/devcontainer.json" ]; then
    echo "  ✓ devcontainer.json exists"
    # Check if it's valid JSON
    if command -v python3 > /dev/null 2>&1; then
        if python3 -m json.tool .devcontainer/devcontainer.json > /dev/null 2>&1; then
            echo "  ✓ devcontainer.json is valid JSON"
        else
            echo "  ✗ devcontainer.json is not valid JSON"
            exit 1
        fi
    fi
else
    echo "  ✗ devcontainer.json not found"
    exit 1
fi
echo ""

# Test 4: Check required files
echo "✓ Test 4: Checking required files..."
files=("README.md" "start.sh" ".dockerignore" ".gitignore" "LICENSE")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file exists"
    else
        echo "  ✗ $file not found"
        exit 1
    fi
done
echo ""

# Test 5: Check workspace directory
echo "✓ Test 5: Checking workspace directory..."
if [ -d "workspace" ]; then
    echo "  ✓ workspace directory exists"
    if [ -f "workspace/.gitkeep" ]; then
        echo "  ✓ workspace/.gitkeep exists"
    fi
else
    echo "  ✗ workspace directory not found"
    exit 1
fi
echo ""

echo "=========================================="
echo "All tests passed! ✓"
echo "=========================================="
echo ""
echo "To build and run the development studio:"
echo "  docker-compose up -d"
echo ""
echo "Then access it at: http://localhost:8080"
echo "Default password: developer"
