#!/bin/bash

# 定义需要安装的组件数组
components=(
  "blur-fade"
  "text-animate"
  "line-shadow-text"
  "aurora-text"
)

# 遍历组件数组并安装每个组件
for component in "${components[@]}"; do
  echo "Installing $component..."
  pnpm dlx shadcn@latest add "https://magicui.design/r/$component" --yes --overwrite
  # 防止API限制，在每次安装之间等待1秒
  sleep 1
done

echo "All missing components installation completed!" 