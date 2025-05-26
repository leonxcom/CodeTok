# MCP 服务生成指南

## 什么是 MCP？

**Model Context Protocol (MCP)** 是一个开放协议，用于标准化应用程序向LLM提供上下文的方式。就像USB-C为设备连接提供标准化接口一样，MCP为AI模型连接不同数据源和工具提供标准化方式。

## 🚀 快速开始

### 1. 在 CodeTok 中生成 MCP 服务

1. **访问 AI Super Mode**
2. **点击快速模板按钮**："⚡ 创建一个MCP服务"
3. **获得完整的 MCP 服务器代码**

### 2. 关键词触发

以下关键词会自动触发MCP服务生成：
- `MCP`
- `Model Context Protocol`
- `MCP服务`
- `MCP server`

## 📦 生成的 MCP 服务包含

### 🔧 工具处理器 (Tools)
- **时间获取工具**：支持 ISO、本地时间、Unix时间戳格式
- **计算器工具**：支持基本四则运算

### 📚 资源处理器 (Resources)
- **配置资源**：服务器配置和设置信息
- **健康状态资源**：服务器运行状态和系统信息

### 🛠 技术特性
- ✅ 完整的 TypeScript 类型支持
- ✅ 错误处理和验证
- ✅ 标准 MCP 协议实现
- ✅ 可直接与 Claude Desktop 集成
- ✅ 包含详细注释和文档

## 🔧 安装和运行

### 1. 安装依赖

```bash
npm install @modelcontextprotocol/sdk
npm install -D @types/node typescript
```

### 2. 配置 package.json

```json
{
  "name": "my-mcp-server",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 3. 编译和运行

```bash
# 编译 TypeScript
npx tsc index.ts

# 运行服务器
npm start
```

## 🔗 与 Claude Desktop 集成

### 1. 配置 Claude Desktop

在 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["path/to/your/index.js"]
    }
  }
}
```

### 2. 重启 Claude Desktop

配置完成后重启 Claude Desktop，你的 MCP 服务将自动可用。

## 🎯 使用示例

### 时间获取工具
```
用户: 现在几点了？
Claude: [使用MCP工具获取当前时间]
结果: Current time (iso): 2025-01-21T10:30:00.000Z
```

### 计算器工具
```
用户: 计算 123 + 456
Claude: [使用MCP计算器工具]
结果: 123 add 456 = 579
```

### 配置查询
```
用户: 显示服务器配置
Claude: [读取MCP配置资源]
结果: 显示完整的服务器配置信息
```

## 🚀 高级定制

### AI 深度生成

如果快速模板不满足需求，可以：

1. **点击 "AI深度生成"** 按钮
2. **详细描述需求**，比如：
   - "创建一个带有文件系统访问功能的MCP服务"
   - "开发一个连接数据库的MCP服务器"
   - "生成一个带有API调用功能的MCP服务"

### 自定义工具

生成的模板包含完整的工具添加示例，你可以：
- 添加新的工具处理器
- 扩展资源提供者
- 集成外部API
- 连接数据库

## 📋 MCP 生态系统

### 兼容的客户端
- **Claude Desktop** - Anthropic 的桌面应用
- **Custom Clients** - 使用 MCP SDK 构建的客户端
- **IDE Extensions** - 支持 MCP 的开发工具

### 官方资源
- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP SDK 仓库](https://github.com/modelcontextprotocol/typescript-sdk)
- [示例服务器](https://github.com/modelcontextprotocol/servers)

## 🔍 故障排除

### 常见问题

**Q: 服务器无法启动**
```bash
# 检查依赖安装
npm list @modelcontextprotocol/sdk

# 重新安装依赖
npm install
```

**Q: Claude Desktop 无法识别服务器**
- 检查配置文件路径
- 确保服务器编译成功
- 重启 Claude Desktop

**Q: 工具调用失败**
- 检查工具参数格式
- 查看服务器日志
- 验证输入数据类型

### 调试技巧

```typescript
// 添加调试日志
console.error('Debug: Tool called with args:', args);
console.error('Debug: Resource requested:', uri);
```

## 🎉 成功案例

通过 CodeTok 生成的 MCP 服务已被用于：
- 📊 数据分析工具集成
- 🔧 开发工具自动化
- 📁 文件系统管理
- 🌐 API 服务代理
- 📝 文档生成系统

---

**💡 提示**: MCP 是一个快速发展的生态系统。建议定期查看官方文档获取最新功能和最佳实践。 