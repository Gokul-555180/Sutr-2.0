import type { EligibilityAssessment, GeneratedRoadmap, ListResponse, MatchResult, Scholarship, StudentProfile } from "../types";

const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
const API_BASE = rawBase.replace(/\/$/, "");

export class ApiError extends Error { constructor(message: string, public status?: number) { super(message); } }
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(`${API_BASE}${path}`, { ...options, headers: { "content-type": "application/json", ...options?.headers } }); }
  catch { throw new ApiError("Could not reach Sutr's local service. Check that the backend is running."); }
  let data: unknown;
  try { data = await response.json(); } catch { throw new ApiError("The server returned an invalid response.", response.status); }
  if (!response.ok) {
    const message = typeof data === "object" && data !== null && "error" in data && typeof (data as { error?: { message?: unknown } }).error?.message === "string" ? (data as { error: { message: string } }).error.message : "The request could not be completed.";
    throw new ApiError(message, response.status);
  }
  return data as T;
}
export function listScholarships(filters: Record<string, string | number | undefined>): Promise<ListResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  return request<ListResponse>(`/scholarships?${params.toString()}`);
}
export async function getScholarship(id: string): Promise<Scholarship> { return (await request<{ scholarship: Scholarship }>(`/scholarships/${encodeURIComponent(id)}`)).scholarship; }
export async function getMatches(profile: StudentProfile): Promise<MatchResult[]> { return (await request<{ matches: MatchResult[] }>("/scholarships/match", { method: "POST", body: JSON.stringify(profile) })).matches; }
export async function getAssessment(scholarshipId: string, profile: StudentProfile): Promise<EligibilityAssessment> { return (await request<{ assessment: EligibilityAssessment }>("/eligibility/evaluate", { method: "POST", body: JSON.stringify({ scholarshipId, profile }) })).assessment; }
export async function createRoadmap(scholarshipId: string, profile: StudentProfile): Promise<GeneratedRoadmap> { return (await request<{ roadmap: GeneratedRoadmap }>("/roadmaps", { method: "POST", body: JSON.stringify({ scholarshipId, profile }) })).roadmap; }
