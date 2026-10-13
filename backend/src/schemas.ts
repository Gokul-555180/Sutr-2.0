import { z } from "zod";

const optionalText = z.string().trim().min(1).max(80).optional();
export const profileSchema = z.object({
  state: optionalText,
  domicile: optionalText,
  courseLevel: optionalText,
  course: optionalText,
  academicYear: z.number().int().min(1).max(12).optional(),
  institutionType: optionalText,
  annualFamilyIncome: z.number().finite().min(0).max(100_000_000).optional(),
  marks: z.number().finite().min(0).max(100).optional(),
  category: optionalText,
}).strict();

export const listQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  state: z.string().trim().max(80).optional(),
  course: z.string().trim().max(80).optional(),
  courseLevel: z.string().trim().max(80).optional(),
  academicYear: z.coerce.number().int().min(1).max(12).optional(),
  recordType: z.enum(["verified", "demo"]).optional(),
  sort: z.enum(["recommended", "name", "provider", "verified_first"]).default("recommended"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const scholarshipIdSchema = z.object({ id: z.string().trim().min(1).max(120) });
export const eligibilitySchema = z.object({ scholarshipId: z.string().trim().min(1).max(120), profile: profileSchema });
export const roadmapSchema = z.object({ scholarshipId: z.string().trim().min(1).max(120), profile: profileSchema.optional() });
