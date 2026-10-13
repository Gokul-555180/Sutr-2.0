import assert from "node:assert/strict";
import test from "node:test";
import type { Scholarship } from "../types.js";
import { evaluateEligibility } from "./eligibility.js";

const base: Scholarship = {
  id: "test", name: "Test", provider: "Test", description: "Test", officialUrl: null, applicationUrl: null,
  eligibleStates: ["Kerala"], stateRequirement: "restricted", eligibleCourses: ["Engineering"], courseRequirement: "restricted",
  eligibleCourseLevels: ["Undergraduate"], courseLevelRequirement: "restricted", eligibleYears: [], academicYearRequirement: "not_required",
  minimumMarks: 75, marksRequirement: "restricted", maximumAnnualFamilyIncome: 250000, incomeRequirement: "restricted",
  eligibleCategories: [], categoryRequirement: "not_required", domicileRequirements: [], domicileRequirement: "not_required",
  institutionRequirements: [], institutionRequirement: "not_required", otherEligibilityRules: [], requiredDocuments: [], applicationInstructions: [],
  applicationStartDate: null, applicationDeadline: null, awardAmount: null, recordType: "demo", verificationStatus: "demo_fictional", sourceReferences: [], lastVerifiedAt: null,
};

test("treats income and marks at the threshold as satisfied", () => {
  const assessment = evaluateEligibility(base, { state: "Kerala", course: "Engineering", courseLevel: "Undergraduate", marks: 75, annualFamilyIncome: 250000 });
  assert.equal(assessment.overallStatus, "likely_eligible");
});
test("fails income above the maximum", () => assert.equal(evaluateEligibility(base, { state: "Kerala", course: "Engineering", courseLevel: "Undergraduate", marks: 75, annualFamilyIncome: 250001 }).overallStatus, "likely_not_eligible"));
test("keeps missing income and marks unknown", () => {
  const assessment = evaluateEligibility(base, { state: "Kerala", course: "Engineering", courseLevel: "Undergraduate" });
  assert.equal(assessment.overallStatus, "needs_more_information");
  assert.deepEqual(assessment.missingProfileInformation.sort(), ["Annual family income", "Marks"]);
});
test("fails state and course mismatches", () => {
  const assessment = evaluateEligibility(base, { state: "Tamil Nadu", course: "Medicine", courseLevel: "Undergraduate", marks: 80, annualFamilyIncome: 100000 });
  assert.equal(assessment.overallStatus, "likely_not_eligible");
  assert.equal(assessment.failedCriteria.length, 2);
});
test("does not make optional unknown rules mandatory", () => {
  const optional = { ...base, categoryRequirement: "unknown" as const };
  assert.equal(evaluateEligibility(optional, { state: "Kerala", course: "Engineering", courseLevel: "Undergraduate", marks: 90, annualFamilyIncome: 100000 }).overallStatus, "likely_eligible");
});
