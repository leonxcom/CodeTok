import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加跨域资源共享配置
  async headers() {
    return [
      {
        // 匹配所有静态资源路径
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // 在生产环境中应限制为您的域名
          },
        ],
      },
    ]
  },
  // 确保静态资源正确加载
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
}

export default withNextIntl(nextConfig)
