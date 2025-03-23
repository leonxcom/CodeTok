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

所有认证组件和 API 路由在被视为完成之前必须经过全面测试。测试过程应包括：

1. **组件测试**：

   - 验证表单验证是否正确工作
   - 测试无效输入的错误处理
   - 确保 UI 元素按预期显示/隐藏
   - 确认国际化功能对所有支持的语言有效

2. **API 测试**：

   - 使用有效和无效输入测试每个 API 端点
   - 验证正确的响应状态码和数据结构
   - 测试边缘情况的错误处理
   - 确认 API 安全性（防止未授权访问）

3. **集成测试**：

   - 测试从注册到登录的完整认证流程
   - 验证电子邮件验证流程端到端工作
   - 测试从请求到完成的密码重置流程
   - 确认成功操作后的重定向行为

4. **跨浏览器测试**：
   - 验证组件在不同浏览器中正确渲染
   - 在移动和桌面环境中测试功能

**注意**：测试是模块完成的必要步骤。在所有测试都已执行并成功通过之前，任何模块都不应被视为完成。
