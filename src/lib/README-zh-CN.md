# NoStudy.ai 工具库模块

本目录包含NoStudy.ai应用程序中使用的核心工具函数和模块。

## 模块列表

| 模块名称     | 说明               | 路径               |
| ------------ | ------------------ | ------------------ |
| auth         | 认证配置和工具     | `auth.ts`          |
| csrf         | CSRF保护工具       | `csrf.ts`          |
| email        | 邮件发送工具       | `email.ts`         |
| UserProvider | 用户认证状态提供者 | `UserProvider.tsx` |
| ui           | UI组件工具和导出   | `ui.ts`            |
| utils        | 通用工具函数       | `utils.ts`         |
| fonts        | 字体配置           | `fonts.ts`         |

## 认证系统

NoStudy.ai的认证系统基于Better Auth构建，提供带有邮箱验证的安全用户认证。

### 功能特点

- 邮箱和密码认证
- 会话管理
- 账户验证
- CSRF保护
- 安全最佳实践

### 使用方法

```tsx
// 在服务器组件中
import { auth } from '@/lib/auth'

// 获取当前会话
const session = await auth.handler(new Request(''))

// 检查用户是否已认证
if (session && 'user' in session) {
  // 用户已认证
}

// 在客户端组件中
import { useUser } from '@/lib/UserProvider'

export function ProfileButton() {
  const { user, loading } = useUser()

  if (loading) return <LoadingSpinner />
  if (!user) return <SignInButton />

  return <UserMenu user={user} />
}
```

## CSRF保护

CSRF保护模块提供工具来防止跨站请求伪造攻击。

### 功能特点

- CSRF令牌生成和验证
- 安全Cookie管理
- 令牌过期处理

### API接口

| 函数                       | 说明                             | 参数            | 返回值             |
| -------------------------- | -------------------------------- | --------------- | ------------------ |
| `generateCsrfToken()`      | 生成CSRF令牌并存储在Cookie中     | 无              | `Promise<string>`  |
| `validateCsrfToken(token)` | 验证CSRF令牌与存储的令牌是否匹配 | `token: string` | `Promise<boolean>` |
| `removeCsrfToken()`        | 移除CSRF令牌Cookie               | 无              | `Promise<void>`    |

### 使用示例

```tsx
// 在服务器组件中
import { generateCsrfToken } from '@/lib/csrf'

export default async function Page() {
  const csrfToken = await generateCsrfToken()

  return <MyForm csrfToken={csrfToken} />
}

// 在API路由中
import { validateCsrfToken } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  const csrfToken = request.headers.get('X-CSRF-Token')

  if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }

  // 处理请求...
}
```
