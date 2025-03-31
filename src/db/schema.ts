import { sql } from 'drizzle-orm';
import { 
  text, 
  timestamp, 
  pgTable, 
  json,
  integer, 
  boolean, 
  primaryKey, 
  serial
} from 'drizzle-orm/pg-core';

// 项目文件类型
export type ProjectFile = {
  url: string;
  filename: string;
  pathname: string;
  size: number;
  type: string;
  isEntryPoint?: boolean;
}

// 项目表
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  files: json('files').$type<ProjectFile[]>(),
  mainFile: text('main_file'),
  isPublic: boolean('is_public').default(true),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  externalUrl: text('external_url'),
  externalEmbed: boolean('external_embed').default(false),
  externalAuthor: text('external_author'),
  type: text('type'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 用户表 (待实现)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 收藏表 (待实现)
export const favorites = pgTable('favorites', {
  userId: text('user_id').notNull().references(() => users.id),
  projectId: text('id').notNull().references(() => projects.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.projectId] }),
})); 