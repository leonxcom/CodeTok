#!/bin/bash

# 创建一个新的分支来应用更改
git checkout preview
git pull origin preview

# 使用 filter-branch 来重写所有提交信息
git filter-branch --force --msg-filter '
    # 准备替换规则
    sed -e "s/确保数据库连接在方流览器也稳定/ensure database connection stability in various browsers/g" \
        -e "s/修正页面导航，正确处理动态路由参数，优化新版本兼容性/fix page navigation, handle dynamic route parameters correctly, optimize for newer versions/g" \
        -e "s/来在右侧添加为CodeTok友情链接下了链接/add friendly links for CodeTok in the right sidebar/g" \
        -e "s/添加 fix-url API 端点修复错误的项目URL/add fix-url API endpoint to correct project URL/g" \
        -e "s/修复首页随机项目重定向逻辑，确保重定向到存在的项目/resolve homepage random project redirect logic to ensure redirection to existing projects/g" \
        -e "s/添加数据库设置脚本和项目数据/add database setup scripts and project data/g" \
        -e "s/添加外部项目支持，移除域名限制，优化项目管理功能/add external project support, remove domain restrictions, optimize project management/g" \
        -e "s/修改首页重定向逻辑，使其始终随机重定向到一个项目/modify homepage redirect logic to always randomly redirect to a project/g" \
        -e "s/重构数据库连接和项目API，使用直接SQL查询替代ORM/refactor database connection and project API, use direct SQL queries instead of ORM/g" \
        -e "s/在数据库迁移中添加示例项目/add example projects in database migration/g" \
        -e "s/重写项目详情API使用SQL直接查询/rewrite project details API using direct SQL queries/g" \
        -e "s/添加示例项目数据和所有项目API端点/add sample project data and all projects API endpoint/g" \
        -e "s/添加数据库环境分离功能/add database environment separation/g" \
        -e "s/确保迁移时清除所有数据/ensure clearing all data during migration/g" \
        -e "s/添加删除所有项目的 API 端点/add API endpoint to delete all projects/g" \
        -e "s/完全移除示例数据/completely remove sample data/g" \
        -e "s/移除示例数据/remove sample data/g" \
        -e "s/改进导入 API 的错误处理和日志记录/improve error handling and logging for import API/g" \
        -e "s/修改数据导入方式为 API 请求/change data import method to API requests/g" \
        -e "s/添加数据库导出导入功能/add database export and import functionality/g" \
        -e "s/修改数据库迁移脚本以先删除外键约束/modify database migration script to delete foreign key constraints first/g" \
        -e "s/修改数据库迁移脚本以先删除依赖表/modify database migration script to delete dependent tables first/g"
' HEAD~100..HEAD

# 强制推送到远程分支
echo "所有提交信息已修改为英文。"
echo "请运行 'git push -f origin preview' 来推送更改到远程仓库。" 