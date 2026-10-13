import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { Scholarship } from "../types.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(currentDirectory, "../../data/scholarships.json");
let cache: Scholarship[] | null = null;

export function getScholarships(): Scholarship[] {
  if (cache) return cache;
  const parsed: unknown = JSON.parse(readFileSync(dataPath, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("Scholarship dataset is not an array.");
  cache = parsed as Scholarship[];
  return cache;
}

export function getScholarship(id: string): Scholarship | undefined {
  return getScholarships().find((record) => record.id === id);
}

function includesIgnoreCase(values: string[], input: string | undefined): boolean {
  return !input || values.some((value) => value.toLocaleLowerCase() === input.toLocaleLowerCase());
}

function matchesFilter(record: Scholarship, field: "state" | "course" | "courseLevel" | "academicYear", value: string | number | undefined): boolean {
  if (value === undefined || value === "") return true;
  if (field === "state") return record.stateRequirement !== "restricted" || includesIgnoreCase(record.eligibleStates, String(value));
  if (field === "course") return record.courseRequirement !== "restricted" || includesIgnoreCase(record.eligibleCourses, String(value));
  if (field === "courseLevel") return record.courseLevelRequirement !== "restricted" || includesIgnoreCase(record.eligibleCourseLevels, String(value));
  return record.academicYearRequirement !== "restricted" || record.eligibleYears.includes(Number(value));
}

export function searchScholarships(query: { q?: string; state?: string; course?: string; courseLevel?: string; academicYear?: number; recordType?: "verified" | "demo"; sort: "recommended" | "name" | "provider" | "verified_first"; page: number; limit: number }) {
  const words = query.q?.toLocaleLowerCase();
  const filtered = getScholarships().filter((record) => {
    const haystack = `${record.name} ${record.provider} ${record.description}`.toLocaleLowerCase();
    return (!words || haystack.includes(words)) &&
      (!query.recordType || record.recordType === query.recordType) &&
      matchesFilter(record, "state", query.state) && matchesFilter(record, "course", query.course) &&
      matchesFilter(record, "courseLevel", query.courseLevel) && matchesFilter(record, "academicYear", query.academicYear);
  });
  const ordered = [...filtered].sort((left, right) => {
    if (query.sort === "name") return left.name.localeCompare(right.name);
    if (query.sort === "provider") return left.provider.localeCompare(right.provider) || left.name.localeCompare(right.name);
    if (query.sort === "verified_first") return (left.recordType === "verified" ? 0 : 1) - (right.recordType === "verified" ? 0 : 1) || left.name.localeCompare(right.name);
    return 0;
  });
  const start = (query.page - 1) * query.limit;
  return { results: ordered.slice(start, start + query.limit), total: ordered.length, page: query.page, limit: query.limit };
}
