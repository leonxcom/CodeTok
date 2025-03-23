# NoStudy.ai Library Modules

This directory contains core utility functions and modules used throughout the NoStudy.ai application.

## Modules

| Module Name  | Description                                | Path               |
| ------------ | ------------------------------------------ | ------------------ |
| auth         | Authentication configuration and utilities | `auth.ts`          |
| csrf         | CSRF protection utilities                  | `csrf.ts`          |
| email        | Email sending utilities                    | `email.ts`         |
| UserProvider | User authentication state provider         | `UserProvider.tsx` |
| ui           | UI component utilities and exports         | `ui.ts`            |
| utils        | General utility functions                  | `utils.ts`         |
| fonts        | Font configuration                         | `fonts.ts`         |

## Authentication System

The authentication system in NoStudy.ai is built on Better Auth, providing secure user authentication with email verification.

### Features

- Email and password authentication
- Session management
- Account verification
- CSRF protection
- Security best practices

### Usage

```tsx
// In server components
import { auth } from '@/lib/auth'

// Get the current session
const session = await auth.handler(new Request(''))

// Check if user is authenticated
if (session && 'user' in session) {
  // User is authenticated
}

// In client components
import { useUser } from '@/lib/UserProvider'

export function ProfileButton() {
  const { user, loading } = useUser()

  if (loading) return <LoadingSpinner />
  if (!user) return <SignInButton />

  return <UserMenu user={user} />
}
```

## CSRF Protection

The CSRF protection module provides utilities to prevent Cross-Site Request Forgery attacks.

### Features

- CSRF token generation and validation
- Secure cookie management
- Token expiration handling

### API

| Function                   | Description                                     | Parameters      | Return             |
| -------------------------- | ----------------------------------------------- | --------------- | ------------------ |
| `generateCsrfToken()`      | Generates a CSRF token and stores it in cookies | None            | `Promise<string>`  |
| `validateCsrfToken(token)` | Validates a CSRF token against the stored one   | `token: string` | `Promise<boolean>` |
| `removeCsrfToken()`        | Removes the CSRF token cookie                   | None            | `Promise<void>`    |

### Usage Example

```tsx
// In server component
import { generateCsrfToken } from '@/lib/csrf'

export default async function Page() {
  const csrfToken = await generateCsrfToken()

  return <MyForm csrfToken={csrfToken} />
}

// In API route
import { validateCsrfToken } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  const csrfToken = request.headers.get('X-CSRF-Token')

  if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }

  // Process the request...
}
```
