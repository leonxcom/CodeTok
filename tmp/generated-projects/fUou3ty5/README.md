# TypeScript - 创建一个MCP服务

一个完整的MCP (Model Context Protocol) 服务器

## 安装依赖

```bash
npm install
```

## 编译和运行

```bash
npm run build
npm start
```

## 与 Claude Desktop 集成

在 Claude Desktop 配置文件中添加：

```json
{
  "mcpServers": {
    "fUou3ty5": {
      "command": "node",
      "args": ["/Users/dev/Development/CodeTok/tmp/generated-projects/fUou3ty5/index.js"]
    }
  }
}
```
