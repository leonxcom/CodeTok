// 比较预览环境和生产环境的数据库表结构
// 特别关注projects表的字段差异
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function getTableStructure(databaseUrl, tableName) {
  // 保存原始URL
  const originalUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 设置临时URL
    process.env.POSTGRES_URL = databaseUrl;
    console.log(`连接到数据库: ${databaseUrl.substring(0, 30)}...`);
    
    // 获取表结构
    const result = await sql`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        column_default,
        is_nullable
      FROM 
        information_schema.columns 
      WHERE 
        table_name = ${tableName}
      ORDER BY 
        ordinal_position
    `;
    
    return result.rows;
  } catch (error) {
    console.error(`获取${tableName}表结构时出错:`, error);
    return [];
  } finally {
    // 恢复原始URL
    process.env.POSTGRES_URL = originalUrl;
  }
}

function compareColumns(previewColumns, productionColumns) {
  const previewColumnNames = previewColumns.map(c => c.column_name);
  const productionColumnNames = productionColumns.map(c => c.column_name);
  
  // 找出预览环境有但生产环境没有的列
  const missingInProduction = previewColumnNames.filter(name => !productionColumnNames.includes(name));
  
  // 找出生产环境有但预览环境没有的列
  const missingInPreview = productionColumnNames.filter(name => !previewColumnNames.includes(name));
  
  // 找出两边都有但类型或属性不同的列
  const differentColumns = [];
  
  previewColumns.forEach(previewCol => {
    const prodCol = productionColumns.find(c => c.column_name === previewCol.column_name);
    
    if (prodCol) {
      const differences = [];
      
      if (previewCol.data_type !== prodCol.data_type) {
        differences.push(`数据类型不同: 预览=${previewCol.data_type}, 生产=${prodCol.data_type}`);
      }
      
      if (previewCol.character_maximum_length !== prodCol.character_maximum_length) {
        differences.push(`长度不同: 预览=${previewCol.character_maximum_length}, 生产=${prodCol.character_maximum_length}`);
      }
      
      if (previewCol.is_nullable !== prodCol.is_nullable) {
        differences.push(`可空性不同: 预览=${previewCol.is_nullable}, 生产=${prodCol.is_nullable}`);
      }
      
      if (previewCol.column_default !== prodCol.column_default) {
        differences.push(`默认值不同: 预览=${previewCol.column_default}, 生产=${prodCol.column_default}`);
      }
      
      if (differences.length > 0) {
        differentColumns.push({
          column_name: previewCol.column_name,
          differences
        });
      }
    }
  });
  
  return {
    missingInProduction,
    missingInPreview,
    differentColumns
  };
}

async function main() {
  console.log('==== 比较预览环境和生产环境的数据库表结构 ====\n');
  
  // 获取预览环境的projects表结构
  console.log('获取预览环境的表结构...');
  const previewColumns = await getTableStructure(process.env.POSTGRES_URL_PREVIEW, 'projects');
  console.log(`预览环境中projects表有 ${previewColumns.length} 个字段`);
  
  // 获取生产环境的projects表结构
  console.log('\n获取生产环境的表结构...');
  const productionColumns = await getTableStructure(process.env.POSTGRES_URL_PRODUCTION, 'projects');
  console.log(`生产环境中projects表有 ${productionColumns.length} 个字段`);
  
  // 比较两个环境的表结构
  console.log('\n比较表结构差异...');
  const comparison = compareColumns(previewColumns, productionColumns);
  
  // 输出比较结果
  console.log('\n==== 比较结果 ====');
  
  if (comparison.missingInProduction.length > 0) {
    console.log('\n预览环境有但生产环境没有的字段:');
    comparison.missingInProduction.forEach(column => {
      const colDetails = previewColumns.find(c => c.column_name === column);
      console.log(`- ${column} (${colDetails.data_type}${colDetails.is_nullable === 'YES' ? ', 可空' : ''})`);
    });
  } else {
    console.log('\n预览环境的所有字段在生产环境中都存在');
  }
  
  if (comparison.missingInPreview.length > 0) {
    console.log('\n生产环境有但预览环境没有的字段:');
    comparison.missingInPreview.forEach(column => {
      const colDetails = productionColumns.find(c => c.column_name === column);
      console.log(`- ${column} (${colDetails.data_type}${colDetails.is_nullable === 'YES' ? ', 可空' : ''})`);
    });
  } else {
    console.log('\n生产环境的所有字段在预览环境中都存在');
  }
  
  if (comparison.differentColumns.length > 0) {
    console.log('\n两环境都有但定义不同的字段:');
    comparison.differentColumns.forEach(column => {
      console.log(`- ${column.column_name}:`);
      column.differences.forEach(diff => {
        console.log(`  * ${diff}`);
      });
    });
  } else {
    console.log('\n两环境中共有字段的定义完全相同');
  }
  
  // 详细输出所有字段信息供参考
  console.log('\n\n==== 预览环境字段详情 ====');
  previewColumns.forEach(column => {
    console.log(`${column.column_name} (${column.data_type}${column.character_maximum_length ? `(${column.character_maximum_length})` : ''}, ${column.is_nullable === 'YES' ? '可空' : '非空'}${column.column_default ? `, 默认值=${column.column_default}` : ''})`);
  });
  
  console.log('\n==== 生产环境字段详情 ====');
  productionColumns.forEach(column => {
    console.log(`${column.column_name} (${column.data_type}${column.character_maximum_length ? `(${column.character_maximum_length})` : ''}, ${column.is_nullable === 'YES' ? '可空' : '非空'}${column.column_default ? `, 默认值=${column.column_default}` : ''})`);
  });
}

main().catch(error => {
  console.error('比较表结构时出错:', error);
  process.exit(1);
}); 