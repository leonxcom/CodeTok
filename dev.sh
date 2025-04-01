#!/bin/bash

# 确保依赖已安装
if [ ! -d "node_modules" ]; then
  echo "安装项目依赖..."
  pnpm install
fi

# 启动开发服务器
echo "启动 VibeTok 开发服务器..."
pnpm dev 