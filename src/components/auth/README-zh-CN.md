# 认证组件

该模块提供了一套用于处理 NoStudy.ai 用户认证的组件。这些组件设计用于与 Better Auth 配合使用，并支持国际化。

## 组件

### SignInForm

用户登录表单组件。

**属性：**

- `locale`：当前语言区域（例如，'en'，'zh'）
- `callbackUrl`：登录成功后重定向的 URL
- `labels`：包含表单翻译标签的对象

**功能：**

- 电子邮件和密码认证
- 表单验证
- 错误处理
- 记住登录选项
- 链接到注册和密码重置页面

### SignUpForm

用户注册表单组件。

**属性：**

- `locale`：当前语言区域（例如，'en'，'zh'）
- `callbackUrl`：注册成功后重定向的 URL
- `labels`：包含表单翻译标签的对象

**功能：**

- 使用姓名、电子邮件和密码进行用户注册
- 密码确认
- 具有复杂密码要求的表单验证
- 成功消息和重定向
- 链接到登录页面

### PasswordResetForm

处理密码重置请求和密码更改的组件。

**属性：**

- `locale`：当前语言区域（例如，'en'，'zh'）
- `labels`：包含表单翻译标签的对象

**功能：**

- 通过电子邮件请求密码重置
- 使用令牌重置密码
- 表单验证
- 成功消息和反馈
- 返回登录页面链接

### VerifyEmailForm

电子邮件验证组件。

**属性：**

- `locale`：当前语言区域（例如，'en'，'zh'）
- `labels`：包含表单翻译标签的对象

**功能：**

- 使用 URL 中的令牌进行电子邮件验证
- 重新发送验证邮件
- 加载状态
- 成功和错误消息
- 导航回登录页面

## 使用方法

```tsx
// SignInForm 的示例用法
import { SignInForm } from '@/components/auth/SignInForm'

export default function LoginPage({ locale, translations }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignInForm
        locale={locale}
        callbackUrl="/dashboard"
        labels={translations}
      />
    </div>
  )
}
```

## API 集成

这些组件与以下 API 端点配合使用：

- `/api/auth/signin` - 用户登录
- `/api/auth/signup` - 用户注册
- `/api/auth/reset-password` - 请求密码重置
- `/api/auth/reset-password/reset` - 使用令牌确认密码重置
- `/api/auth/verify-email` - 使用令牌验证电子邮件
- `/api/auth/verify-email/resend` - 重新发送验证邮件
- `/api/auth/signout` - 用户登出

## 样式

这些组件使用 Shadcn UI 和 MagicUI 进行样式设计，使用 Tailwind CSS 进行布局和设计。

## 测试

### 概述

每个认证组件和API路由在被视为完成之前必须经过全面测试。这确保我们提供的认证系统能够在各种场景下正确运行。

### 测试工具

认证系统使用以下测试工具：

- **Vitest**：用于组件和API路由的单元测试
- **React Testing Library**：用于测试UI组件
- **Supertest**：用于API测试
- **MSW (Mock Service Worker)**：用于模拟API响应
- **Playwright**：用于端到端测试

### 测试状态

已实现以下测试：

#### 组件测试

- `SignInForm.test.tsx`：测试渲染、验证和表单提交行为
  - 位置：`src/__tests__/components/auth/SignInForm.test.tsx`

#### API测试

- `signin.test.ts`：测试登录API成功/失败场景
  - 位置：`src/__tests__/api/auth/signin.test.ts`
- `signup.test.ts`：测试注册API成功/失败场景
  - 位置：`src/__tests__/api/auth/signup.test.ts`

#### 端到端测试

- `auth.spec.ts`：测试完整用户流程，包括注册、登录、密码重置和电子邮件验证
  - 位置：`src/__tests__/e2e/auth.spec.ts`

#### 配置文件

- `playwright.config.ts`：Playwright端到端测试配置

### 测试执行计划

1. **单元测试**：运行`pnpm test`执行所有单元测试（组件和API测试）
2. **端到端测试**：运行`pnpm test:e2e`执行Playwright测试
3. **CI集成**：所有测试已集成到CI管道中，并在每次提交时自动运行

### 测试完成标准

- 所有组件必须有相应的单元测试
- 所有API路由必须有相应的API测试
- 关键用户流程必须有端到端测试覆盖
- 所有测试必须通过，且代码覆盖率至少达到80%

任何模块在所有测试成功通过之前都不能被视为完成。
