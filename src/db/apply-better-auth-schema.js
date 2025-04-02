// 应用Better Auth表结构到数据库
// 使用@vercel/postgres执行SQL

require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function applySchema() {
  try {
    console.log('开始应用Better Auth表结构...');
    
    // 读取SQL文件
    const schemaPath = path.join(__dirname, 'better-auth-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // 分割SQL语句
    const statements = schemaSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`将执行 ${statements.length} 条SQL语句`);
    
    // 逐个执行SQL语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`执行SQL语句 ${i + 1}/${statements.length}...`);
      console.log(statement);
      
      await sql.query(statement);
      
      console.log(`SQL语句 ${i + 1}/${statements.length} 执行成功`);
    }
    
    // 验证表是否创建成功
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
            table_name IN ('users', 'user_tokens', 'authentications', 'sessions', 'user_metadata')
    `;
    
    console.log('\n验证表创建结果:');
    
    const createdTables = tablesResult.rows.map(row => row.table_name);
    const requiredTables = ['users', 'user_tokens', 'authentications', 'sessions', 'user_metadata'];
    
    requiredTables.forEach(table => {
      if (createdTables.includes(table)) {
        console.log(`✓ 表 "${table}" 已成功创建`);
      } else {
        console.log(`✗ 表 "${table}" 创建失败`);
      }
    });
    
    console.log('\nBetter Auth表结构应用完成!');
  } catch (error) {
    console.error('应用Better Auth表结构时出错:', error);
    process.exit(1);
  }
}

// 执行脚本
applySchema(); 
// 使用@vercel/postgres执行SQL

require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function applySchema() {
  try {
    console.log('开始应用Better Auth表结构...');
    
    // 读取SQL文件
    const schemaPath = path.join(__dirname, 'better-auth-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // 分割SQL语句
    const statements = schemaSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`将执行 ${statements.length} 条SQL语句`);
    
    // 逐个执行SQL语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`执行SQL语句 ${i + 1}/${statements.length}...`);
      console.log(statement);
      
      await sql.query(statement);
      
      console.log(`SQL语句 ${i + 1}/${statements.length} 执行成功`);
    }
    
    // 验证表是否创建成功
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
            table_name IN ('users', 'user_tokens', 'authentications', 'sessions', 'user_metadata')
    `;
    
    console.log('\n验证表创建结果:');
    
    const createdTables = tablesResult.rows.map(row => row.table_name);
    const requiredTables = ['users', 'user_tokens', 'authentications', 'sessions', 'user_metadata'];
    
    requiredTables.forEach(table => {
      if (createdTables.includes(table)) {
        console.log(`✓ 表 "${table}" 已成功创建`);
      } else {
        console.log(`✗ 表 "${table}" 创建失败`);
      }
    });
    
    console.log('\nBetter Auth表结构应用完成!');
  } catch (error) {
    console.error('应用Better Auth表结构时出错:', error);
    process.exit(1);
  }
}

// 执行脚本
applySchema(); 
 