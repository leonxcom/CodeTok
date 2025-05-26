import { NextRequest, NextResponse } from 'next/server';
import { codeGenerator } from '@/lib/ai/code-generator';
import type { CodeGenerationRequest } from '@/lib/ai/code-generator';

export async function POST(request: NextRequest) {
  try {
    const body: CodeGenerationRequest = await request.json();

    // Validate required fields
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate code
    const result = await codeGenerator.generateCode(body);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Code generation API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Code generation failed' 
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 