/**
 * 项目文件接口
 */
export interface ProjectFile {
  url?: string;
  filename: string;
  pathname?: string;
  size?: number;
  type?: string;
  content?: string;
  isEntryPoint?: boolean;
}

/**
 * 项目数据接口
 */
export interface ProjectData {
  id: string;
  title?: string;
  description?: string;
  files?: string[] | ProjectFile[] | string;
  main_file?: string;
  views?: number;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  user_id?: string;
  external_url?: string;
  external_embed?: boolean;
  external_author?: string;
  type?: string;
}

/**
 * 项目响应接口
 */
export interface ProjectResponse {
  projectId: string;
  title?: string;
  description?: string;
  files: string[];
  mainFile: string;
  fileContents: Record<string, string>;
  hasTsxFiles?: boolean;
  views?: number;
  createdAt?: string;
  externalUrl?: string;
  externalEmbed?: boolean;
  externalAuthor?: string;
  type?: string;
}

/**
 * 用户接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  is_admin?: boolean;
} 