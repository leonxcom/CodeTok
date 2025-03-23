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
