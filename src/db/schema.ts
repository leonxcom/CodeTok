// 项目文件类型
export type ProjectFile = {
  url: string;
  filename: string;
  pathname: string;
  size: number;
  type: string;
  isEntryPoint?: boolean;
}

// 项目模型类型
export interface Project {
  id: string;
  title: string;
  description: string | null;
  files: ProjectFile[];
  main_file: string;
  is_public: boolean;
  views: number;
  likes: number;
  external_url: string | null;
  external_embed: boolean;
  external_author: string | null;
  type: string | null;
  created_at: Date;
  updated_at: Date;
}

// 用户模型类型
export interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: Date;
}

// 收藏模型类型
export interface Favorite {
  user_id: string;
  project_id: string;
  created_at: Date;
}

// 点赞模型类型
export interface Like {
  id: string;
  user_id: string;
  project_id: string;
  created_at: Date;
}

// 评论模型类型
export interface Comment {
  id: string;
  content: string;
  user_id: string;
  project_id: string;
  parent_id: string | null;
  created_at: Date;
  updated_at: Date;
}

// 分享记录模型类型
export interface Share {
  id: string;
  user_id: string;
  project_id: string;
  platform: string; // 'twitter', 'facebook', 'wechat', 'copy_link', etc.
  created_at: Date;
}

// 用户关注模型类型
export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: Date;
}

// 通知模型类型
export interface Notification {
  id: string;
  user_id: string;
  type: string; // 'like', 'comment', 'follow', etc.
  actor_id: string;
  entity_id: string; // project_id, comment_id, etc.
  entity_type: string; // 'project', 'comment', etc.
  is_read: boolean;
  created_at: Date;
} 