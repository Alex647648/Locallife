#!/bin/bash

# LocalLife 生产就绪性检测脚本
# 使用方法: ./scripts/check-production-ready.sh

set -e

echo "🔍 LocalLife 生产就绪性检测"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查计数器
PASSED=0
FAILED=0
WARNINGS=0

# 检查函数
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        ((FAILED++))
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# 1. 检查 Node.js 版本
echo "1. 检查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 20 ]; then
    check "Node.js 版本 >= 20 (当前: $(node -v))"
else
    warn "Node.js 版本 < 20 (当前: $(node -v))，建议升级"
fi

# 2. 检查依赖安装
echo ""
echo "2. 检查依赖..."
if [ -d "node_modules" ]; then
    check "前端依赖已安装"
else
    warn "前端依赖未安装，运行: npm install"
fi

if [ -d "server/node_modules" ]; then
    check "后端依赖已安装"
else
    warn "后端依赖未安装，运行: cd server && npm install"
fi

# 3. 检查环境变量文件
echo ""
echo "3. 检查环境变量配置..."
if [ -f ".env.example" ]; then
    check "前端 .env.example 存在"
else
    warn "前端 .env.example 不存在"
fi

if [ -f "server/.env.example" ]; then
    check "后端 .env.example 存在"
else
    warn "后端 .env.example 不存在"
fi

# 检查 .env 文件（但不要求存在，因为可能使用其他方式管理）
if [ -f ".env" ]; then
    warn "检测到 .env 文件，确保已添加到 .gitignore"
fi

if [ -f "server/.env" ]; then
    warn "检测到 server/.env 文件，确保已添加到 .gitignore"
fi

# 4. 检查 TypeScript 编译
echo ""
echo "4. 检查 TypeScript 编译..."
cd server
if npm run type-check > /dev/null 2>&1; then
    check "后端 TypeScript 类型检查通过"
else
    warn "后端 TypeScript 类型检查失败"
fi
cd ..

# 5. 检查测试
echo ""
echo "5. 检查测试配置..."
if [ -f "vitest.config.ts" ] || [ -f "vitest.config.js" ]; then
    check "测试配置文件存在"
else
    warn "测试配置文件不存在"
fi

# 6. 检查 Docker 配置
echo ""
echo "6. 检查 Docker 配置..."
if [ -f "docker-compose.yml" ] || [ -f "docker-compose.dev.yml" ]; then
    check "Docker Compose 配置文件存在"
else
    warn "Docker Compose 配置文件不存在（可选）"
fi

# 7. 检查 CI/CD 配置
echo ""
echo "7. 检查 CI/CD 配置..."
if [ -d ".github/workflows" ]; then
    check "GitHub Actions 配置存在"
else
    warn "GitHub Actions 配置不存在（可选）"
fi

# 8. 检查安全配置
echo ""
echo "8. 检查安全配置..."
if grep -q "GEMINI_API_KEY" server/src/services/geminiService.ts 2>/dev/null; then
    if grep -q "process.env.GEMINI_API_KEY" server/src/services/geminiService.ts; then
        check "API Key 使用环境变量（后端）"
    else
        warn "检查 API Key 是否硬编码"
    fi
else
    warn "无法检查 API Key 配置"
fi

# 9. 检查数据库配置
echo ""
echo "9. 检查数据库配置..."
if [ -d "server/prisma" ]; then
    check "Prisma 配置目录存在"
    if [ -f "server/prisma/schema.prisma" ]; then
        check "Prisma schema 文件存在"
    else
        warn "Prisma schema 文件不存在"
    fi
else
    warn "Prisma 配置目录不存在（需要数据库集成）"
fi

# 10. 检查文档
echo ""
echo "10. 检查文档..."
if [ -f "PRODUCTION_GUIDE.md" ]; then
    check "生产指南文档存在"
else
    warn "生产指南文档不存在"
fi

if [ -f "README.md" ]; then
    check "README 文档存在"
else
    warn "README 文档不存在"
fi

# 总结
echo ""
echo "================================"
echo "检测完成"
echo "================================"
echo -e "${GREEN}通过: $PASSED${NC}"
echo -e "${YELLOW}警告: $WARNINGS${NC}"
echo -e "${RED}失败: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 所有关键检查通过！${NC}"
    exit 0
else
    echo -e "${RED}❌ 发现 $FAILED 个问题，请修复后重试${NC}"
    exit 1
fi
