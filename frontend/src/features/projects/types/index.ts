export type ProjectStatus =
  | "draft"
  | "uploaded"
  | "generating_script"
  | "generating_storyboard"
  | "generating_keyframes"
  | "generating_narration"
  | "generating_music"
  | "assembling"
  | "done"
  | "error";

export type OutputType = "video" | "audio" | "image";

export interface ProjectSettings {
  target_duration_seconds?: number;
  aspect_ratios?: string[];
  output_type?: OutputType;
  visual_style?: string;
  subtitle_language?: string;
}

export interface ProjectListItem {
  id: string;
  title: string;
  heritage_topic: string;
  language_code: string;
  status: ProjectStatus;
  settings?: ProjectSettings;
  created_at: string;
  updated_at: string;
}

export interface ProjectResponse extends ProjectListItem {
  description: string | null;
  script_text: string | null;
  settings: ProjectSettings;
}

export interface ProjectCreate {
  title: string;
  heritage_topic: string;
  description?: string;
  language_code: string;
  settings?: ProjectSettings;
}

export interface ProjectUpdate {
  title?: string;
  heritage_topic?: string;
  description?: string;
  language_code?: string;
  script_text?: string;
  settings?: ProjectSettings;
}

export interface StudioStats {
  total_projects: number;
  videos_generated: number;
  storage_bytes: number;
  languages_count: number;
}
