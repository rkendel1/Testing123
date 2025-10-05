#!/bin/bash

# Test script to verify all templates are properly set up

echo "🧪 Testing Templates Implementation..."
echo ""

# Test 1: Check template directories exist
echo "✓ Checking template directories..."
for template in saas-starter ecommerce-starter analytics-starter; do
    if [ -d "workspace/templates/$template" ]; then
        echo "  ✓ $template directory exists"
    else
        echo "  ✗ $template directory missing"
        exit 1
    fi
done

# Test 2: Check package.json files exist
echo ""
echo "✓ Checking package.json files..."
for template in saas-starter ecommerce-starter analytics-starter; do
    if [ -f "workspace/templates/$template/package.json" ]; then
        echo "  ✓ $template/package.json exists"
    else
        echo "  ✗ $template/package.json missing"
        exit 1
    fi
done

# Test 3: Check README files exist
echo ""
echo "✓ Checking README files..."
for template in saas-starter ecommerce-starter analytics-starter; do
    if [ -f "workspace/templates/$template/README.md" ]; then
        echo "  ✓ $template/README.md exists"
    else
        echo "  ✗ $template/README.md missing"
        exit 1
    fi
done

# Test 4: Check .env.example files exist
echo ""
echo "✓ Checking .env.example files..."
for template in saas-starter ecommerce-starter analytics-starter; do
    if [ -f "workspace/templates/$template/.env.example" ]; then
        echo "  ✓ $template/.env.example exists"
    else
        echo "  ✗ $template/.env.example missing"
        exit 1
    fi
done

# Test 5: Check database migrations exist
echo ""
echo "✓ Checking database migrations..."
for template in saas-starter ecommerce-starter analytics-starter; do
    if [ -d "workspace/templates/$template/supabase/migrations" ] && \
       [ "$(ls -A workspace/templates/$template/supabase/migrations/*.sql 2>/dev/null)" ]; then
        echo "  ✓ $template has migrations"
    else
        echo "  ✗ $template migrations missing"
        exit 1
    fi
done

# Test 6: Check CLI tool exists
echo ""
echo "✓ Checking CLI tool..."
if [ -f "workspace/scripts/create-project.js" ]; then
    echo "  ✓ create-project.js exists"
else
    echo "  ✗ create-project.js missing"
    exit 1
fi

# Test 7: Check documentation exists
echo ""
echo "✓ Checking documentation..."
docs=(
    "workspace/TEMPLATES.md"
    "workspace/templates/README.md"
    "workspace/templates/QUICK_START.md"
    "workspace/templates/DEPLOYMENT.md"
    "workspace/templates/TROUBLESHOOTING.md"
)
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✓ $(basename $doc) exists"
    else
        echo "  ✗ $(basename $doc) missing"
        exit 1
    fi
done

# Test 8: Check SaaS starter specific files
echo ""
echo "✓ Checking SaaS starter implementation..."
saas_files=(
    "workspace/templates/saas-starter/app/layout.tsx"
    "workspace/templates/saas-starter/app/page.tsx"
    "workspace/templates/saas-starter/app/(auth)/login/page.tsx"
    "workspace/templates/saas-starter/app/(dashboard)/dashboard/page.tsx"
    "workspace/templates/saas-starter/lib/supabase/client.ts"
    "workspace/templates/saas-starter/lib/stripe/client.ts"
)
for file in "${saas_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $(basename $file) exists"
    else
        echo "  ✗ $(basename $file) missing"
        exit 1
    fi
done

# Summary
echo ""
echo "======================================"
echo "✅ All tests passed!"
echo "======================================"
echo ""
echo "Templates are ready to use:"
echo "  - SaaS Starter"
echo "  - E-commerce Starter"
echo "  - Analytics Starter"
echo ""
echo "To create a new project:"
echo "  cd workspace/scripts"
echo "  node create-project.js"
echo ""

