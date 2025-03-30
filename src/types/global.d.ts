// 扩展Window接口，添加全局对象
interface Window {
  Babel?: {
    transform: (code: string, options: any) => { code: string };
  };
  React?: any;
  ReactDOM?: any;
}

// 扩展NodeJS命名空间
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_API_URL?: string;
    VERCEL_URL?: string;
    VERCEL_ENV?: 'production' | 'preview' | 'development';
    BLOB_READ_WRITE_TOKEN?: string;
  }
} 