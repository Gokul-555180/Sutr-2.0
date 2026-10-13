import type { ConstraintStatus, CriterionResult, EligibilityAssessment, Scholarship, StudentProfile } from "../types.js";

function equal(one: string, two: string): boolean { return one.trim().toLocaleLowerCase() === two.trim().toLocaleLowerCase(); }
function has(values: string[], input: string): boolean { return values.some((value) => equal(value, input)); }

function listCriterion(key: string, label: string, mode: ConstraintStatus, values: string[], value: string | undefined, required = true): CriterionResult {
  if (mode === "not_required") return { key, label, status: "not_applicable", required: false, explanation: `${label} is not a stated requirement.` };
  if (mode === "unknown") return { key, label, status: "unknown", required: false, explanation: `The record does not document how ${label.toLocaleLowerCase()} is assessed.` };
  if (!value) return { key, label, status: "unknown", required, explanation: `Add your ${label.toLocaleLowerCase()} to check this requirement.` };
  if (has(values, value)) return { key, label, status: "satisfied", required, explanation: `Your ${label.toLocaleLowerCase()} matches the documented requirement.` };
  return { key, label, status: "not_satisfied", required, explanation: `This record is restricted to: ${values.join(", ")}.` };
}

function numberCriterion(key: string, label: string, mode: ConstraintStatus, threshold: number | null, value: number | undefined, direction: "minimum" | "maximum"): CriterionResult {
  if (mode === "not_required") return { key, label, status: "not_applicable", required: false, explanation: `${label} is not a stated requirement.` };
  if (mode === "unknown" || threshold === null) return { key, label, status: "unknown", required: false, explanation: `The record does not document a ${label.toLocaleLowerCase()} threshold.` };
  if (value === undefined) return { key, label, status: "unknown", required: true, explanation: `Add your ${label.toLocaleLowerCase()} to check this requirement.` };
  const passed = direction === "minimum" ? value >= threshold : value <= threshold;
  const readable = direction === "minimum" ? `at least ${threshold}%` : `no more than ₹${threshold.toLocaleString("en-IN")}`;
  return { key, label, status: passed ? "satisfied" : "not_satisfied", required: true, explanation: passed ? `Your ${label.toLocaleLowerCase()} meets the documented threshold of ${readable}.` : `The documented threshold is ${readable}.` };
}

export function evaluateEligibility(scholarship: Scholarship, profile: StudentProfile): EligibilityAssessment {
  const criteria: CriterionResult[] = [
    listCriterion("state", "State", scholarship.stateRequirement, scholarship.eligibleStates, profile.state),
    listCriterion("domicile", "Domicile", scholarship.domicileRequirement, scholarship.domicileRequirements, profile.domicile),
    listCriterion("course", "Course", scholarship.courseRequirement, scholarship.eligibleCourses, profile.course),
    listCriterion("courseLevel", "Degree level", scholarship.courseLevelRequirement, scholarship.eligibleCourseLevels, profile.courseLevel),
    scholarship.academicYearRequirement === "restricted"
      ? listCriterion("academicYear", "Academic year", "restricted", scholarship.eligibleYears.map(String), profile.academicYear?.toString())
      : listCriterion("academicYear", "Academic year", scholarship.academicYearRequirement, [], undefined),
    listCriterion("institutionType", "Institution type", scholarship.institutionRequirement, scholarship.institutionRequirements, profile.institutionType),
    listCriterion("category", "Category", scholarship.categoryRequirement, scholarship.eligibleCategories, profile.category),
    numberCriterion("marks", "Marks", scholarship.marksRequirement, scholarship.minimumMarks, profile.marks, "minimum"),
    numberCriterion("income", "Annual family income", scholarship.incomeRequirement, scholarship.maximumAnnualFamilyIncome, profile.annualFamilyIncome, "maximum"),
  ];
  const failedCriteria = criteria.filter((criterion) => criterion.required && criterion.status === "not_satisfied");
  const unknownCriteria = criteria.filter((criterion) => criterion.required && criterion.status === "unknown");
  const satisfiedCriteria = criteria.filter((criterion) => criterion.status === "satisfied");
  const missingProfileInformation = unknownCriteria.map((criterion) => criterion.label);
  const overallStatus = failedCriteria.length > 0 ? "likely_not_eligible" : unknownCriteria.length > 0 ? "needs_more_information" : "likely_eligible";
  const typeLabel = scholarship.recordType === "demo" ? "This is a fictional demonstration assessment, not a funding offer." : "This is a preliminary check only; the provider makes the official eligibility decision.";
  return {
    scholarshipId: scholarship.id,
    scholarshipName: scholarship.name,
    recordType: scholarship.recordType,
    overallStatus,
    criteria,
    satisfiedCriteria,
    failedCriteria,
    unknownCriteria,
    missingProfileInformation,
    explanations: criteria.filter((criterion) => criterion.status !== "not_applicable").map((criterion) => criterion.explanation),
    sourceReferences: scholarship.sourceReferences,
    disclaimer: typeLabel,
  };
}

export function rankAssessment(assessment: EligibilityAssessment): number {
  const score = assessment.criteria.reduce((total, criterion) => total + (criterion.status === "satisfied" ? 12 : criterion.status === "unknown" && criterion.required ? 3 : 0), 0);
  return score - assessment.failedCriteria.length * 100;
}
