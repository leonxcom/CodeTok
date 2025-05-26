#!/bin/bash

# 旧的邮箱地址（需要替换）
OLD_EMAIL="leohuangdev@gmail.com"
# 新的邮箱地址（需要替换为您的GitHub验证邮箱）
NEW_EMAIL="leonx.contact@gmail.com"
# 新的作者名称（需要替换为您的GitHub用户名）
NEW_NAME="leonxcom"

# 导出重写规则
export OLD_EMAIL
export NEW_EMAIL
export NEW_NAME

# 重写所有分支的历史
git filter-branch -f --env-filter '
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$NEW_NAME"
    export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$NEW_NAME"
    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

echo "Git历史已更新。请检查更改，然后使用 'git push --force' 推送到远程仓库。"
echo "注意：强制推送可能会影响其他协作者，请确保在执行前通知他们。" 