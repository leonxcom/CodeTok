# Authentication Components

This directory contains all components related to user authentication, handling login, registration, password reset, and email verification functionalities.

## Component List

| Component Name    | Description                           | Path                    |
| ----------------- | ------------------------------------- | ----------------------- |
| SignInForm        | User login form                       | `SignInForm.tsx`        |
| SignUpForm        | User registration form                | `SignUpForm.tsx`        |
| PasswordResetForm | Password reset request form           | `PasswordResetForm.tsx` |
| VerifyEmailForm   | Email verification handling component | `VerifyEmailForm.tsx`   |

## Usage

### Login Form

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

### Registration Form

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

### Password Reset Form

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

### Email Verification Component

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

## Features

- Comprehensive form validation
- Responsive design, adapting to mobile and desktop devices
- Internationalization support for Chinese and English interfaces
- Loading state management
- Error notifications and success messages
- Secure authentication flow

## Authentication Flow

1. **Registration Process**:

   - User fills in email and password
   - Account is created
   - Verification email is sent
   - User clicks the verification link in the email
   - After verification, user can log in

2. **Login Process**:

   - User enters email and password
   - Credentials are verified
   - Session is created
   - Redirect to application homepage

3. **Password Reset**:
   - User requests password reset
   - Reset link is sent to user's email
   - User sets new password after clicking the link
   - Password is updated and redirected to login page

## Dependencies

- Next.js App Router
- React Hook Form - Form management
- Zod - Form validation
- Shadcn UI - UI components
- Next Auth - Authentication library

## Testing

All authentication components have corresponding test files to ensure functionality correctness and consistent user experience. Test files are located in the `tests` directory.

### Component Tests

- `SignInForm.test.tsx` - Tests the login form rendering, validation, and submission
- `SignUpForm.test.tsx` - Tests the registration form rendering, validation, and submission
- `PasswordResetForm.test.tsx` - Tests the password reset form rendering, validation, and submission
- `VerifyEmailForm.test.tsx` - Tests the email verification component various states and interactions

### End-to-End Tests

End-to-end tests are located in `__tests__/e2e/auth.spec.ts`, testing the complete authentication flow, including:

- User registration
- User login
- Password reset
- Email verification
- Responsive design testing

### Running Tests

```bash
# Run component tests
pnpm test

# Run end-to-end tests
pnpm test:e2e
```

## Notes

- All form components support custom styling and layout
- Ensure email service credentials are properly configured in environment variables
- Components use React Context internally to manage authentication state, make sure to use the Provider in appropriate places
