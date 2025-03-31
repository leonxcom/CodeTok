import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    console.log('正在连接数据库...');
    
    // 1. 检查数据库连接
    const testConnection = await sql`SELECT version();`;
    console.log('数据库连接成功，PostgreSQL版本:', testConnection.rows[0].version);
    
    // 2. 列出所有表
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log('\n数据库中的表:');
    tables.rows.forEach((table: any) => {
      console.log(`- ${table.table_name}`);
    });
    
    // 3. 检查 projects 表结构
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects';
    `;
    console.log('\nprojects 表结构:');
    columns.rows.forEach((column: any) => {
      console.log(`- ${column.column_name}: ${column.data_type}`);
    });
    
    // 4. 统计项目数量
    const projectCount = await sql`
      SELECT COUNT(*) as count FROM projects;
    `;
    console.log('\n项目统计:');
    console.log(`总项目数: ${projectCount.rows[0].count}`);
    
    // 5. 列出所有项目
    const projects = await sql`
      SELECT id, title, created_at, is_public
      FROM projects
      ORDER BY created_at DESC
      LIMIT 5;
    `;
    console.log('\n项目列表:');
    projects.rows.forEach((project: any) => {
      console.log(`- ID: ${project.id}`);
      console.log(`  标题: ${project.title}`);
      console.log(`  创建时间: ${project.created_at}`);
      console.log(`  是否公开: ${project.is_public}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('数据库检查出错:', error);
  }
}

// 运行检查
checkDatabase(); 