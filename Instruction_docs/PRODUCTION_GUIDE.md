# LocalLife 生产级开发与部署完整指南

本文档提供 LocalLife 项目从开发到生产部署的完整指导，包括检测清单、最佳实践、部署方案和运维指南。

---

## 📋 目录

1. [生产就绪性检测清单](#1-生产就绪性检测清单)
2. [开发环境配置](#2-开发环境配置)
3. [生产环境架构设计](#3-生产环境架构设计)
4. [数据库集成](#4-数据库集成)
5. [认证与授权](#5-认证与授权)
6. [安全加固](#6-安全加固)
7. [性能优化](#7-性能优化)
8. [监控与日志](#8-监控与日志)
9. [测试策略](#9-测试策略)
10. [CI/CD 配置](#10-cicd-配置)
11. [部署方案](#11-部署方案)
12. [运维指南](#12-运维指南)

---

## 1. 生产就绪性检测清单

### 1.1 基础设施 ✅/❌

- [ ] **数据库**: PostgreSQL + PostGIS 已配置
- [ ] **缓存**: Redis 已配置并运行
- [ ] **消息队列**: RabbitMQ/Kafka（可选，用于异步任务）
- [ ] **对象存储**: AWS S3/Cloudflare R2（用于图片存储）
- [ ] **CDN**: Cloudflare/AWS CloudFront（静态资源加速）

### 1.2 安全 ✅/❌

- [ ] **API Key 保护**: 所有敏感密钥存储在环境变量/密钥管理服务
- [ ] **HTTPS**: 生产环境强制使用 HTTPS
- [ ] **CORS**: 正确配置允许的来源
- [ ] **认证**: SIWE 认证已实现
- [ ] **授权**: 基于角色的访问控制（RBAC）
- [ ] **输入验证**: 所有 API 端点使用 Zod 验证
- [ ] **速率限制**: API 速率限制已配置
- [ ] **SQL 注入防护**: 使用参数化查询（Prisma）
- [ ] **XSS 防护**: 前端输入转义
- [ ] **CSRF 防护**: CSRF Token 验证

### 1.3 数据持久化 ✅/❌

- [ ] **数据库迁移**: Prisma 迁移脚本已配置
- [ ] **数据备份**: 自动备份策略已实施
- [ ] **数据恢复**: 恢复流程已测试
- [ ] **连接池**: 数据库连接池已配置
- [ ] **读写分离**: （可选）主从数据库配置

### 1.4 可观测性 ✅/❌

- [ ] **日志**: 结构化日志（Winston/Pino）
- [ ] **监控**: Prometheus + Grafana
- [ ] **告警**: 关键指标告警规则
- [ ] **追踪**: OpenTelemetry/Jaeger（分布式追踪）
- [ ] **健康检查**: `/health` 和 `/ready` 端点

### 1.5 性能 ✅/❌

- [ ] **缓存策略**: Redis 缓存热点数据
- [ ] **CDN**: 静态资源通过 CDN 分发
- [ ] **压缩**: Gzip/Brotli 压缩已启用
- [ ] **数据库索引**: 关键查询字段已建立索引
- [ ] **分页**: 所有列表接口支持分页
- [ ] **限流**: API 限流已配置

### 1.6 测试 ✅/❌

- [ ] **单元测试**: 覆盖率 > 80%
- [ ] **集成测试**: API 端点测试
- [ ] **E2E 测试**: 关键用户流程测试
- [ ] **负载测试**: 压力测试已执行
- [ ] **安全测试**: OWASP Top 10 检查

### 1.7 CI/CD ✅/❌

- [ ] **自动化测试**: PR 自动运行测试
- [ ] **代码质量**: ESLint/Prettier 检查
- [ ] **安全扫描**: 依赖漏洞扫描
- [ ] **自动化部署**: 部署流程已自动化
- [ ] **回滚机制**: 快速回滚流程

### 1.8 文档 ✅/❌

- [ ] **API 文档**: OpenAPI/Swagger 文档
- [ ] **部署文档**: 部署步骤已文档化
- [ ] **运维手册**: 故障排查指南
- [ ] **架构图**: 系统架构图已更新

---

## 2. 开发环境配置

### 2.1 开发工具链

```bash
# 推荐工具
- Node.js 20+ (LTS)
- pnpm (推荐) 或 npm
- Docker & Docker Compose
- VS Code + 推荐扩展
  - ESLint
  - Prettier
  - Prisma
  - TypeScript
```

### 2.2 本地开发环境

使用 Docker Compose 快速启动开发环境：

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_USER: locallife
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: locallife_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

启动命令：
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2.3 环境变量管理

**开发环境** (`.env.development`):
```env
# Backend
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://locallife:dev_password@localhost:5432/locallife_dev

# Redis
REDIS_URL=redis://localhost:6379

# Gemini API
GEMINI_API_KEY=your_dev_api_key

# JWT
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**生产环境** (使用密钥管理服务):
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Secret Manager

---

## 3. 生产环境架构设计

### 3.1 推荐架构

```
┌─────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                     │
│              (Static Assets + DDoS Protection)          │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Load Balancer (Nginx/ALB)                  │
└──────┬───────────────────────────────┬──────────────────┘
       │                               │
┌──────▼──────────┐          ┌─────────▼──────────┐
│  Frontend       │          │   Backend API      │
│  (Vercel/Netlify│          │  (Node.js Cluster) │
│   / S3+CF)      │          │                    │
└─────────────────┘          └──────┬──────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼────┐  ┌───────▼────┐  ┌───────▼────┐
            │ PostgreSQL │  │   Redis    │  │  S3/R2     │
            │  (RDS)     │  │ (ElastiCache│  │ (Storage)  │
            └────────────┘  └────────────┘  └────────────┘
```

### 3.2 高可用配置

- **前端**: CDN + 多区域部署
- **后端**: 多实例 + 负载均衡
- **数据库**: 主从复制 + 自动故障转移
- **缓存**: Redis 集群模式

### 3.3 扩展性考虑

- **水平扩展**: 无状态 API 服务，易于扩展
- **数据库分片**: （未来）按地理位置分片
- **缓存分层**: L1 (内存) + L2 (Redis) + L3 (数据库)

---

## 4. 数据库集成

### 4.1 Prisma 配置

```bash
# 安装 Prisma
cd server
npm install prisma @prisma/client
npx prisma init
```

**Prisma Schema** (`server/prisma/schema.prisma`):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  walletAddress String    @unique
  role          UserRole  @default(BUYER)
  reputation    Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  services      Service[]
  demands       Demand[]
  ordersAsBuyer Order[]   @relation("BuyerOrders")
  ordersAsSeller Order[]   @relation("SellerOrders")
}

model Service {
  id            String   @id @default(cuid())
  sellerId      String
  seller        User     @relation(fields: [sellerId], references: [id])
  title         String
  description   String
  category      String
  location      String
  price         Decimal  @db.Decimal(10, 2)
  unit          String
  tokenAddress  String?  @unique
  supply        Int?
  imageUrl      String?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  orders        Order[]
  
  @@index([category])
  @@index([location])
  @@index([sellerId])
}

model Demand {
  id          String   @id @default(cuid())
  buyerId     String
  buyer       User     @relation(fields: [buyerId], references: [id])
  title       String
  description String
  category    String
  location    String
  budget      Decimal  @db.Decimal(10, 2)
  expiry      DateTime?
  avatarUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category])
  @@index([location])
  @@index([buyerId])
}

model Order {
  id            String      @id @default(cuid())
  serviceId     String
  service       Service     @relation(fields: [serviceId], references: [id])
  buyerId       String
  buyer         User        @relation("BuyerOrders", fields: [buyerId], references: [id])
  sellerId      String
  seller        User        @relation("SellerOrders", fields: [sellerId], references: [id])
  amount        Decimal     @db.Decimal(10, 2)
  status        OrderStatus @default(CREATED)
  txHash        String?
  escrowAddress String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@index([buyerId])
  @@index([sellerId])
  @@index([status])
}

enum UserRole {
  BUYER
  SELLER
}

enum OrderStatus {
  CREATED
  MATCHED
  ACCEPTED
  PAID
  IN_SERVICE
  COMPLETED
  SETTLED
  REFUNDED
}
```

### 4.2 数据库迁移

```bash
# 创建迁移
npx prisma migrate dev --name init

# 生产环境迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

### 4.3 地理空间查询（PostGIS）

```sql
-- 启用 PostGIS 扩展
CREATE EXTENSION IF NOT EXISTS postgis;

-- 添加地理位置字段
ALTER TABLE services ADD COLUMN location_point geometry(Point, 4326);
CREATE INDEX location_point_idx ON services USING GIST (location_point);
```

### 4.4 连接池配置

```typescript
// server/src/config/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// 连接池配置（在 DATABASE_URL 中）
// postgresql://user:password@host:5432/db?connection_limit=10&pool_timeout=20
```

---

## 5. 认证与授权

### 5.1 SIWE 实现

```typescript
// server/src/services/authService.ts
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';

export interface SiweMessage {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
}

export class AuthService {
  async generateNonce(): Promise<string> {
    return crypto.randomBytes(16).toString('hex');
  }

  async verifySiwe(message: SiweMessage, signature: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(
        this.formatMessage(message),
        signature
      );
      return recoveredAddress.toLowerCase() === message.address.toLowerCase();
    } catch {
      return false;
    }
  }

  generateToken(address: string): string {
    return jwt.sign(
      { address, type: 'siwe' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  private formatMessage(message: SiweMessage): string {
    return `${message.domain} wants you to sign in with your Ethereum account:\n${message.address}\n\n${message.statement}\n\nURI: ${message.uri}\nVersion: ${message.version}\nChain ID: ${message.chainId}\nNonce: ${message.nonce}\nIssued At: ${message.issuedAt}`;
  }
}
```

### 5.2 JWT 中间件

```typescript
// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    address: string;
    type: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid token'
    });
  }
};
```

### 5.3 授权中间件

```typescript
// server/src/middleware/authorize.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }

    // 从数据库获取用户角色
    // const user = await prisma.user.findUnique({ where: { walletAddress: req.user.address } });
    // if (!roles.includes(user.role)) {
    //   return res.status(403).json({ ... });
    // }

    next();
  };
};
```

---

## 6. 安全加固

### 6.1 速率限制

```typescript
// server/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
});
```

### 6.2 安全头

```typescript
// server/src/middleware/security.ts
import helmet from 'helmet';

export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});
```

### 6.3 输入清理

```typescript
// server/src/middleware/sanitize.ts
import { z } from 'zod';

export const sanitizeInput = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};
```

---

## 7. 性能优化

### 7.1 Redis 缓存

```typescript
// server/src/services/cacheService.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const fresh = await fetcher();
    await this.set(key, fresh, ttl);
    return fresh;
  }
}
```

### 7.2 数据库查询优化

```typescript
// 使用 Prisma 查询优化
const services = await prisma.service.findMany({
  where: {
    category: 'Culinary',
    // 使用索引字段
  },
  take: 20, // 分页
  skip: 0,
  orderBy: {
    createdAt: 'desc',
  },
  select: {
    // 只选择需要的字段
    id: true,
    title: true,
    price: true,
    // ...
  },
});
```

### 7.3 CDN 配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name api.locallife.io;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 静态资源缓存
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 8. 监控与日志

### 8.1 结构化日志

```typescript
// server/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### 8.2 Prometheus 指标

```typescript
// server/src/middleware/metrics.ts
import client from 'prom-client';

const register = new client.Registry();

// 收集默认指标
client.collectDefaultMetrics({ register });

// 自定义指标
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
      },
      duration
    );
  });

  next();
};

// 指标端点
export const metricsRoute = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
```

### 8.3 健康检查

```typescript
// server/src/routes/health.ts
export const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

healthRouter.get('/ready', async (req, res) => {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;
    // 检查 Redis 连接
    await redis.ping();
    
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});
```

---

## 9. 测试策略

### 9.1 单元测试

```typescript
// server/src/services/__tests__/authService.test.ts
import { describe, it, expect } from 'vitest';
import { AuthService } from '../authService';

describe('AuthService', () => {
  it('should generate nonce', () => {
    const service = new AuthService();
    const nonce = service.generateNonce();
    expect(nonce).toHaveLength(32);
  });
});
```

### 9.2 集成测试

```typescript
// server/src/routes/__tests__/services.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

describe('POST /api/v1/services', () => {
  it('should create a service', async () => {
    const response = await request(app)
      .post('/api/v1/services')
      .send({
        title: 'Test Service',
        description: 'Test',
        category: 'Digital',
        location: 'Remote',
        price: 100,
        unit: 'USDC/hr',
        sellerId: '0x123',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### 9.3 E2E 测试

```typescript
// e2e/agent-flow.test.ts
import { test, expect } from '@playwright/test';

test('agent should create service from conversation', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // 打开聊天窗口
  await page.click('[aria-label="Toggle AI Agent"]');
  
  // 发送消息
  await page.fill('input[type="text"]', 'I want to offer Thai cooking classes');
  await page.press('input[type="text"]', 'Enter');
  
  // 等待响应
  await page.waitForSelector('.message-assistant', { timeout: 10000 });
  
  // 验证服务已创建
  await expect(page.locator('.service-card')).toContainText('Thai cooking');
});
```

---

## 10. CI/CD 配置

### 10.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379
      
      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # 部署脚本
          echo "Deploying to production..."
```

### 10.2 Docker 镜像构建

```dockerfile
# server/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

---

## 11. 部署方案

### 11.1 Vercel/Netlify (前端)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

**配置** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "https://api.locallife.io"
  }
}
```

### 11.2 Railway/Render (后端)

**Railway**:
1. 连接 GitHub 仓库
2. 设置环境变量
3. 自动部署

**Render**:
```yaml
# render.yaml
services:
  - type: web
    name: locallife-api
    env: node
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: locallife-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          name: locallife-redis
          type: redis
          property: connectionString
```

### 11.3 AWS ECS/Fargate

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
```

### 11.4 Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: locallife-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: locallife-api
  template:
    metadata:
      labels:
        app: locallife-api
    spec:
      containers:
      - name: api
        image: locallife/api:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: locallife-secrets
              key: database-url
```

---

## 12. 运维指南

### 12.1 数据库备份

```bash
# 每日备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://locallife-backups/
```

### 12.2 日志轮转

```yaml
# logrotate.conf
/var/log/locallife/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 app app
}
```

### 12.3 故障排查

**常见问题**:

1. **数据库连接失败**
   - 检查连接池配置
   - 检查网络连接
   - 查看数据库日志

2. **Redis 连接超时**
   - 检查 Redis 服务状态
   - 检查网络延迟
   - 增加连接超时时间

3. **API 响应慢**
   - 检查数据库查询性能
   - 检查缓存命中率
   - 检查外部 API 调用

### 12.4 性能调优

```typescript
// 数据库连接池调优
DATABASE_URL=postgresql://...?connection_limit=20&pool_timeout=20

// Node.js 性能
NODE_OPTIONS=--max-old-space-size=4096
```

---

## 📚 附录

### A. 环境变量清单

**必需**:
- `DATABASE_URL`
- `REDIS_URL`
- `GEMINI_API_KEY`
- `JWT_SECRET`

**可选**:
- `LOG_LEVEL`
- `CORS_ORIGIN`
- `PORT`

### B. 监控指标

- API 响应时间
- 错误率
- 数据库连接数
- Redis 内存使用
- 请求 QPS

### C. 告警规则

- 错误率 > 5%
- 响应时间 > 1s
- 数据库连接数 > 80%
- 内存使用 > 90%

---

*最后更新: 2026年*  
*文档版本: 1.0*
