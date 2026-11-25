import { API_BASE, apiFetch } from "@/lib/api-client";
import { AssetResponse } from "../types";

const STORAGE_BASE = API_BASE.replace(/\/api\/?$/, "");

export function listAssets(
  projectId: string,
  page = 1,
  pageSize = 12
): Promise<AssetResponse[]> {
  const skip = (page - 1) * pageSize;
  return apiFetch(
    `/assets/project/${encodeURIComponent(projectId)}?skip=${skip}&limit=${pageSize}`
  );
}

export function deleteAsset(assetId: string): Promise<void> {
  return apiFetch(`/assets/${encodeURIComponent(assetId)}`, {
    method: "DELETE",
  });
}

export function getAssetStreamUrl(objectKey: string): string {
  return `${STORAGE_BASE}/storage/${objectKey.replace(/^\/+/, "")}`;
}

export function getAssetDownloadUrl(assetId: string): string {
  return `${API_BASE}/assets/${encodeURIComponent(assetId)}/download`;
}
