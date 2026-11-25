export type AssetType = "image" | "audio" | "video" | "subtitle";
export type AspectRatio = "9:16" | "16:9";

export interface AssetResponse {
  id: string;
  project_id: string;
  shot_id: string | null;
  generation_run_id: string | null;
  asset_type: AssetType;
  role: string;
  storage_provider: string;
  bucket: string;
  object_key: string;
  mime_type: string;
  size_bytes: number;
  width_px: number | null;
  height_px: number | null;
  duration_seconds: number | null;
  created_at: string;
}

export function inferAssetRatio(asset: AssetResponse): AspectRatio {
  if (asset.width_px && asset.height_px && asset.height_px > asset.width_px) {
    return "9:16";
  }
  return "16:9";
}
