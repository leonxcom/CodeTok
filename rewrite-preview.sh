#!/bin/bash

# 创建一个修改提交信息的脚本文件
cat > /tmp/messages-map << EOF
cb6a2e9586e085715dc7069b1aff77f8c7510fc2 update top navigation bar to night mode style
b924a44f4ee8e7e07f8f01a94866b6f34019a0bc fix page style: keep main content area white background, only navigation bar uses night mode
e60ed8e666fea3ba1a7c9b056220028323293384 change left-right switching to TikTok-style top-bottom switching
EOF

# 创建一个修改提交信息的脚本文件
cat > /tmp/fix-messages << EOF
#!/bin/bash

orig_commit_msg=\$(cat)
commit_hash=\$(git rev-parse HEAD)

# 从映射文件查找新消息
new_message=\$(grep "\$commit_hash" /tmp/messages-map | cut -d ' ' -f 2-)

if [ -n "\$new_message" ]; then
  echo "\$new_message"
else
  echo "\$orig_commit_msg"
fi
EOF

chmod +x /tmp/fix-messages

# 使用重写历史
echo "开始重写提交历史..."
git filter-branch -f --msg-filter '/tmp/fix-messages' origin/preview..HEAD

echo "提交历史已重写，请运行以下命令推送更改:"
echo "git push -f origin fixed-preview-commits:preview" 