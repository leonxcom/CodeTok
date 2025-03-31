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