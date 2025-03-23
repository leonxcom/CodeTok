# Authentication Components

This module provides a set of components for handling user authentication in NoStudy.ai. The components are designed to work with Better Auth and support internationalization.

## Components

### SignInForm

A form component for user login.

**Props:**

- `locale`: The current locale (e.g., 'en', 'zh')
- `callbackUrl`: URL to redirect after successful login
- `labels`: Object containing translated labels for the form

**Features:**

- Email and password authentication
- Form validation
- Error handling
- Remember me option
- Links to sign up and reset password

### SignUpForm

A form component for user registration.

**Props:**

- `locale`: The current locale (e.g., 'en', 'zh')
- `callbackUrl`: URL to redirect after successful registration
- `labels`: Object containing translated labels for the form

**Features:**

- User registration with name, email, and password
- Password confirmation
- Form validation with complex password requirements
- Success message and redirection
- Link to sign in page

### PasswordResetForm

A component for handling password reset requests and password changes.

**Props:**

- `locale`: The current locale (e.g., 'en', 'zh')
- `labels`: Object containing translated labels for the form

**Features:**

- Request password reset via email
- Reset password with token
- Form validation
- Success messages and feedback
- Back to login link

### VerifyEmailForm

A component for email verification.

**Props:**

- `locale`: The current locale (e.g., 'en', 'zh')
- `labels`: Object containing translated labels for the form

**Features:**

- Email verification using token from URL
- Resend verification email
- Loading states
- Success and error messages
- Navigation back to login

## Usage

```tsx
// Example usage of SignInForm
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

## API Integration

These components work with the following API endpoints:

- `/api/auth/signin` - User login
- `/api/auth/signup` - User registration
- `/api/auth/reset-password` - Request password reset
- `/api/auth/reset-password/reset` - Confirm password reset with token
- `/api/auth/verify-email` - Verify email with token
- `/api/auth/verify-email/resend` - Resend verification email
- `/api/auth/signout` - User logout

## Styling

The components use Shadcn UI and MagicUI for styling, with Tailwind CSS for layout and design.

## Testing

### Overview

Every authentication component and API route must undergo thorough testing before it can be considered complete. This ensures we deliver a reliable authentication system that operates correctly in various scenarios.

### Testing Tools

The authentication system uses the following testing tools:

- **Vitest**: For unit testing components and API routes
- **React Testing Library**: For testing UI components
- **Supertest**: For API testing
- **MSW (Mock Service Worker)**: For mocking API responses
- **Playwright**: For end-to-end testing

### Testing Status

The following tests have been implemented:

#### Component Tests

- `SignInForm.test.tsx`: Tests render, validation, and form submission behavior
  - Located at: `src/__tests__/components/auth/SignInForm.test.tsx`

#### API Tests

- `signin.test.ts`: Tests login API success/failure scenarios
  - Located at: `src/__tests__/api/auth/signin.test.ts`
- `signup.test.ts`: Tests registration API success/failure scenarios
  - Located at: `src/__tests__/api/auth/signup.test.ts`

#### End-to-End Tests

- `auth.spec.ts`: Tests full user flows including registration, login, password reset, and email verification
  - Located at: `src/__tests__/e2e/auth.spec.ts`

#### Configuration Files

- `playwright.config.ts`: Configuration for end-to-end testing with Playwright

### Testing Execution Plan

1. **Unit Tests**: Run `pnpm test` to execute all unit tests (component and API tests)
2. **End-to-End Tests**: Run `pnpm test:e2e` to execute Playwright tests
3. **CI Integration**: All tests are integrated into the CI pipeline and run automatically on each commit

### Testing Completion Criteria

- All components must have corresponding unit tests
- All API routes must have corresponding API tests
- Critical user flows must be covered by end-to-end tests
- All tests must pass with at least 80% code coverage

No module is considered complete until all tests are passed successfully.
