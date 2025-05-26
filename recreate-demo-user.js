const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_K3Ayuov7JeFn@ep-sparkling-darkness-a1t0bvr2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

async function recreateDemoUser() {
  const client = await pool.connect();
  
  try {
    console.log('清理旧的演示用户数据...');
    
    // 删除旧的演示用户数据
    await client.query('DELETE FROM account WHERE "accountId" = $1', ['demo@codetok.com']);
    await client.query('DELETE FROM session WHERE "userId" IN (SELECT id FROM "user" WHERE email = $1)', ['demo@codetok.com']);
    await client.query('DELETE FROM "user" WHERE email = $1', ['demo@codetok.com']);
    
    console.log('✅ 旧数据已清理');
    
  } catch (error) {
    console.error('清理失败:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

recreateDemoUser(); 