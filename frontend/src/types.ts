export type RecordType = "verified" | "demo";
export type CriterionStatus = "satisfied" | "not_satisfied" | "unknown" | "not_applicable";
export type EligibilityStatus = "likely_eligible" | "needs_more_information" | "likely_not_eligible";

export interface StudentProfile { state?: string; domicile?: string; courseLevel?: string; course?: string; academicYear?: number; institutionType?: string; annualFamilyIncome?: number; marks?: number; category?: string; }
export interface SourceReference { title: string; url: string; accessedAt: string; }
export interface Scholarship {
  id: string; name: string; provider: string; description: string; officialUrl: string | null; applicationUrl: string | null;
  eligibleStates: string[]; stateRequirement: string; eligibleCourses: string[]; courseRequirement: string; eligibleCourseLevels: string[]; courseLevelRequirement: string; eligibleYears: number[]; academicYearRequirement: string;
  minimumMarks: number | null; marksRequirement: string; maximumAnnualFamilyIncome: number | null; incomeRequirement: string; eligibleCategories: string[]; categoryRequirement: string; domicileRequirements: string[]; domicileRequirement: string; institutionRequirements: string[]; institutionRequirement: string;
  otherEligibilityRules: string[]; requiredDocuments: Array<{ name: string; status: "documented" | "potential" | "unknown" }>; applicationInstructions: string[]; applicationStartDate: string | null; applicationDeadline: string | null; awardAmount: string | null;
  recordType: RecordType; verificationStatus: string; sourceReferences: SourceReference[]; lastVerifiedAt: string | null;
}
export interface CriterionResult { key: string; label: string; status: CriterionStatus; required: boolean; explanation: string; }
export interface EligibilityAssessment { scholarshipId: string; scholarshipName: string; recordType: RecordType; overallStatus: EligibilityStatus; criteria: CriterionResult[]; satisfiedCriteria: CriterionResult[]; failedCriteria: CriterionResult[]; unknownCriteria: CriterionResult[]; missingProfileInformation: string[]; explanations: string[]; sourceReferences: SourceReference[]; disclaimer: string; }
export interface MatchResult { scholarship: Scholarship; assessment: EligibilityAssessment; score: number; matchingReasons: string[]; }
export interface GeneratedRoadmap { id: string; scholarshipId: string; scholarshipName: string; recordType: RecordType; tasks: Array<{ id: string; title: string; detail: string; guidanceType: "scholarship_specific" | "general_guidance" }>; disclaimer: string; }
export interface StoredRoadmap extends GeneratedRoadmap { createdAt: string; taskState: Record<string, boolean>; }
export type DocumentState = "not_started" | "in_progress" | "ready";
export interface ListResponse { results: Scholarship[]; total: number; page: number; limit: number; }
