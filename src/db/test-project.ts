import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function testProject() {
  try {
    console.log('Testing database connection...');
    
    // 测试数据库连接
    const testConnection = await sql`SELECT NOW()`;
    console.log('Database connection successful');
    
    // 查询特定项目
    const projectId = 'CAbUiIo=';
    console.log(`Querying project with ID: ${projectId}`);
    
    // 检查项目是否存在
    const project = await sql`
      SELECT * FROM projects
      WHERE id = ${projectId}
    `;

    if (project.rows.length === 0) {
      console.log('项目不存在');
      
      // 查询所有项目数量
      const countResult = await sql`SELECT COUNT(*) FROM projects`;
      console.log(`Total projects in database: ${countResult.rows[0].count}`);
      
      // 获取项目列表
      const projects = await sql`
        SELECT id, title, created_at
        FROM projects
        ORDER BY created_at DESC
        LIMIT 5;
      `;
      console.log('Recent projects:', projects.rows);
    } else {
      console.log('Project found:', project.rows[0]);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// 运行测试
testProject(); 