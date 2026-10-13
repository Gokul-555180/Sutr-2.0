import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { eligibilitySchema, listQuerySchema, profileSchema, roadmapSchema, scholarshipIdSchema } from "./schemas.js";
import { evaluateEligibility } from "./services/eligibility.js";
import { matchScholarships } from "./services/matching.js";
import { generateRoadmap } from "./services/roadmap.js";
import { getScholarship, getScholarships, searchScholarships } from "./services/scholarshipRepository.js";

export const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, methods: ["GET", "POST"] }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_request, response) => response.json({ status: "ok", service: "sutr-api" }));

app.get("/api/scholarships", (request, response, next) => {
  try { response.json(searchScholarships(listQuerySchema.parse(request.query))); } catch (error) { next(error); }
});

app.get("/api/scholarships/:id", (request, response, next) => {
  try {
    const { id } = scholarshipIdSchema.parse(request.params);
    const scholarship = getScholarship(id);
    if (!scholarship) return response.status(404).json({ error: { code: "NOT_FOUND", message: "Scholarship not found." } });
    response.json({ scholarship });
  } catch (error) { next(error); }
});

app.post("/api/scholarships/match", (request, response, next) => {
  try {
    const profile = profileSchema.parse(request.body);
    response.json({ matches: matchScholarships(getScholarships(), profile), total: getScholarships().length });
  } catch (error) { next(error); }
});

app.post("/api/eligibility/evaluate", (request, response, next) => {
  try {
    const { scholarshipId, profile } = eligibilitySchema.parse(request.body);
    const scholarship = getScholarship(scholarshipId);
    if (!scholarship) return response.status(404).json({ error: { code: "NOT_FOUND", message: "Scholarship not found." } });
    response.json({ assessment: evaluateEligibility(scholarship, profile) });
  } catch (error) { next(error); }
});

app.post("/api/roadmaps", (request, response, next) => {
  try {
    const { scholarshipId, profile } = roadmapSchema.parse(request.body);
    const scholarship = getScholarship(scholarshipId);
    if (!scholarship) return response.status(404).json({ error: { code: "NOT_FOUND", message: "Scholarship not found." } });
    response.status(201).json({ roadmap: generateRoadmap(scholarship, profile) });
  } catch (error) { next(error); }
});

app.use((_request, response) => response.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found." } }));

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ZodError) return response.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid request.", details: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })) } });
  if (error instanceof SyntaxError && "body" in error) return response.status(400).json({ error: { code: "INVALID_JSON", message: "Malformed JSON request body." } });
  console.error("Unhandled API error", error);
  return response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "The server could not process this request." } });
});
