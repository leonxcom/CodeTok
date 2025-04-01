#!/bin/bash

# 创建一个修改提交信息的脚本文件
cat > /tmp/git-commit-changes << EOF
#!/bin/bash

commit_hash=\$(git log -1 --format=%H)

if [ "\$commit_hash" = "cb6a2e9586e085715dc7069b1aff77f8c7510fc2" ]; then
  echo "update top navigation bar to night mode style"
elif [ "\$commit_hash" = "b924a44f4ee8e7e07f8f01a94866b6f34019a0bc" ]; then
  echo "fix page style: keep main content area white background, only navigation bar uses night mode"
elif [ "\$commit_hash" = "e60ed8e666fea3ba1a7c9b056220028323293384" ]; then
  echo "change left-right switching to TikTok-style top-bottom switching"
else
  cat
fi
EOF

# 使脚本可执行
chmod +x /tmp/git-commit-changes

# 使用 filter-branch 来修改特定的提交消息
git filter-branch --force --msg-filter 'bash /tmp/git-commit-changes' e60ed8e^..cb6a2e9

# 清理临时文件
rm -f /tmp/git-commit-changes

echo "提交信息已修改为英文。请使用 'git push -f origin fix-ui-commit-messages' 推送更改。" 