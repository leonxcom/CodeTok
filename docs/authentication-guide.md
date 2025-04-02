# Authentication Integration Guide

## English Version

### Better Auth Integration

We have integrated Better Auth authentication system into CodeTok, providing email/password login and social login support. This guide explains the implementation details and how to use these features.

#### Database Structure

Better Auth requires the following tables in the database:

- `users`: Stores user information
- `authentications`: Manages authentication methods
- `sessions`: Tracks user sessions
- `user_tokens`: Contains tokens associated with users
- `user_metadata`: Holds additional user metadata

We've created a script at `src/db/apply-better-auth-schema.js` to automatically set up these tables. This script resolves connection issues with the Better Auth CLI.

#### Core Authentication Setup

1. **Server Configuration**: 
   - `src/lib/auth.ts` contains the server-side component configuring Postgres connection and authentication options
   - `src/app/api/auth/[...all]/route.ts` handles all Better Auth API requests

2. **Client Interface**:
   - `src/lib/auth-client.ts` provides the client-side interface for login, registration, and logout functionality

#### UI Components and Pages

1. **Components**:
   - `AuthForm.tsx`: Form for email login and social login
   - `UserProfile.tsx`: Displays user account information

2. **Pages**:
   - `/[locale]/auth`: Authentication page with login/registration forms
   - `/[locale]/profile`: User profile page showing account details

#### Social Login Integration

We've added support for GitHub and Google OAuth login:

1. **Setup Requirements**:
   - Add OAuth credentials to `.env.local`:
     ```
     GITHUB_CLIENT_ID=your_github_client_id
     GITHUB_CLIENT_SECRET=your_github_client_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```
   - Configure callback URLs in social providers' developer settings:
     - GitHub: `http://localhost:3000/api/auth/callback/github` (development)
     - Google: `http://localhost:3000/api/auth/callback/google` (development)

2. **Usage**:
   - Social login buttons are available on the login and registration forms
   - Clicking these buttons initiates the OAuth flow

#### Testing Authentication

To test the authentication system:

1. Access the authentication page at `/[locale]/auth`
2. Try registering with email/password
3. Try logging in with registered credentials
4. Try social login (requires valid OAuth credentials)
5. After logging in, check the profile page at `/[locale]/profile`
6. Test the logout functionality

---

## 中文版本

### Better Auth 认证集成

我们已将 Better Auth 认证系统集成到 CodeTok 中，提供电子邮件/密码登录和社交登录支持。本指南说明了实现细节和如何使用这些功能。

#### 数据库结构

Better Auth 需要在数据库中创建以下表：

- `users`: 存储用户信息
- `authentications`: 管理认证方式
- `sessions`: 跟踪用户会话
- `user_tokens`: 包含与用户关联的令牌
- `user_metadata`: 保存额外的用户元数据

我们创建了脚本 `src/db/apply-better-auth-schema.js` 来自动设置这些表。该脚本解决了 Better Auth CLI 的连接问题。

#### 核心认证设置

1. **服务器配置**:
   - `src/lib/auth.ts` 包含服务器端组件，配置 Postgres 连接和认证选项
   - `src/app/api/auth/[...all]/route.ts` 处理所有 Better Auth API 请求

2. **客户端接口**:
   - `src/lib/auth-client.ts` 提供了登录、注册和登出功能的客户端接口

#### UI组件和页面

1. **组件**:
   - `AuthForm.tsx`: 电子邮件登录和社交登录表单
   - `UserProfile.tsx`: 显示用户账户信息

2. **页面**:
   - `/[locale]/auth`: 包含登录/注册表单的认证页面
   - `/[locale]/profile`: 显示账户详情的用户资料页面

#### 社交登录集成

我们添加了 GitHub 和 Google OAuth 登录支持：

1. **设置要求**:
   - 在 `.env.local` 中添加 OAuth 凭据：
     ```
     GITHUB_CLIENT_ID=你的github客户端ID
     GITHUB_CLIENT_SECRET=你的github客户端密钥
     GOOGLE_CLIENT_ID=你的google客户端ID
     GOOGLE_CLIENT_SECRET=你的google客户端密钥
     ```
   - 在社交提供商的开发者设置中配置回调 URL：
     - GitHub: `http://localhost:3000/api/auth/callback/github` (开发环境)
     - Google: `http://localhost:3000/api/auth/callback/google` (开发环境)

2. **使用方法**:
   - 社交登录按钮在登录和注册表单上可用
   - 点击这些按钮启动 OAuth 流程

#### 测试认证系统

要测试认证系统：

1. 访问认证页面 `/[locale]/auth`
2. 尝试使用电子邮件/密码注册
3. 尝试使用注册的凭据登录
4. 尝试社交登录（需要有效的 OAuth 凭据）
5. 登录后，查看个人资料页面 `/[locale]/profile`
6. 测试登出功能 