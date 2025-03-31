// 添加缺失的列到项目表的迁移脚本
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function addMissingColumns() {
  try {
    console.log('开始添加缺失的列...');
    
    // 查询现有列
    const columnsResult = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'projects'
    `;
    
    const existingColumns = columnsResult.rows.map(row => row.column_name);
    console.log('现有列:', existingColumns);
    
    // 添加external_url列
    if (!existingColumns.includes('external_url')) {
      console.log('添加external_url列...');
      await sql`ALTER TABLE projects ADD COLUMN external_url TEXT`;
    }
    
    // 添加external_embed列
    if (!existingColumns.includes('external_embed')) {
      console.log('添加external_embed列...');
      await sql`ALTER TABLE projects ADD COLUMN external_embed BOOLEAN DEFAULT FALSE`;
    }
    
    // 添加external_author列
    if (!existingColumns.includes('external_author')) {
      console.log('添加external_author列...');
      await sql`ALTER TABLE projects ADD COLUMN external_author TEXT`;
    }
    
    // 添加type列
    if (!existingColumns.includes('type')) {
      console.log('添加type列...');
      await sql`ALTER TABLE projects ADD COLUMN type TEXT`;
    }
    
    console.log('列添加完成!');
    
    // 验证添加的列
    const verifyResult = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'projects'
    `;
    
    console.log('更新后的列:', verifyResult.rows.map(row => row.column_name));
  } catch (error) {
    console.error('添加列失败:', error);
  }
}

// 执行迁移
addMissingColumns(); 