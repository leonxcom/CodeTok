import createNextIntlPlugin from 'next-intl/plugin'

// 指定i18n request配置文件的路径
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)
