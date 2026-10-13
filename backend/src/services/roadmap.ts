import type { GeneratedRoadmap, Scholarship, StudentProfile } from "../types.js";
import { evaluateEligibility } from "./eligibility.js";

export function generateRoadmap(scholarship: Scholarship, profile: StudentProfile = {}): GeneratedRoadmap {
  const assessment = evaluateEligibility(scholarship, profile);
  const tasks = [
    { id: "review-opportunity", title: "Review the opportunity", detail: scholarship.recordType === "demo" ? "Confirm that this fictional demonstration is being used only for practice." : "Read the provider information and source references before taking action.", guidanceType: "general_guidance" as const },
    { id: "review-eligibility", title: "Review the eligibility assessment", detail: "Check the preliminary assessment and do not treat it as official approval.", guidanceType: "general_guidance" as const },
    ...assessment.unknownCriteria.map((criterion) => ({ id: `resolve-${criterion.key}`, title: `Resolve ${criterion.label.toLocaleLowerCase()}`, detail: criterion.explanation, guidanceType: "general_guidance" as const })),
    ...scholarship.requiredDocuments.map((document, index) => ({ id: `document-${index}`, title: `Prepare: ${document.name}`, detail: document.status === "documented" ? "Documented by this record; verify the current provider instructions." : "Potential or unknown requirement; confirm it with the provider.", guidanceType: document.status === "documented" ? "scholarship_specific" as const : "general_guidance" as const })),
    ...(scholarship.officialUrl ? [{ id: "official-page", title: "Visit the official information page", detail: "Check current availability, instructions, and any dates directly with the provider.", guidanceType: "scholarship_specific" as const }] : []),
    ...(scholarship.applicationInstructions.length ? [{ id: "follow-instructions", title: "Follow the application instructions", detail: scholarship.applicationInstructions.join(" "), guidanceType: "scholarship_specific" as const }] : []),
    { id: "record-progress", title: "Record application progress", detail: "Use your own tracker. Marking a task complete here does not submit an application.", guidanceType: "general_guidance" as const },
    { id: "submission-confirmation", title: "Review official submission confirmation", detail: "If you apply, rely on the provider's own confirmation rather than this checklist.", guidanceType: "general_guidance" as const },
  ];
  return { id: `roadmap-${scholarship.id}`, scholarshipId: scholarship.id, scholarshipName: scholarship.name, recordType: scholarship.recordType, tasks, disclaimer: "This roadmap is planning support only. It does not submit or confirm an application." };
}
