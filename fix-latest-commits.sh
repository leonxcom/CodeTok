#!/bin/bash

# 确保我们在preview分支上
git checkout preview

# 创建一个临时文件，列出需要修改的提交及其新消息
cat > /tmp/commit-messages << EOF
cb6a2e9586e085715dc7069b1aff77f8c7510fc2 update top navigation bar to night mode style
b924a44f4ee8e7e07f8f01a94866b6f34019a0bc fix page style: keep main content area white background, only navigation bar uses night mode
e60ed8e666fea3ba1a7c9b056220028323293384 change left-right switching to TikTok-style top-bottom switching
EOF

# 执行修改
git filter-branch -f --env-filter '
    commit_hash=$(git rev-parse $GIT_COMMIT)
    if [ "$commit_hash" = "cb6a2e9586e085715dc7069b1aff77f8c7510fc2" ]; then
        export GIT_COMMITTER_DATE="$(git show --format=%ai -s $GIT_COMMIT)"
        export GIT_AUTHOR_DATE="$(git show --format=%ai -s $GIT_COMMIT)"
        export GIT_COMMIT_MSG="update top navigation bar to night mode style"
        export GIT_MESSAGE="update top navigation bar to night mode style"
    elif [ "$commit_hash" = "b924a44f4ee8e7e07f8f01a94866b6f34019a0bc" ]; then
        export GIT_COMMITTER_DATE="$(git show --format=%ai -s $GIT_COMMIT)"
        export GIT_AUTHOR_DATE="$(git show --format=%ai -s $GIT_COMMIT)"
        export GIT_COMMIT_MSG="fix page style: keep main content area white background, only navigation bar uses night mode"
        export GIT_MESSAGE="fix page style: keep main content area white background, only navigation bar uses night mode"
    elif [ "$commit_hash" = "e60ed8e666fea3ba1a7c9b056220028323293384" ]; then
        export GIT_COMMITTER_DATE="$(git show --format=%ai -s $GIT_COMMIT)"
        export GIT_AUTHOR_DATE="$(git show --format=%ai -s $GIT_COMMIT)"
        export GIT_COMMIT_MSG="change left-right switching to TikTok-style top-bottom switching"
        export GIT_MESSAGE="change left-right switching to TikTok-style top-bottom switching"
    fi
' --msg-filter '
    commit_hash=$(git rev-parse HEAD)
    if [ "$commit_hash" = "cb6a2e9586e085715dc7069b1aff77f8c7510fc2" ]; then
        echo "update top navigation bar to night mode style"
    elif [ "$commit_hash" = "b924a44f4ee8e7e07f8f01a94866b6f34019a0bc" ]; then
        echo "fix page style: keep main content area white background, only navigation bar uses night mode"
    elif [ "$commit_hash" = "e60ed8e666fea3ba1a7c9b056220028323293384" ]; then
        echo "change left-right switching to TikTok-style top-bottom switching"
    else
        cat
    fi
' HEAD~10..HEAD

# 清理临时文件
rm -f /tmp/commit-messages

echo "提交信息已修改为英文。"
echo "请使用 'git push -f origin preview' 推送更改。" 