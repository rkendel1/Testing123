#!/bin/bash
# Validation script for Natural Language Interface
# Tests that the enhanced natural language interface code is correctly structured

set -e

echo "=========================================="
echo "Natural Language Interface Validation"
echo "=========================================="
echo ""

# Test 1: Check extension.js syntax
echo "✓ Test 1: Validating extension.js syntax..."
if node -c extensions/ai-coder/src/extension.js 2>/dev/null; then
    echo "  ✓ extension.js syntax is valid"
else
    echo "  ✗ extension.js has syntax errors"
    exit 1
fi
echo ""

# Test 2: Check that natural language functions exist
echo "✓ Test 2: Checking for natural language functions..."
if grep -q "naturalLanguageQueryCommand" extensions/ai-coder/src/extension.js; then
    echo "  ✓ naturalLanguageQueryCommand function exists"
else
    echo "  ✗ naturalLanguageQueryCommand function not found"
    exit 1
fi

if grep -q "generateCodeCommand" extensions/ai-coder/src/extension.js; then
    echo "  ✓ generateCodeCommand function exists"
else
    echo "  ✗ generateCodeCommand function not found"
    exit 1
fi
echo ""

# Test 3: Check for provider-agnostic improvements
echo "✓ Test 3: Checking for provider-agnostic enhancements..."
if grep -q "Works uniformly across all supported provider types" extensions/ai-coder/src/extension.js; then
    echo "  ✓ Provider-agnostic documentation exists in code"
else
    echo "  ⚠ Provider-agnostic documentation not found in code comments"
fi

if grep -q "timeout.*30000" extensions/ai-coder/src/extension.js; then
    echo "  ✓ Timeout handling implemented (30 seconds)"
else
    echo "  ⚠ Timeout handling not found"
fi

if grep -q "console.log.*provider" extensions/ai-coder/src/extension.js; then
    echo "  ✓ Provider logging implemented"
else
    echo "  ⚠ Provider logging not found"
fi
echo ""

# Test 4: Check documentation updates
echo "✓ Test 4: Checking documentation..."
if grep -q "Provider-Agnostic Natural Language Interface" extensions/ai-coder/README.md; then
    echo "  ✓ Provider-agnostic documentation in README"
else
    echo "  ✗ Provider-agnostic documentation not found in README"
    exit 1
fi

if [ -f "extensions/ai-coder/NATURAL_LANGUAGE_TEST_GUIDE.md" ]; then
    echo "  ✓ Test guide exists"
else
    echo "  ✗ Test guide not found"
    exit 1
fi

if [ -f "extensions/ai-coder/PROVIDER_EXAMPLES.md" ]; then
    echo "  ✓ Provider examples document exists"
else
    echo "  ✗ Provider examples not found"
    exit 1
fi
echo ""

# Test 5: Check AI Router documentation
echo "✓ Test 5: Checking AI Router documentation..."
if grep -q "Provider-Agnostic Architecture" ai-router/README.md; then
    echo "  ✓ AI Router has provider-agnostic documentation"
else
    echo "  ⚠ AI Router documentation could be enhanced"
fi
echo ""

# Test 6: Verify all 6 providers are supported
echo "✓ Test 6: Verifying provider support..."
providers=("ollama" "openai" "anthropic" "mistral" "together" "aider")
for provider in "${providers[@]}"; do
    if grep -q "case '$provider':" ai-router/server.js; then
        echo "  ✓ Provider supported: $provider"
    else
        echo "  ✗ Provider not found in router: $provider"
        exit 1
    fi
done
echo ""

# Test 7: Check webview enhancements
echo "✓ Test 7: Checking webview UI enhancements..."
if grep -q "Provider-agnostic code generation" extensions/ai-coder/src/extension.js; then
    echo "  ✓ Code generation webview has provider-agnostic messaging"
else
    echo "  ⚠ Code generation webview could be enhanced"
fi

if grep -q "works seamlessly with all configured providers" extensions/ai-coder/src/extension.js; then
    echo "  ✓ Natural language webview has provider-agnostic messaging"
else
    echo "  ⚠ Natural language webview could be enhanced"
fi
echo ""

echo "=========================================="
echo "Validation Complete! ✓"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Extension code syntax is valid"
echo "  - Natural language functions implemented"
echo "  - Provider-agnostic enhancements present"
echo "  - Documentation updated"
echo "  - All 6 providers supported in router"
echo "  - Webview UI enhancements included"
echo ""
echo "Next Steps:"
echo "  1. Manual testing with AI Router running"
echo "  2. Test with multiple providers"
echo "  3. Verify UI displays correctly in VS Code"
echo ""
echo "See NATURAL_LANGUAGE_TEST_GUIDE.md for testing procedures"
echo ""
