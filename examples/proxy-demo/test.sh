#!/bin/bash

# egg-http-proxy-plus集成测试脚本
# 使用方法: ./test.sh

set -e

echo "🚀 开始集成测试..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:7001"

# 测试函数
test_request() {
    local name="$1"
    local method="$2"
    local path="$3"
    local data="$4"
    local headers="$5"

    echo -e "${BLUE}测试: ${name}${NC}"
    echo -e "请求: ${method} ${path}"

    if [ -n "$data" ]; then
        if [ -n "$headers" ]; then
            result=$(curl -s -X "$method" "${BASE_URL}${path}" -H "Content-Type: application/json" -H "$headers" -d "$data")
        else
            result=$(curl -s -X "$method" "${BASE_URL}${path}" -H "Content-Type: application/json" -d "$data")
        fi
    else
        if [ -n "$headers" ]; then
            result=$(curl -s -X "$method" "${BASE_URL}${path}" -H "$headers")
        else
            result=$(curl -s -X "$method" "${BASE_URL}${path}")
        fi
    fi

    echo -e "响应: ${result}"
    echo -e "${GREEN}✓ 完成${NC}"
    echo ""
}

# 等待服务启动
echo -e "${YELLOW}确保服务已启动:${NC}"
echo "1. 目标服务器: http://localhost:4000 (node target-server.js)"
echo "2. 代理服务器: http://localhost:7001 (cd proxy-server && npm start)"
echo ""
read -p "服务已启动? 按 Enter 继续..."
echo ""

# 开始测试
echo "========== 开始测试代理功能 ==========echo ""

# 1. 测试代理服务器首页
test_request "代理服务器首页" "GET" "/" ""

# 2. 测试用户列表代理
test_request "获取用户列表 (代理)" "GET" "/api/users" ""

# 3. 测试单个用户
test_request "获取单个用户 (代理)" "GET" "/api/users/1" ""

# 4. 测试创建用户 (POST)
test_request "创建用户 (POST代理)" "POST" "/api/users" '{"name":"TestUser","email":"test@example.com"}'

# 5. 测试请求头转发
test_request "请求头转发测试" "GET" "/api/headers" "" "X-Custom: custom-value"

# 6. 测试认证头添加
test_request "认证头测试" "GET" "/api/auth/headers" "" "Authorization: test-token"

# 7. 测试错误处理
test_request "错误处理测试" "GET" "/api/error" ""

# 8. 测试延迟响应
test_request "延迟响应测试 (2秒)" "GET" "/api/slow?delay=2000" ""

# 9. 测试健康检查
test_request "健康检查" "GET" "/health" ""

echo "========== 测试完成 ==========
echo ""
echo -e "${GREEN}所有测试执行完毕！${NC}"