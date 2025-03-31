/**
 * 项目文件类型
 */
export type ProjectFile = {
  url: string;
  filename: string;
  pathname: string;
  size: number;
  type: string;
  isEntryPoint?: boolean;
}

/**
 * 项目响应类型
 */
export type ProjectResponse = {
  projectId: string;
  title?: string;
  description?: string;
  externalUrl?: string;
  externalEmbed?: boolean;
  externalAuthor?: string;
  type?: string;
  files: string[];
  mainFile: string;
  fileContents?: Record<string, string>;
  hasTsxFiles?: boolean;
  views?: number;
  createdAt?: Date | string;
} 