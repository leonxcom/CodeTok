#!/bin/bash

# 基础组件
components=(
  "marquee"
  "terminal"
  "hero-video-dialog"
  "bento-grid"
  "animated-list"
  "dock"
  "globe"
  "tweet-card"
  "orbiting-circles"
  "avatar-circles"
  "icon-cloud"
  "animated-circular-progress-bar"
  "file-tree"
  "code-comparison"
  "script-copy-btn"
  "scroll-progress"
  "lens"
  "pointer"
  
  # 设备模拟
  "safari"
  "iphone-15-pro"
  "android"
  
  # 特效组件
  "animated-beam"
  "border-beam"
  "shine-border"
  "magic-card"
  "meteors"
  "neon-gradient-card"
  "confetti"
  "particles"
  "cool-mode"
  "scratch-to-reveal"
  
  # 动画
  "blur"
  "fade"
  
  # 文字动画
  "text-animate"
  "line-shadow-text"
  "aurora-text"
  "number-ticker"
  "animated-shiny-text"
  "animated-gradient-text"
  "text-reveal"
  "hyper-text"
  "word-rotate"
  "typing-animation"
  "scroll-based-velocity"
  "flip-text"
  "box-reveal"
  "sparkles-text"
  "morphing-text"
  "spinning-text"
  
  # 按钮
  "rainbow-button"
  "shimmer-button"
  "shiny-button"
  "interactive-hover-button"
  "animated-subscribe-button"
  "pulsating-button"
  "ripple-button"
  
  # 背景
  "warp-background"
  "flickering-grid"
  "animated-grid-pattern"
  "retro-grid"
  "ripple"
  "dot-pattern"
  "grid-pattern"
  "interactive-grid-pattern"
)

# 遍历组件并安装
for component in "${components[@]}"; do
  echo "Installing $component..."
  pnpm dlx shadcn@latest add "https://magicui.design/r/$component" --yes --overwrite
  # 添加短暂延迟以避免可能的速率限制
  sleep 1
done

echo "All components installed successfully!" 