export interface ProjectData {
  id: string
  title: string
  description?: string
  author_id?: string
  author_name?: string
  author_avatar?: string
  created_at?: Date
  updated_at?: Date
  files: any
  view_count?: number
  like_count?: number
  external_url?: string
  external_embed?: boolean
  external_author?: string
  type?: string
  main_file?: string
  views?: number
  thumbnail_url?: string
  tags?: string[]
} 