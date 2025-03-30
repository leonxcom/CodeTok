declare module '@vercel/blob' {
  export interface PutBlobResult {
    url: string;
    pathname: string;
    contentType: string;
    contentDisposition: string | null;
  }

  export interface BlobObject {
    url: string;
    pathname: string;
    contentType: string;
    contentDisposition: string | null;
    size: number;
    uploadedAt: Date;
  }

  export interface ListBlobResult {
    blobs: BlobObject[];
    cursor: string | null;
  }

  export type PutBlobOptions = {
    access?: 'public' | 'private';
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
    contentType?: string;
    contentDisposition?: string;
    multipart?: boolean;
  };

  export function put(
    pathname: string,
    body: Blob | ArrayBuffer | ArrayBufferView | NodeJS.ReadableStream | string | ReadableStream,
    options?: PutBlobOptions
  ): Promise<PutBlobResult>;

  export function list(options?: {
    prefix?: string;
    cursor?: string;
    limit?: number;
  }): Promise<ListBlobResult>;

  export function del(url: string): Promise<void>;
} 