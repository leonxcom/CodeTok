# 认证组件

该目录包含与用户认证相关的所有组件，用于处理登录、注册、密码重置和邮箱验证等功能。

## 组件列表

| 组件名称          | 描述             | 路径                    |
| ----------------- | ---------------- | ----------------------- |
| SignInForm        | 用户登录表单     | `SignInForm.tsx`        |
| SignUpForm        | 用户注册表单     | `SignUpForm.tsx`        |
| PasswordResetForm | 密码重置请求表单 | `PasswordResetForm.tsx` |
| VerifyEmailForm   | 邮箱验证处理组件 | `VerifyEmailForm.tsx`   |

## 使用方法

### 登录表单

```tsx
import { SignInForm } from '@/components/auth/SignInForm'

export default function LoginPage() {
  return (
    <div className="container">
      <SignInForm />
    </div>
  )
}
```

### 注册表单

```tsx
import { SignUpForm } from '@/components/auth/SignUpForm'

export default function RegisterPage() {
  return (
    <div className="container">
      <SignUpForm />
    </div>
  )
}
```

### 密码重置表单

```tsx
import { PasswordResetForm } from '@/components/auth/PasswordResetForm'

export default function ResetPasswordPage() {
  return (
    <div className="container">
      <PasswordResetForm />
    </div>
  )
}
```

### 邮箱验证组件

```tsx
import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm'

export default function VerifyEmailPage() {
  return (
    <div className="container">
      <VerifyEmailForm />
    </div>
  )
}
```

## 功能特性

- 全面的表单验证
- 响应式设计，适配移动端和桌面设备
- 支持中英文界面的国际化
- 加载状态管理
- 错误通知和成功消息
- 安全的认证流程
- CSRF保护机制
- 友好的错误处理

## 认证流程

1. **注册流程**:

   - 用户填写邮箱和密码
   - 创建账户
   - 发送验证邮件
   - 用户点击邮件中的验证链接
   - 验证后用户可以登录

2. **登录流程**:

   - 用户输入邮箱和密码
   - 验证凭据
   - 检查邮箱是否已验证
   - 创建会话
   - 重定向到应用主页

3. **密码重置**:
   - 用户请求重置密码
   - 重置链接发送到用户邮箱
   - 用户点击链接后设置新密码
   - 更新密码并重定向到登录页面

## 安全特性

- **CSRF保护**: 所有表单提交都包含CSRF令牌，防止跨站请求伪造攻击
- **错误处理**: 提供友好但不透露敏感信息的错误消息
- **密码安全**: 确保密码达到最低复杂度要求
- **状态管理**: 安全处理用户会话和认证状态

## 依赖

- Next.js App Router
- React Hook Form - 表单管理
- Zod - 表单验证
- Shadcn UI - UI组件
- Better Auth - 认证库

## 测试

所有认证组件都有相应的测试文件，确保功能正确和用户体验一致。测试文件位于`tests`目录下。

### 组件测试

- `SignInForm.test.tsx` - 测试登录表单的渲染、验证和提交功能
- `SignUpForm.test.tsx` - 测试注册表单的渲染、验证和提交功能
- `PasswordResetForm.test.tsx` - 测试密码重置表单的渲染、验证和提交功能
- `VerifyEmailForm.test.tsx` - 测试邮箱验证组件的各种状态和交互

### 端到端测试

端到端测试位于`__tests__/e2e/auth.spec.ts`，测试完整的认证流程，包括：

- 用户注册
- 用户登录
- 密码重置
- 邮箱验证
- 响应式设计测试

### 运行测试

```bash
# 运行组件测试
pnpm test

# 运行端到端测试
pnpm test:e2e
```

## 注意事项

- 所有表单组件都支持自定义样式和布局
- 请确保在环境变量中正确配置了邮件服务的凭据
- 组件内部使用了React Context来管理认证状态，请确保在适当的地方使用Provider
