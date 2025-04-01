#!/bin/bash

# 连接字符串设置
DEV_DB_URL="$NEON_DEV_DATABASE_URL"  # development 分支连接字符串
MAIN_DB_URL="$NEON_DATABASE_URL"   # main 分支连接字符串

# 创建临时目录
TEMP_DIR=$(mktemp -d)
DUMP_FILE="$TEMP_DIR/projects_dump.sql"

echo "开始备份 development 分支数据..."

# 使用 pg_dump 备份 development 分支的 projects 表
pg_dump --table=projects --data-only --column-inserts "$DEV_DB_URL" > "$DUMP_FILE"

echo "备份完成，开始导入数据到 main 分支..."

# 先清空 main 分支的 projects 表
psql "$MAIN_DB_URL" -c "DELETE FROM projects;"

# 使用 psql 将数据导入 main 分支
psql "$MAIN_DB_URL" < "$DUMP_FILE"

echo "数据导入完成，清理临时文件..."

# 清理临时文件
rm -rf "$TEMP_DIR"

echo "分支间数据同步完成!" 