import { betterAuth } from 'better-auth'
import { db } from '@/db'

/**
 * Better Auth configuration for NoStudy.ai
 *
 * This sets up the authentication system with:
 * - Email and password authentication
 * - Session management
 * - Support for account verification
 */
export const auth = betterAuth({
  // Connect to our existing database
  database: db,

  // Configure email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },

  // Configure JWT settings
  jwt: {
    secret:
      process.env.JWT_SECRET || 'development-secret-key-change-in-production',
  },

  // Configure cookie settings
  cookies: {
    cookieName: 'sessionToken',
    cookiePrefix: 'nostudy',
    sameSite: 'lax',
    useSecureCookies: process.env.NODE_ENV === 'production',
  },

  // Path prefix for auth routes (can be customized)
  basePath: '/api/auth',
})
