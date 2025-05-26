import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  json, 
  primaryKey, 
  uuid,
  serial 
} from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  bio: text('bio'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 项目表
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  files: json('files').$type<Array<{
    url: string;
    filename: string;
    pathname: string;
    size: number;
    type: string;
    isEntryPoint?: boolean;
  }>>().default([]),
  main_file: text('main_file').notNull(),
  is_public: boolean('is_public').default(true).notNull(),
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  comments_count: integer('comments_count').default(0).notNull(),
  external_url: text('external_url'),
  external_embed: boolean('external_embed').default(false).notNull(),
  external_author: text('external_author'),
  type: text('type'),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 收藏表
export const favorites = pgTable('favorites', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  project_id: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.project_id] }),
}));

// 点赞表
export const likes = pgTable('likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  project_id: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 评论表
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  project_id: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  parent_id: uuid('parent_id').references((): any => comments.id, { onDelete: 'set null' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 分享记录表
export const shares = pgTable('shares', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  project_id: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // 'twitter', 'facebook', 'wechat', 'copy_link', etc.
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 用户关注表
export const follows = pgTable('follows', {
  follower_id: uuid('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  following_id: uuid('following_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.follower_id, t.following_id] }),
}));

// 通知表
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'like', 'comment', 'follow', etc.
  actor_id: uuid('actor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  entity_id: text('entity_id').notNull(), // project_id, comment_id, etc.
  entity_type: text('entity_type').notNull(), // 'project', 'comment', etc.
  is_read: boolean('is_read').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 标签表
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 项目标签关联表
export const project_tags = pgTable('project_tags', {
  project_id: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  tag_id: serial('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.project_id, t.tag_id] }),
}));

// 定义关系
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  likes: many(likes),
  comments: many(comments),
  favorites: many(favorites),
  followers: many(follows, { relationName: 'followers' }),
  following: many(follows, { relationName: 'following' }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.user_id], references: [users.id] }),
  likes: many(likes),
  comments: many(comments),
  favorites: many(favorites),
  tags: many(project_tags),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, { fields: [comments.user_id], references: [users.id] }),
  project: one(projects, { fields: [comments.project_id], references: [projects.id] }),
  parent: one(comments, { fields: [comments.parent_id], references: [comments.id] }),
  replies: many(comments, { relationName: 'replies' }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.user_id], references: [users.id] }),
  project: one(projects, { fields: [likes.project_id], references: [projects.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.user_id], references: [users.id] }),
  project: one(projects, { fields: [favorites.project_id], references: [projects.id] }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, { fields: [follows.follower_id], references: [users.id], relationName: 'followers' }),
  following: one(users, { fields: [follows.following_id], references: [users.id], relationName: 'following' }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  projects: many(project_tags),
}));

export const projectTagsRelations = relations(project_tags, ({ one }) => ({
  project: one(projects, { fields: [project_tags.project_id], references: [projects.id] }),
  tag: one(tags, { fields: [project_tags.tag_id], references: [tags.id] }),
})); 