/**
 * Single place for future backend configuration.
 *
 * Today the app uses the mock `paperService`. When the Cloudflare Worker API
 * is ready, set VITE_API_BASE_URL and swap the service implementation —
 * UI components should not need to change.
 *
 * See `.env.example` for placeholder values. Never put secrets in the bundle.
 */
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || "",
  useMock: (import.meta.env.VITE_USE_MOCK ?? "true") !== "false",
  downloadPath: (id: string) => `/api/papers/${encodeURIComponent(id)}/download`,
  papersPath: "/api/papers",
  submissionsPath: "/api/submissions",
} as const;

export function isMockMode(): boolean {
  return apiConfig.useMock || apiConfig.baseUrl === "";
}
