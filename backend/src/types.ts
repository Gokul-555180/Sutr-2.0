export type RecordType = "verified" | "demo";
export type ConstraintStatus = "restricted" | "not_required" | "unknown";
export type CriterionStatus = "satisfied" | "not_satisfied" | "unknown" | "not_applicable";
export type EligibilityStatus = "likely_eligible" | "needs_more_information" | "likely_not_eligible";

export interface SourceReference {
  title: string;
  url: string;
  accessedAt: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  officialUrl: string | null;
  applicationUrl: string | null;
  eligibleStates: string[];
  stateRequirement: ConstraintStatus;
  eligibleCourses: string[];
  courseRequirement: ConstraintStatus;
  eligibleCourseLevels: string[];
  courseLevelRequirement: ConstraintStatus;
  eligibleYears: number[];
  academicYearRequirement: ConstraintStatus;
  minimumMarks: number | null;
  marksRequirement: ConstraintStatus;
  maximumAnnualFamilyIncome: number | null;
  incomeRequirement: ConstraintStatus;
  eligibleCategories: string[];
  categoryRequirement: ConstraintStatus;
  domicileRequirements: string[];
  domicileRequirement: ConstraintStatus;
  institutionRequirements: string[];
  institutionRequirement: ConstraintStatus;
  otherEligibilityRules: string[];
  requiredDocuments: Array<{ name: string; status: "documented" | "potential" | "unknown" }>;
  applicationInstructions: string[];
  applicationStartDate: string | null;
  applicationDeadline: string | null;
  awardAmount: string | null;
  recordType: RecordType;
  verificationStatus: "officially_sourced" | "demo_fictional" | "official_details_incomplete";
  sourceReferences: SourceReference[];
  lastVerifiedAt: string | null;
}

export interface StudentProfile {
  state?: string;
  domicile?: string;
  courseLevel?: string;
  course?: string;
  academicYear?: number;
  institutionType?: string;
  annualFamilyIncome?: number;
  marks?: number;
  category?: string;
}

export interface CriterionResult {
  key: string;
  label: string;
  status: CriterionStatus;
  required: boolean;
  explanation: string;
}

export interface EligibilityAssessment {
  scholarshipId: string;
  scholarshipName: string;
  recordType: RecordType;
  overallStatus: EligibilityStatus;
  criteria: CriterionResult[];
  satisfiedCriteria: CriterionResult[];
  failedCriteria: CriterionResult[];
  unknownCriteria: CriterionResult[];
  missingProfileInformation: string[];
  explanations: string[];
  sourceReferences: SourceReference[];
  disclaimer: string;
}

export interface MatchResult {
  scholarship: Scholarship;
  assessment: EligibilityAssessment;
  score: number;
  matchingReasons: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  detail: string;
  guidanceType: "scholarship_specific" | "general_guidance";
}

export interface GeneratedRoadmap {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  recordType: RecordType;
  tasks: RoadmapTask[];
  disclaimer: string;
}
