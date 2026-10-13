import type { MatchResult, Scholarship, StudentProfile } from "../types.js";
import { evaluateEligibility, rankAssessment } from "./eligibility.js";

export function matchScholarships(records: Scholarship[], profile: StudentProfile): MatchResult[] {
  return records.map((scholarship) => {
    const assessment = evaluateEligibility(scholarship, profile);
    const matchingReasons = assessment.criteria
      .filter((criterion) => criterion.status === "satisfied" || (criterion.status === "unknown" && criterion.required))
      .slice(0, 3)
      .map((criterion) => criterion.explanation);
    return { scholarship, assessment, score: rankAssessment(assessment), matchingReasons };
  }).sort((left, right) => right.score - left.score || left.scholarship.name.localeCompare(right.scholarship.name));
}
