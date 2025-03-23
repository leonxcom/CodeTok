#!/bin/bash

# 创建备份目录
mkdir -p .backups

# 查找所有引用了 React 相关类型但可能没有导入 React 的 TypeScript/TSX 文件
FILES=$(grep -l -e "React\." -e "JSX\." --include="*.tsx" --include="*.ts" src/components/magicui/)

echo "检查并修复文件中的 React/JSX 引用问题..."

for FILE in $FILES; do
  echo "检查文件: $FILE"
  
  # 创建文件备份
  cp "$FILE" ".backups/$(basename $FILE).bak"
  
  # 检查文件是否已经导入了 React
  if ! grep -q "import React" "$FILE"; then
    echo "  修复: 添加 React 导入"
    
    # 检查是否有其他导入语句
    if grep -q "^import " "$FILE"; then
      # 在第一个导入语句之后添加 React 导入
      sed -i '' '/^import / a\
import React from "react";
' "$FILE"
    else
      # 如果没有其他导入语句，在文件顶部添加 React 导入
      # 检查是否有 "use client" 指令
      if grep -q "\"use client\"" "$FILE"; then
        sed -i '' '/\"use client\";/ a\
\
import React from "react";
' "$FILE"
      else
        # 如果没有 "use client"，直接在文件顶部添加
        sed -i '' '1s/^/import React from "react";\n\n/' "$FILE"
      fi
    fi
  fi
  
  # 将 JSX.Element 替换为 React.ReactElement
  if grep -q "JSX\.Element" "$FILE"; then
    echo "  修复: 将 JSX.Element 替换为 React.ReactElement"
    sed -i '' 's/JSX\.Element/React.ReactElement/g' "$FILE"
  fi
  
  # 如果文件中有 ReactNode 但没有明确导入，检查是否已经导入了 React
  if grep -q "ReactNode" "$FILE" && ! grep -q "import.*ReactNode" "$FILE" && ! grep -q "import React" "$FILE"; then
    echo "  修复: 确保 ReactNode 可用"
    sed -i '' 's/import {/import React, {/' "$FILE"
  fi
done

echo "完成修复！现在尝试重新构建项目。" 