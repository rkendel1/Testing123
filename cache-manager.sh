#!/bin/bash

# AI Router Cache Management Script
# Provides easy commands to manage the AI Router cache

ROUTER_URL="${ROUTER_URL:-http://localhost:3000}"

function show_usage() {
    echo "AI Router Cache Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  stats      Show cache statistics"
    echo "  clear      Clear all cached responses"
    echo "  enable     Enable caching"
    echo "  disable    Disable caching"
    echo "  help       Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  ROUTER_URL  AI Router URL (default: http://localhost:3000)"
}

function show_stats() {
    echo "📊 Cache Statistics:"
    curl -s "${ROUTER_URL}/cache/stats" | python3 -m json.tool
}

function clear_cache() {
    echo "🗑️  Clearing cache..."
    curl -s -X POST "${ROUTER_URL}/cache/clear" | python3 -m json.tool
}

function enable_cache() {
    echo "✅ Enabling cache..."
    curl -s -X PUT "${ROUTER_URL}/cache/toggle" \
        -H "Content-Type: application/json" \
        -d '{"enabled": true}' | python3 -m json.tool
}

function disable_cache() {
    echo "❌ Disabling cache..."
    curl -s -X PUT "${ROUTER_URL}/cache/toggle" \
        -H "Content-Type: application/json" \
        -d '{"enabled": false}' | python3 -m json.tool
}

# Main script
case "${1:-help}" in
    stats)
        show_stats
        ;;
    clear)
        clear_cache
        ;;
    enable)
        enable_cache
        ;;
    disable)
        disable_cache
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
