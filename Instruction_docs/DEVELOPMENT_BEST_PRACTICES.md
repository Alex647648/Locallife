# LocalLife 开发最佳实践指南

本文档提供 LocalLife 项目的开发最佳实践，确保代码质量、可维护性和团队协作效率。

---

## 📋 目录

1. [代码规范](#1-代码规范)
2. [Git 工作流](#2-git-工作流)
3. [代码审查](#3-代码审查)
4. [测试策略](#4-测试策略)
5. [性能优化](#5-性能优化)
6. [安全实践](#6-安全实践)
7. [文档规范](#7-文档规范)
8. [调试技巧](#8-调试技巧)

---

## 1. 代码规范

### 1.1 TypeScript 规范

**✅ 推荐做法**:
```typescript
// 使用明确的类型，避免 any
interface Service {
  id: string;
  title: string;
  price: number;
}

// 使用类型推断
const services: Service[] = await getServices();

// 使用联合类型而非 any
type OrderStatus = 'CREATED' | 'PAID' | 'SETTLED';

// 使用可选链和空值合并
const price = service?.price ?? 0;
```

**❌ 避免**:
```typescript
// 避免使用 any
function processData(data: any) { ... }

// 避免类型断言（除非必要）
const service = data as Service;

// 避免忽略错误
catch (error) {
  // 不要忽略错误
}
```

### 1.2 命名规范

- **变量/函数**: `camelCase`
- **类/接口/类型**: `PascalCase`
- **常量**: `UPPER_SNAKE_CASE`
- **文件**: `kebab-case.ts` 或 `PascalCase.tsx`

```typescript
// ✅ 好的命名
const userService = new UserService();
const MAX_RETRY_COUNT = 3;
interface OrderStatus { ... }

// ❌ 不好的命名
const us = new UserService();
const maxRetry = 3;
interface orderStatus { ... }
```

### 1.3 函数设计

**单一职责原则**:
```typescript
// ✅ 好的设计
async function createService(data: CreateServiceDto): Promise<Service> {
  validateServiceData(data);
  const service = await saveService(data);
  await notifyServiceCreated(service);
  return service;
}

// ❌ 不好的设计
async function createService(data: any): Promise<any> {
  // 验证、保存、通知、日志、缓存... 全部混在一起
}
```

**函数长度**: 保持函数在 50 行以内，超过则拆分。

### 1.4 错误处理

```typescript
// ✅ 明确的错误处理
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new AppError('Operation failed', { cause: error });
}

// ❌ 忽略错误
try {
  await riskyOperation();
} catch {
  // 静默失败
}
```

---

## 2. Git 工作流

### 2.1 分支策略

```
main          # 生产环境
  ├── develop # 开发环境
  ├── feature/xxx
  ├── bugfix/xxx
  └── hotfix/xxx
```

### 2.2 Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: 添加用户认证功能
fix: 修复订单状态更新问题
docs: 更新 API 文档
style: 格式化代码
refactor: 重构服务层代码
test: 添加单元测试
chore: 更新依赖版本
```

**格式**: `<type>(<scope>): <subject>`

### 2.3 PR 模板

创建 `.github/pull_request_template.md`:

```markdown
## 变更描述
<!-- 描述本次 PR 的主要变更 -->

## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新
- [ ] 性能优化

## 测试
- [ ] 单元测试已添加/更新
- [ ] 集成测试已添加/更新
- [ ] 手动测试已完成

## 检查清单
- [ ] 代码已通过 ESLint 检查
- [ ] 代码已通过 TypeScript 类型检查
- [ ] 相关文档已更新
- [ ] 已添加/更新测试
```

---

## 3. 代码审查

### 3.1 审查清单

**功能**:
- [ ] 功能按需求实现
- [ ] 边界情况已处理
- [ ] 错误处理完善

**代码质量**:
- [ ] 代码可读性高
- [ ] 无重复代码
- [ ] 命名清晰
- [ ] 注释适当

**性能**:
- [ ] 无性能问题
- [ ] 数据库查询优化
- [ ] 缓存使用合理

**安全**:
- [ ] 输入验证完善
- [ ] 无敏感信息泄露
- [ ] 权限检查正确

### 3.2 审查原则

- **建设性反馈**: 提供具体改进建议
- **尊重他人**: 保持专业和礼貌
- **及时响应**: 24 小时内回复 PR

---

## 4. 测试策略

### 4.1 测试金字塔

```
        /\
       /  \      E2E Tests (少量)
      /____\
     /      \    Integration Tests (适量)
    /________\
   /          \  Unit Tests (大量)
  /____________\
```

### 4.2 单元测试

```typescript
// server/src/services/__tests__/authService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../authService';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('generateNonce', () => {
    it('should generate a unique nonce', () => {
      const nonce1 = authService.generateNonce();
      const nonce2 = authService.generateNonce();
      
      expect(nonce1).not.toBe(nonce2);
      expect(nonce1).toHaveLength(32);
    });
  });
});
```

### 4.3 集成测试

```typescript
// server/src/routes/__tests__/services.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { prisma } from '../../config/database';

describe('Services API Integration', () => {
  beforeAll(async () => {
    // 设置测试数据
  });

  afterAll(async () => {
    // 清理测试数据
    await prisma.service.deleteMany();
  });

  it('should create and retrieve a service', async () => {
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    
    const getResponse = await request(app)
      .get(`/api/v1/services/${createResponse.body.data.id}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.title).toBe('Test Service');
  });
});
```

### 4.4 测试覆盖率目标

- **单元测试**: > 80%
- **集成测试**: > 60%
- **E2E 测试**: 关键流程 100%

---

## 5. 性能优化

### 5.1 数据库查询优化

```typescript
// ✅ 好的查询
const services = await prisma.service.findMany({
  where: { category: 'Digital' },
  take: 20,
  skip: 0,
  select: {
    id: true,
    title: true,
    price: true,
    // 只选择需要的字段
  },
  orderBy: { createdAt: 'desc' },
});

// ❌ 不好的查询
const services = await prisma.service.findMany({
  where: { category: 'Digital' },
  // 没有分页
  // 选择了所有字段
});
```

### 5.2 缓存策略

```typescript
// ✅ 使用缓存
const getServices = async (category?: string) => {
  const cacheKey = `services:${category || 'all'}`;
  return cache.getOrSet(
    cacheKey,
    () => prisma.service.findMany({ where: { category } }),
    3600 // 1 小时
  );
};

// 更新时清除缓存
const createService = async (data: CreateServiceDto) => {
  const service = await prisma.service.create({ data });
  await cache.del('services:all');
  await cache.del(`services:${data.category}`);
  return service;
};
```

### 5.3 批量操作

```typescript
// ✅ 批量操作
await prisma.service.createMany({
  data: services,
});

// ❌ 循环插入
for (const service of services) {
  await prisma.service.create({ data: service });
}
```

---

## 6. 安全实践

### 6.1 输入验证

```typescript
// ✅ 使用 Zod 验证
import { z } from 'zod';

const createServiceSchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().positive(),
  category: z.enum(['Culinary', 'Wellness', 'Education', 'Tours', 'Digital']),
});

// 在路由中使用
router.post('/', async (req, res) => {
  const validated = createServiceSchema.parse(req.body);
  // ...
});
```

### 6.2 SQL 注入防护

```typescript
// ✅ 使用 Prisma（自动防护）
const service = await prisma.service.findUnique({
  where: { id: serviceId },
});

// ❌ 不要使用原始 SQL（除非必要）
const service = await prisma.$queryRaw`
  SELECT * FROM services WHERE id = ${serviceId}
`;
```

### 6.3 敏感信息处理

```typescript
// ✅ 使用环境变量
const apiKey = process.env.GEMINI_API_KEY;

// ❌ 不要硬编码
const apiKey = 'sk-1234567890';

// ✅ 日志中不记录敏感信息
logger.info('User logged in', { userId: user.id });
// ❌ 不要记录密码、token 等
```

---

## 7. 文档规范

### 7.1 代码注释

```typescript
/**
 * 创建新的服务资产
 * 
 * @param data - 服务数据
 * @returns 创建的服务对象
 * @throws {ValidationError} 当数据验证失败时
 * @throws {DatabaseError} 当数据库操作失败时
 */
async function createService(data: CreateServiceDto): Promise<Service> {
  // ...
}
```

### 7.2 API 文档

使用 OpenAPI/Swagger:

```typescript
/**
 * @swagger
 * /api/v1/services:
 *   post:
 *     summary: 创建新服务
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceDto'
 *     responses:
 *       201:
 *         description: 服务创建成功
 */
```

### 7.3 README 更新

- 新功能添加时更新 README
- 重大变更时更新 CHANGELOG
- API 变更时更新 API 文档

---

## 8. 调试技巧

### 8.1 日志记录

```typescript
// ✅ 结构化日志
logger.info('Service created', {
  serviceId: service.id,
  category: service.category,
  userId: user.id,
});

// ❌ 字符串拼接
console.log('Service created: ' + service.id);
```

### 8.2 调试工具

- **VS Code 调试**: 配置 `.vscode/launch.json`
- **Node.js Inspector**: `node --inspect`
- **React DevTools**: 浏览器扩展

### 8.3 错误追踪

```typescript
// 使用 Sentry 或其他错误追踪服务
import * as Sentry from '@sentry/node';

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { operation: 'riskyOperation' },
    extra: { context: '...' },
  });
  throw error;
}
```

---

## 📚 参考资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Prisma 最佳实践](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)
- [React 最佳实践](https://react.dev/learn)

---

*最后更新: 2026年*
