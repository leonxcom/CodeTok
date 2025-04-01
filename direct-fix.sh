#!/bin/bash

# 确保我们在preview分支上
git checkout preview

# 尝试一个新方法：创建一个干净的临时分支
git checkout -b temp-preview

# 找到包含这些特定提交的分支
echo "查找包含这些提交的分支..."
git branch -a --contains cb6a2e9
git branch -a --contains b924a44
git branch -a --contains e60ed8e

# 尝试直接修改这三个提交
echo "尝试创建新的提交来替换旧的提交..."

# 为每个提交创建一个包含正确消息的新提交
# 我们将使用cherry-pick并修改消息

# 创建一个新的临时分支作为基础
git checkout -b new-preview origin/preview~10

# 保存前10个提交Hash到临时文件
git log --format=%H -n 10 origin/preview > /tmp/commit-hashes

# 逐个检查并修改提交
while read -r commit_hash; do
  if [ "$commit_hash" = "cb6a2e9586e085715dc7069b1aff77f8c7510fc2" ]; then
    git cherry-pick "$commit_hash" -n
    git commit --amend -m "update top navigation bar to night mode style"
  elif [ "$commit_hash" = "b924a44f4ee8e7e07f8f01a94866b6f34019a0bc" ]; then
    git cherry-pick "$commit_hash" -n
    git commit --amend -m "fix page style: keep main content area white background, only navigation bar uses night mode"
  elif [ "$commit_hash" = "e60ed8e666fea3ba1a7c9b056220028323293384" ]; then
    git cherry-pick "$commit_hash" -n
    git commit --amend -m "change left-right switching to TikTok-style top-bottom switching"
  else
    git cherry-pick "$commit_hash"
  fi
done < <(tac /tmp/commit-hashes)

# 清理临时文件
rm -f /tmp/commit-hashes

echo "现在，我们可以检查new-preview分支上的提交历史..."
git log --oneline -n 10

echo "如果提交历史看起来正确，请运行以下命令来强制推送新的历史："
echo "git push -f origin new-preview:preview" 