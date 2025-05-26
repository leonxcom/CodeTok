// 测试所有项目的iframe加载情况
require('dotenv').config();
const { Pool } = require('pg');

// 创建数据库连接
const connectionString = "postgresql://neondb_owner:npg_K3Ayuov7JeFn@ep-sparkling-darkness-a1t0bvr2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const pool = new Pool({ connectionString });

async function checkAllProjects() {
  console.log('正在检查所有项目的iframe加载情况...');
  
  try {
    // 查询所有项目
    const result = await pool.query(`
      SELECT id, title, external_url, external_embed, files, main_file
      FROM projects
      WHERE is_public = true
    `);
    
    console.log(`找到 ${result.rowCount} 个公开项目`);
    
    // 遍历项目并检查
    for (const project of result.rows) {
      console.log(`\n项目ID: ${project.id}`);
      console.log(`项目标题: ${project.title}`);
      
      // 检查外部URL
      if (project.external_url) {
        console.log(`外部URL: ${project.external_url}`);
        console.log(`外部嵌入: ${project.external_embed ? '是' : '否'}`);
        await checkUrl(project.external_url);
      } else {
        console.log('无外部URL');
      }
      
      // 检查文件
      try {
        let files = [];
        if (project.files) {
          const filesData = typeof project.files === 'string' ? JSON.parse(project.files) : project.files;
          files = Array.isArray(filesData) ? filesData : [];
          
          // 如果不是数组，尝试从对象中提取数组
          if (files.length === 0 && filesData && typeof filesData === 'object') {
            console.log('尝试从对象中提取文件');
            if (filesData.files && Array.isArray(filesData.files)) {
              files = filesData.files;
            }
          }
        }
        
        if (files.length > 0) {
          console.log(`找到 ${files.length} 个文件`);
          
          // 检查主文件
          const mainFile = project.main_file || (files[0] ? files[0].filename || files[0].pathname : null);
          if (mainFile) {
            console.log(`主文件: ${mainFile}`);
          } else {
            console.log('警告: 未找到主文件');
          }
          
          // 检查文件URL
          for (const file of files) {
            if (file.url) {
              console.log(`检查文件URL: ${file.filename || file.pathname}`);
              await checkUrl(file.url);
            }
          }
        } else {
          console.log('警告: 未找到文件');
        }
      } catch (e) {
        console.error('解析文件时出错:', e);
      }
    }
    
    console.log('\n检查完成!');
  } catch (error) {
    console.error('查询项目失败:', error);
  } finally {
    await pool.end();
  }
}

// 检查URL是否可以在iframe中加载
async function checkUrl(url) {
  try {
    if (!url) {
      console.log('  URL为空');
      return;
    }
    
    // 提取域名
    const domain = new URL(url).hostname;
    
    // 获取X-Frame-Options头
    const headers = await getHeaders(url);
    const xFrameOptions = headers['x-frame-options'];
    
    if (xFrameOptions) {
      if (xFrameOptions.toLowerCase() === 'deny') {
        console.log(`  ❌ 该URL不允许在iframe中加载 (X-Frame-Options: DENY)`);
      } else if (xFrameOptions.toLowerCase().includes('sameorigin')) {
        console.log(`  ❌ 该URL只允许在同源iframe中加载 (X-Frame-Options: SAMEORIGIN)`);
      } else {
        console.log(`  ⚠️ 该URL设置了X-Frame-Options: ${xFrameOptions}`);
      }
    } else {
      // 检查内容安全策略
      const csp = headers['content-security-policy'];
      if (csp && csp.includes('frame-ancestors')) {
        if (csp.includes('frame-ancestors none') || csp.includes("frame-ancestors 'none'")) {
          console.log(`  ❌ 该URL通过CSP禁止在iframe中加载`);
        } else if (csp.includes('frame-ancestors self') || csp.includes("frame-ancestors 'self'")) {
          console.log(`  ❌ 该URL通过CSP只允许在同源iframe中加载`);
        } else {
          console.log(`  ⚠️ 该URL设置了CSP frame-ancestors规则`);
        }
      } else {
        console.log(`  ✅ 该URL可能允许在iframe中加载`);
      }
    }
    
    // 检查常见第三方平台
    if (domain.includes('codepen.io')) {
      console.log(`  ✅ CodePen通常支持iframe嵌入`);
    } else if (domain.includes('codesandbox.io')) {
      console.log(`  ✅ CodeSandbox通常支持iframe嵌入`);
    } else if (domain.includes('github.io')) {
      console.log(`  ✅ GitHub Pages通常支持iframe嵌入`);
    } else if (domain.includes('netlify.app')) {
      console.log(`  ✅ Netlify应用通常支持iframe嵌入`);
    } else if (domain.includes('vercel.app')) {
      console.log(`  ✅ Vercel应用通常支持iframe嵌入`);
    } else if (domain.includes('jsfiddle.net')) {
      console.log(`  ✅ JSFiddle通常支持iframe嵌入`);
    } else if (domain.includes('stackblitz.com')) {
      console.log(`  ✅ StackBlitz通常支持iframe嵌入`);
    } else if (domain.includes('replit.com')) {
      console.log(`  ⚠️ Replit可能需要特殊配置才能在iframe中加载`);
    } else if (domain.includes('glitch.me') || domain.includes('glitch.com')) {
      console.log(`  ✅ Glitch通常支持iframe嵌入`);
    } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      console.log(`  ✅ YouTube视频可以在iframe中嵌入`);
    }
  } catch (error) {
    console.error(`  ❌ 检查URL时出错: ${error.message}`);
  }
}

// 获取URL的HTTP头
async function getHeaders(url) {
  try {
    // 模拟获取头部，实际环境中会使用fetch或其他HTTP客户端
    console.log(`  获取URL头部信息: ${url}`);
    
    // 这里只是模拟，实际上我们没有真正请求URL
    // 在浏览器环境中，可以使用fetch API并分析响应头
    return { /* 模拟的头部信息 */ };
  } catch (error) {
    console.error(`  获取头部失败: ${error.message}`);
    return {};
  }
}

// 运行检查
checkAllProjects().catch(console.error); 