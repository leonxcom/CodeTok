const { codeGenerator } = require('./src/lib/ai/code-generator');

async function testDeepSeekIntegration() {
  console.log('🚀 测试 DeepSeek R1 代码生成...');
  
  try {
    const result = await codeGenerator.generateCode({
      prompt: "创建一个简单的React计数器组件",
      language: "react",
      modelId: "deepseek-r1",
      style: "professional"
    });
    
    console.log('✅ DeepSeek R1 代码生成成功!');
    console.log('📝 生成的代码:');
    console.log('---');
    console.log(result.code);
    console.log('---');
    console.log('📄 描述:', result.description);
    console.log('🔧 语言:', result.language);
    console.log('📊 Token使用:', result.usage);
    
  } catch (error) {
    console.error('❌ DeepSeek R1 代码生成失败:', error.message);
    console.error('详细错误:', error);
  }
}

// 运行测试
testDeepSeekIntegration(); 