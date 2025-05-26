# 本地 E2B 集成指南

## 📚 概述

本指南将帮助您在本地环境中设置和集成 E2B 服务。

## 🚀 快速开始

### 1. 环境要求
```bash
Node.js >= 16
Docker >= 20.10
内存 >= 8GB
磁盘空间 >= 20GB
```

### 2. 安装步骤

1) 克隆项目
```bash
git clone https://github.com/your-org/codetok.git
cd codetok
```

2) 安装依赖
```bash
pnpm install
```

3) 配置环境变量
```bash
cp env.example .env.local
```
编辑 `.env.local` 文件，设置以下变量：
```env
E2B_API_KEY=your_api_key
E2B_SANDBOX_ENABLED=true
E2B_TIMEOUT=30000
```

## 💻 本地开发

### 1. 启动本地沙箱

```typescript
import { LocalSandbox } from '@/lib/sandbox';

const sandbox = new LocalSandbox({
  rootDir: '/tmp/sandbox',
  memory: '512M',
  cpu: 1,
  timeout: 30000
});

await sandbox.initialize();
```

### 2. 代码执行示例

```typescript
// 执行代码
const result = await sandbox.execute(`
  console.log('Hello from sandbox!');
`);

// 处理结果
console.log(result.stdout); // 输出: Hello from sandbox!
```

### 3. 文件操作示例

```typescript
// 写入文件
await sandbox.fs.writeFile('test.txt', 'Hello World');

// 读取文件
const content = await sandbox.fs.readFile('test.txt');
```

## 🔧 配置说明

### 1. 沙箱配置

```typescript
interface SandboxConfig {
  rootDir: string;     // 沙箱根目录
  memory: string;      // 内存限制
  cpu: number;         // CPU 限制
  timeout: number;     // 执行超时时间
}
```

### 2. 安全配置

```typescript
const securityConfig = {
  allowedCommands: ['node', 'npm', 'pnpm'],
  networkAccess: false,
  maxProcesses: 5
};
```

## 🚨 错误处理

### 1. 常见错误

```typescript
try {
  await sandbox.execute(code);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('执行超时');
  } else if (error instanceof ResourceError) {
    console.error('资源不足');
  } else {
    console.error('未知错误:', error);
  }
}
```

### 2. 错误类型

- `TimeoutError`: 执行超时
- `ResourceError`: 资源不足
- `SecurityError`: 安全限制
- `RuntimeError`: 运行时错误

## 📈 性能优化

### 1. 沙箱池化

```typescript
const sandboxPool = new SandboxPool({
  minSize: 2,
  maxSize: 10,
  idleTimeout: 300000
});

const sandbox = await sandboxPool.acquire();
try {
  await sandbox.execute(code);
} finally {
  await sandboxPool.release(sandbox);
}
```

### 2. 资源限制

```typescript
const resourceLimits = {
  memory: '512M',
  cpu: 1,
  disk: '1G',
  network: {
    inbound: '1M',
    outbound: '1M'
  }
};
```

## 🔍 监控和调试

### 1. 性能监控

```typescript
const metrics = new SandboxMetrics();
metrics.on('execute', (stats) => {
  console.log('执行统计:', stats);
});
```

### 2. 日志收集

```typescript
const logger = new SandboxLogger({
  level: 'debug',
  file: '/var/log/sandbox.log'
});
```

## 🎯 最佳实践

1. 始终使用沙箱池管理资源
2. 设置合理的超时时间
3. 实现完善的错误处理
4. 定期清理沙箱资源
5. 监控系统资源使用

## 🚫 常见问题

1. Q: 沙箱启动失败
   A: 检查 Docker 服务状态和权限

2. Q: 执行超时
   A: 调整 timeout 配置或优化代码

3. Q: 内存溢出
   A: 增加内存限制或优化代码

4. Q: 网络访问受限
   A: 检查安全配置和防火墙设置

## 📚 参考资源

- [E2B 官方文档](https://docs.e2b.dev)
- [Docker 文档](https://docs.docker.com)
- [Node.js 文档](https://nodejs.org/docs)

## 🆘 获取帮助

如果遇到问题，可以：

1. 查看项目 Issues
2. 加入开发者社区
3. 联系技术支持

## 📝 更新日志

- 2024-12-23: 初始版本
- 2024-12-24: 添加性能优化指南
- 2024-12-25: 更新错误处理示例 