import { NextResponse } from 'next/server';
import { sql } from '@/db';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    // 检查是否已有项目数据
    const countResult = await sql`SELECT COUNT(*) as count FROM projects`;
    const existingCount = parseInt(countResult.rows[0].count);
    
    if (existingCount > 0) {
      return NextResponse.json({
        status: 'skipped',
        message: `数据库中已有 ${existingCount} 个项目，跳过种子数据`,
        existingCount,
      });
    }

    // 插入示例项目数据
    const sampleProjects = [
      {
        id: nanoid(10),
        title: 'React Todo App',
        description: '一个简单优雅的待办事项应用，使用React Hooks实现',
        external_url: 'https://codesandbox.io/s/react-hooks-todo-app-nv9w4',
        external_author: 'CodeTok Demo',
        external_embed: true,
        type: 'external',
        is_public: true,
        views: 156,
        created_at: new Date('2024-01-15'),
      },
      {
        id: nanoid(10),
        title: 'Vue 3 Weather App',
        description: '实时天气查询应用，集成OpenWeather API',
        external_url: 'https://codepen.io/cameron-developer/pen/zYKjjqo',
        external_author: 'CodeTok Demo',
        external_embed: true,
        type: 'external',
        is_public: true,
        views: 89,
        created_at: new Date('2024-01-20'),
      },
      {
        id: nanoid(10),
        title: 'JavaScript Calculator',
        description: '功能完整的科学计算器，支持复杂运算',
        external_url: 'https://stackblitz.com/edit/js-calculator-demo',
        external_author: 'CodeTok Demo',
        external_embed: true,
        type: 'external',
        is_public: true,
        views: 234,
        created_at: new Date('2024-01-10'),
      },
      {
        id: nanoid(10),
        title: 'CSS Animation Gallery',
        description: '精美的CSS动画效果展示，纯CSS实现',
        external_url: 'https://codepen.io/trending',
        external_author: 'CodeTok Demo',
        external_embed: true,
        type: 'external',
        is_public: true,
        views: 178,
        created_at: new Date('2024-01-25'),
      },
      {
        id: nanoid(10),
        title: 'Three.js 3D Scene',
        description: '交互式3D场景，展示WebGL的强大功能',
        external_url: 'https://codesandbox.io/s/threejs-demo',
        external_author: 'CodeTok Demo',
        external_embed: true,
        type: 'external',
        is_public: true,
        views: 312,
        created_at: new Date('2024-01-05'),
      },
    ];

    // 插入项目数据
    let insertedCount = 0;
    for (const project of sampleProjects) {
      try {
        await sql`
          INSERT INTO projects (
            id, title, description, external_url, external_author,
            external_embed, type, is_public, views, created_at, updated_at
          ) VALUES (
            ${project.id}, ${project.title}, ${project.description}, 
            ${project.external_url}, ${project.external_author},
            ${project.external_embed}, ${project.type}, ${project.is_public}, 
            ${project.views}, ${project.created_at.toISOString()}, ${project.created_at.toISOString()}
          )
        `;
        insertedCount++;
      } catch (error) {
        console.error(`插入项目 ${project.title} 失败:`, error);
      }
    }

    return NextResponse.json({
      status: 'success',
      message: `成功插入 ${insertedCount} 个示例项目`,
      insertedCount,
      projects: sampleProjects.map(p => ({
        id: p.id,
        title: p.title,
        url: p.external_url,
      })),
    });
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
    }, { status: 500 });
  }
} 