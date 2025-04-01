#!/bin/bash

# 创建一个修改提交信息的脚本文件
cat > /tmp/git-commit-changes << EOF
#!/bin/bash

case "\$GIT_COMMIT" in
  cb6a2e9586e085715dc7069b1aff77f8c7510fc2)
    echo "update top navigation bar to night mode style"
    ;;
  b924a44f4ee8e7e07f8f01a94866b6f34019a0bc)
    echo "fix page style: keep main content area white background, only navigation bar uses night mode"
    ;;
  e60ed8e666fea3ba1a7c9b056220028323293384)
    echo "change left-right switching to TikTok-style top-bottom switching"
    ;;
  *)
    cat
    ;;
esac
EOF

# 使脚本可执行
chmod +x /tmp/git-commit-changes

# 使用 filter-branch 来修改特定的提交消息，添加 -f 参数强制覆盖备份
git filter-branch -f --env-filter 'export GIT_COMMIT=$(git rev-parse $GIT_COMMIT)' --msg-filter 'bash /tmp/git-commit-changes' HEAD~100..HEAD

# 清理临时文件
rm -f /tmp/git-commit-changes

echo "提交信息已修改为英文。请使用 'git push -f origin preview' 推送更改。" 