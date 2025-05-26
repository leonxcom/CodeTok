# Vercel 部署指南

## 前置要求
- 已有 Vercel 账号
- 项目已推送到 GitHub
- Neon 数据库已创建

## 部署步骤

### 1. 导入项目到 Vercel
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库

### 2. 配置环境变量
在 Vercel 项目设置中，进入 "Settings" → "Environment Variables"，添加以下变量：

#### 必需的环境变量：

```bash
# 数据库连接（使用你的 Neon 数据库连接字符串）
DATABASE_URL="postgresql://your_database_connection_string"
POSTGRES_URL="postgresql://your_database_connection_string"

# 应用配置
NEXT_PUBLIC_BASE_URL="https://你的项目名.vercel.app"
BETTER_AUTH_SECRET="使用命令生成: openssl rand -base64 32"

# AI API Keys
DEEPSEEK_API_KEY="your_deepseek_api_key_here"
OPENROUTER_API_KEY="your_openrouter_api_key_here"

# AI 配置
NEXT_PUBLIC_DEFAULT_AI_MODEL="deepseek/deepseek-chat"
RATE_LIMIT_MAX_REQUESTS="10"
RATE_LIMIT_WINDOW="60000"
```

#### 可选的环境变量：
```bash
# OAuth 登录（如需要）
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# 邮件服务（如需要）
RESEND_API_KEY=""

# 分析工具（如需要）
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=""
```

### 3. 部署项目
1. 配置完环境变量后，点击 "Deploy"
2. 等待部署完成（首次部署可能需要3-5分钟）

### 4. 诊断数据库连接
部署完成后，使用以下API诊断数据库状态：

```bash
# 检查数据库连接和环境变量
https://你的域名.vercel.app/api/db-status
```

这个API会返回：
- 环境变量配置状态
- 数据库连接状态
- 项目数量
- 示例项目数据

### 5. 初始化示例数据
如果数据库为空，使用以下API添加示例项目：

```bash
# 添加5个示例项目
https://你的域名.vercel.app/api/seed-projects
```

注意：如果数据库中已有项目，此API会跳过添加。

### 6. 手动添加项目数据（可选）
如果自动种子数据失败，可以在 Neon 控制台直接执行 SQL：

```sql
INSERT INTO projects (id, title, description, external_url, external_author, external_embed, type, is_public, views, created_at, updated_at)
VALUES 
  ('demo-react-1', 'React Todo App', '一个简单的待办事项应用', 'https://codesandbox.io/s/react-hooks-todo-app-nv9w4', 'CodeTok Demo', true, 'external', true, 100, NOW(), NOW()),
  ('demo-vue-2', 'Vue Weather App', '实时天气查询应用', 'https://codepen.io/cameron-developer/pen/zYKjjqo', 'CodeTok Demo', true, 'external', true, 80, NOW(), NOW()),
  ('demo-js-3', 'JavaScript Calculator', '功能完整的计算器应用', 'https://stackblitz.com/edit/js-calculator-demo', 'CodeTok Demo', true, 'external', true, 120, NOW(), NOW());
```

## 常见问题解决

### 1. 页面显示但没有项目数据

**原因**：`@vercel/postgres` 包需要通过环境变量读取数据库连接。

**解决方案**：
1. 确保在 Vercel 中设置了 `POSTGRES_URL` 环境变量
2. 访问 `/api/db-status` 检查连接状态
3. 如果连接成功但无数据，访问 `/api/seed-projects` 添加示例数据

### 2. 数据库连接失败

**检查步骤**：
1. 确认 Neon 数据库正在运行
2. 检查连接字符串格式是否正确
3. 确保使用了 pooler 连接（包含 `-pooler` 的URL）
4. 验证 `sslmode=require` 参数存在

### 3. 环境变量未生效

**解决方案**：
1. 在 Vercel Dashboard 中重新部署
2. 确保环境变量没有多余的空格或换行
3. 使用 `/api/db-status` 验证环境变量状态

### 4. AI 功能不工作
- 确保 AI API Keys 已正确配置
- 检查 API 配额是否充足
- 查看浏览器控制台是否有错误信息

### 5. 构建失败
- 确保 `pnpm-lock.yaml` 文件已提交
- 检查是否有类型错误
- 查看构建日志详细信息

## 验证部署

部署完成后，按以下顺序验证：

1. **检查数据库状态**：
   ```
   https://你的域名.vercel.app/api/db-status
   ```

2. **添加示例数据**（如需要）：
   ```
   https://你的域名.vercel.app/api/seed-projects
   ```

3. **访问主页**：
   ```
   https://你的域名.vercel.app
   ```

4. **测试 AI Super Mode**：
   点击顶部标签切换到 AI 模式，测试代码生成功能

## 监控和日志

1. **查看函数日志**：
   - Vercel Dashboard → Functions → 查看日志

2. **查看构建日志**：
   - Vercel Dashboard → Deployments → 查看详细日志

3. **性能监控**：
   - Vercel Dashboard → Analytics → 查看性能指标

## 重要提示

- 代码已优化，即使没有设置环境变量也会使用硬编码的连接字符串
- 建议在生产环境中使用环境变量而不是硬编码
- 定期检查 API 密钥的使用情况和配额 