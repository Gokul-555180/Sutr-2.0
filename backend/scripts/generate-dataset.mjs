import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const accessedAt = "2026-10-13";
const eGrantzSource = { title: "e-Grantz 3.0 official portal", url: "https://www.egrantz.kerala.gov.in/", accessedAt };
const eGrantzFaq = { title: "e-Grantz 3.0 official FAQ", url: "https://www.egrantz.kerala.gov.in/Registration/get_allfaqs/", accessedAt };
const yasasviNotice = { title: "PM YASASVI 2023 notice hosted by e-Grantz", url: "https://egrantz.kerala.gov.in/egrantz_uploads/5e7cf6ec4a5ecba0e6c1326dcf2e5455.pdf", accessedAt };

const verified = [
  {
    id: "kerala-egrantz-post-matric-services", name: "e-Grantz 3.0 Post-matric scholarship services", provider: "Government of Kerala — e-Grantz 3.0",
    description: "Official Kerala portal for educational-assistance schemes for post-matric students. Individual scheme eligibility, awards and document requirements are determined in the portal and by the relevant department.",
    officialUrl: "https://www.egrantz.kerala.gov.in/", applicationUrl: "https://www.egrantz.kerala.gov.in/Registration/onetime_reg",
    eligibleStates: ["Kerala"], stateRequirement: "restricted", eligibleCourses: [], courseRequirement: "unknown", eligibleCourseLevels: ["Higher Secondary", "Undergraduate", "Postgraduate", "Doctoral"], courseLevelRequirement: "restricted", eligibleYears: [], academicYearRequirement: "unknown",
    minimumMarks: null, marksRequirement: "unknown", maximumAnnualFamilyIncome: null, incomeRequirement: "unknown", eligibleCategories: ["SC", "ST", "OBC"], categoryRequirement: "restricted", domicileRequirements: [], domicileRequirement: "unknown", institutionRequirements: [], institutionRequirement: "unknown",
    otherEligibilityRules: ["The official portal determines schemes visible to an eligible student after registration."], requiredDocuments: [{ name: "Scheme-specific documents", status: "unknown" }], applicationInstructions: ["Complete One Time Registration.", "Create the student profile and qualification in Student Login.", "Use Apply for Scholarship to view eligible schemes."], applicationStartDate: null, applicationDeadline: null, awardAmount: null,
    recordType: "verified", verificationStatus: "official_details_incomplete", sourceReferences: [eGrantzSource, eGrantzFaq], lastVerifiedAt: accessedAt,
  },
  {
    id: "pm-yasasvi-top-class-school-2023-reference", name: "PM YASASVI Top Class School Scheme — 2023 reference", provider: "Department of Social Justice and Empowerment, Government of India",
    description: "An archived 2023 official notice for PM YASASVI Top Class Schools. This record is historical reference only; it does not indicate a current application window.",
    officialUrl: yasasviNotice.url, applicationUrl: null,
    eligibleStates: [], stateRequirement: "not_required", eligibleCourses: [], courseRequirement: "not_required", eligibleCourseLevels: ["School"], courseLevelRequirement: "restricted", eligibleYears: [9, 11], academicYearRequirement: "restricted",
    minimumMarks: null, marksRequirement: "not_required", maximumAnnualFamilyIncome: 250000, incomeRequirement: "restricted", eligibleCategories: ["OBC", "EBC", "DNT"], categoryRequirement: "restricted", domicileRequirements: [], domicileRequirement: "not_required", institutionRequirements: ["Top Class School"], institutionRequirement: "restricted",
    otherEligibilityRules: ["The archived notice refers to merit through the YASASVI Entrance Test."], requiredDocuments: [{ name: "Income certificate", status: "documented" }, { name: "Caste certificate", status: "documented" }, { name: "Functional mobile number", status: "documented" }], applicationInstructions: ["Treat this as an archive. Check current official notices before relying on any eligibility or award detail."], applicationStartDate: null, applicationDeadline: null, awardAmount: "Archived 2023 notice: up to ₹75,000 p.a. for Class 9/10; up to ₹1,25,000 p.a. for Class 11/12.",
    recordType: "verified", verificationStatus: "officially_sourced", sourceReferences: [yasasviNotice], lastVerifiedAt: accessedAt,
  },
  {
    id: "kerala-egrantz-online-application-guide", name: "e-Grantz 3.0 online application guide", provider: "Government of Kerala — e-Grantz 3.0",
    description: "Verified official application guidance for Kerala's e-Grantz portal. It is a service guide rather than a separate funding programme; individual scheme conditions remain provider-controlled.",
    officialUrl: eGrantzFaq.url, applicationUrl: "https://www.egrantz.kerala.gov.in/Registration/onetime_reg",
    eligibleStates: ["Kerala"], stateRequirement: "restricted", eligibleCourses: [], courseRequirement: "unknown", eligibleCourseLevels: ["Higher Secondary", "Undergraduate", "Postgraduate", "Doctoral"], courseLevelRequirement: "restricted", eligibleYears: [], academicYearRequirement: "unknown",
    minimumMarks: null, marksRequirement: "unknown", maximumAnnualFamilyIncome: null, incomeRequirement: "unknown", eligibleCategories: [], categoryRequirement: "unknown", domicileRequirements: [], domicileRequirement: "unknown", institutionRequirements: [], institutionRequirement: "unknown",
    otherEligibilityRules: ["The FAQ says post-matric students are directed to One Time Registration and the student login flow."], requiredDocuments: [{ name: "Scheme-specific documents", status: "unknown" }], applicationInstructions: ["Use One Time Registration.", "Log in, complete profile details, add qualification, then use Apply for Scholarship."], applicationStartDate: null, applicationDeadline: null, awardAmount: null,
    recordType: "verified", verificationStatus: "official_details_incomplete", sourceReferences: [eGrantzFaq], lastVerifiedAt: accessedAt,
  },
];

const themes = [
  { key: "kerala-stem", title: "Sutr Kerala STEM Demo Award", state: "Kerala", course: "Engineering", level: "Undergraduate", income: 300000, marks: 70, category: null, institution: "Government", year: 1 },
  { key: "undergraduate-merit", title: "Sutr Undergraduate Merit Demo Grant", state: "All India", course: "Arts", level: "Undergraduate", income: 450000, marks: 78, category: null, institution: null, year: 1 },
  { key: "rural-learner", title: "Sutr Rural Learner Demo Scholarship", state: "Kerala", course: "Science", level: "Undergraduate", income: 250000, marks: 65, category: null, institution: "Government", year: 2 },
  { key: "first-generation", title: "Sutr First-Generation Student Demo Fund", state: "Tamil Nadu", course: "Commerce", level: "Undergraduate", income: 350000, marks: 60, category: "First Generation", institution: null, year: 1 },
  { key: "engineering-student", title: "Sutr Engineering Student Demo Award", state: "Karnataka", course: "Engineering", level: "Postgraduate", income: 500000, marks: 72, category: null, institution: "Private", year: 1 },
];
const variants = [
  { suffix: "Foundation", states: null, year: null, markDelta: 0, incomeDelta: 0 },
  { suffix: "Academic Pathway", states: "Kerala", year: 1, markDelta: 2, incomeDelta: -25000 },
  { suffix: "Future Skills", states: "Tamil Nadu", year: 2, markDelta: 4, incomeDelta: 25000 },
  { suffix: "Community Learning", states: "Karnataka", year: 3, markDelta: -3, incomeDelta: -50000 },
  { suffix: "Access Initiative", states: "Maharashtra", year: 1, markDelta: 5, incomeDelta: 50000 },
  { suffix: "Continuing Study", states: "Kerala", year: 2, markDelta: 1, incomeDelta: 0 },
  { suffix: "Women in Study", states: "All India", year: null, markDelta: -1, incomeDelta: 75000 },
  { suffix: "Regional Progress", states: "Goa", year: 1, markDelta: 3, incomeDelta: -75000 },
  { suffix: "Learning Bridge", states: "Telangana", year: 2, markDelta: 0, incomeDelta: 100000 },
  { suffix: "Achievement Track", states: null, year: 3, markDelta: 6, incomeDelta: 0 },
  { suffix: "Campus Support", states: "Kerala", year: 1, markDelta: -2, incomeDelta: 25000 },
  { suffix: "Career Preparation", states: "All India", year: 2, markDelta: 2, incomeDelta: -25000 },
];

const demos = themes.flatMap((theme) => variants.map((variant, index) => {
  const state = variant.states ?? theme.state;
  const allIndia = state === "All India";
  const minimumMarks = Math.max(50, theme.marks + variant.markDelta);
  const maximumAnnualFamilyIncome = Math.max(100000, theme.income + variant.incomeDelta);
  const restrictCategory = theme.category && index % 2 === 0;
  const restrictInstitution = theme.institution && index % 3 !== 0;
  return {
    id: `demo-${theme.key}-${String(index + 1).padStart(2, "0")}`,
    name: `${theme.title} — ${variant.suffix}`,
    provider: "Sutr demonstration dataset",
    description: "Fictional demonstration opportunity for exploring the Sutr matching, checklist, and roadmap experience. It is not a real funding programme and accepts no applications.",
    officialUrl: null, applicationUrl: null,
    eligibleStates: allIndia ? [] : [state], stateRequirement: allIndia ? "not_required" : "restricted",
    eligibleCourses: [theme.course], courseRequirement: "restricted",
    eligibleCourseLevels: [theme.level], courseLevelRequirement: "restricted",
    eligibleYears: variant.year ? [variant.year] : [], academicYearRequirement: variant.year ? "restricted" : "not_required",
    minimumMarks, marksRequirement: "restricted", maximumAnnualFamilyIncome, incomeRequirement: "restricted",
    eligibleCategories: restrictCategory ? [theme.category] : [], categoryRequirement: restrictCategory ? "restricted" : "not_required",
    domicileRequirements: allIndia ? [] : [state], domicileRequirement: allIndia ? "not_required" : "restricted",
    institutionRequirements: restrictInstitution ? [theme.institution] : [], institutionRequirement: restrictInstitution ? "restricted" : "not_required",
    otherEligibilityRules: ["Fictional criteria created solely for deterministic product demonstrations."],
    requiredDocuments: [{ name: "Demo academic record", status: "documented" }, { name: "Demo income declaration", status: "documented" }, ...(restrictCategory ? [{ name: "Demo category declaration", status: "documented" }] : []), { name: "Any provider-specific requirement", status: "potential" }],
    applicationInstructions: ["This is a fictional demo. Do not attempt to apply or provide personal documents."], applicationStartDate: null, applicationDeadline: null, awardAmount: `Demo only: illustrative support band up to ₹${(15000 + index * 5000).toLocaleString("en-IN")}.`,
    recordType: "demo", verificationStatus: "demo_fictional", sourceReferences: [], lastVerifiedAt: null,
  };
}));

const records = [...verified, ...demos];
const out = resolve(process.cwd(), "data", "scholarships.json");
mkdirSync(resolve(process.cwd(), "data"), { recursive: true });
writeFileSync(out, JSON.stringify(records, null, 2) + "\n");
console.log(`Wrote ${records.length} records (${verified.length} verified, ${demos.length} demo) to ${out}`);
