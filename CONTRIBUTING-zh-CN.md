# Nostudy.ai 贡献指南

简体中文 | [English](./CONTRIBUTING.md)

感谢您有兴趣为 Nostudy.ai 做出贡献！本文档提供了为项目做出贡献的指南和说明。

## 📋 目录

- [行为准则](#行为准则)
- [入门指南](#入门指南)
- [开发环境](#开发环境)
- [编码标准](#编码标准)
- [Git 工作流](#git-工作流)
- [拉取请求流程](#拉取请求流程)
- [问题报告](#问题报告)

## 行为准则

请阅读并遵守我们的[行为准则](./CODE_OF_CONDUCT.md)。我们期望所有贡献者在所有项目空间中都遵守此准则。

## 入门指南

1. 在 GitHub 上 Fork 仓库
2. 将您的 Fork 克隆到本地
   ```bash
   git clone https://github.com/YOUR-USERNAME/Nostudy.ai.git
   cd Nostudy.ai
   ```
3. 添加上游仓库作为远程源
   ```bash
   git remote add upstream https://github.com/Nostudy-ai/Nostudy.ai.git
   ```
4. 保持您的 Fork 与上游仓库同步
   ```bash
   git pull upstream dev
   ```

## 开发环境

### 前提条件
- Node.js (18.x 或更高版本)
- pnpm (8.x 或更高版本)
- Git

### 设置开发环境

1. 安装依赖
   ```bash
   pnpm install
   ```

2. 创建一个包含必要环境变量的 `.env.local` 文件 (如果有提供，请参见 `.env.example`)

3. 启动开发服务器
   ```bash
   pnpm dev
   ```

## 编码标准

我们保持高标准的代码质量，以确保代码库保持可维护性和一致性。

### TypeScript
- 为所有新代码使用 TypeScript
- 确保启用严格类型检查
- 尽可能避免使用 `any` 类型

### React
- 使用带有 hooks 的函数组件
- 遵循 React 最佳实践
- 使用 JSDoc 注释记录组件 props

### 样式
- 使用 Tailwind CSS 进行样式设计
- 遵循组件设计系统
- 确保响应式设计原则

### 代码检查和格式化
我们使用 ESLint 和 Prettier 来维护代码质量和风格一致性：
- 运行 `pnpm lint` 检查代码问题
- 运行 `pnpm format` 自动格式化代码

## Git 工作流

我们遵循基于分支的开发工作流：

1. 为每个功能或错误修复创建一个新分支
   ```bash
   git checkout -b feature/你的功能名称
   # 或
   git checkout -b fix/问题描述
   ```

2. 提交小而集中的更改
   ```bash
   git add .
   git commit -m "feat: 添加新功能" # 或 "fix:", "docs:" 等
   ```

3. 使用[约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)格式：
   - `feat:` 新功能
   - `fix:` 错误修复
   - `docs:` 文档更改
   - `style:` 格式更改
   - `refactor:` 代码重构
   - `test:` 添加或修改测试
   - `chore:` 维护任务

4. 将您的分支推送到您的 Fork
   ```bash
   git push origin feature/你的功能名称
   ```

## 拉取请求流程

1. 在提交 PR 前，使用 dev 分支的最新更改更新您的分支
   ```bash
   git checkout dev
   git pull upstream dev
   git checkout 你的分支名称
   git rebase dev
   ```

2. 对 `dev` 分支创建一个拉取请求（不是 `main`）

3. 确保您的 PR 包括：
   - 使用约定式提交格式的清晰、描述性标题
   - 更改的详细描述
   - 相关问题的引用
   - UI 更改的截图（如适用）

4. 处理代码审查反馈

5. 一旦获得批准，维护者将合并您的 PR

## 问题报告

如果您发现了 bug 或有功能请求：

1. 检查问题是否已经存在于[问题列表](https://github.com/Nostudy-ai/Nostudy.ai/issues)中
2. 如果不存在，使用适当的模板创建一个新问题
3. 提供详细信息：
   - 对于 bug：重现步骤、预期行为、实际行为、截图
   - 对于功能：清晰的描述、使用场景、潜在的实现想法

---

感谢您为 Nostudy.ai 做出贡献！您的帮助使这个项目对每个人都变得更好。 