import { Resend } from 'resend'

/**
 * Email service for NoStudy.ai
 *
 * Handles sending verification emails, password reset emails,
 * and other transactional emails.
 */

// Initialize Resend with API key
export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send a verification email to the user
 *
 * @param email - User's email address
 * @param token - Verification token
 * @param locale - User's locale (defaults to 'en')
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  locale = 'en',
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: 'NoStudy.ai <noreply@nostudy.ai>',
    to: email,
    subject:
      locale === 'zh-CN'
        ? '验证您的 NoStudy.ai 邮箱'
        : 'Verify your NoStudy.ai email',
    html:
      locale === 'zh-CN'
        ? `<p>请点击以下链接验证您的邮箱：<a href="${verificationUrl}">${verificationUrl}</a></p>`
        : `<p>Please click the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  })
}

/**
 * Send a password reset email to the user
 *
 * @param email - User's email address
 * @param token - Reset token
 * @param locale - User's locale (defaults to 'en')
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  locale = 'en',
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: 'NoStudy.ai <noreply@nostudy.ai>',
    to: email,
    subject:
      locale === 'zh-CN'
        ? '重置您的 NoStudy.ai 密码'
        : 'Reset your NoStudy.ai password',
    html:
      locale === 'zh-CN'
        ? `<p>请点击以下链接重置您的密码：<a href="${resetUrl}">${resetUrl}</a></p>`
        : `<p>Please click the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  })
}
