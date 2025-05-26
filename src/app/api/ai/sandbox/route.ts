import { NextRequest } from 'next/server';
import { FragmentSchema } from '@/lib/ai/schema';

export const maxDuration = 60;

// 执行结果类型
export interface ExecutionResult {
  sbxId: string;
  template: string;
  url?: string;
  stdout?: string;
  stderr?: string;
  runtimeError?: any;
  cellResults?: any[];
}

export async function POST(req: NextRequest) {
  try {
    const { fragment }: { fragment: FragmentSchema } = await req.json();

    if (!fragment) {
      return new Response('Fragment is required', { status: 400 });
    }

    console.log('正在处理代码片段:', fragment.title);

    // 模拟沙盒ID生成
    const sbxId = `sbx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 根据模板类型返回不同的执行结果
    const template = fragment.template || 'html-developer';

    if (template === 'code-interpreter-v1' || template === 'python-developer') {
      // Python代码执行模拟
      return new Response(
        JSON.stringify({
          sbxId,
          template,
          stdout: `代码执行成功！\n输出: Hello from Python code\n文件: ${fragment.file_path}`,
          stderr: '',
          runtimeError: null,
          cellResults: [
            { type: 'text', value: 'Code executed successfully' },
            { type: 'result', value: fragment.title }
          ],
        } as ExecutionResult),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Web应用模拟 - 生成一个模拟的预览URL
      const mockPort = fragment.port || 3000;
      const mockUrl = `https://mock-preview-${sbxId}.e2b.dev`;

      return new Response(
        JSON.stringify({
          sbxId,
          template,
          url: mockUrl,
        } as ExecutionResult),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    console.error('沙盒API错误:', error);

    return new Response(
      JSON.stringify({
        error: '代码执行失败',
        message: error.message,
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 