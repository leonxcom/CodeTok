/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')(
  // 显式指定i18n配置文件路径
  './i18n/request.ts'
);

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig);
