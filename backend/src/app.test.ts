import assert from "node:assert/strict";
import test, { after } from "node:test";
import { app } from "./app.js";

const server = app.listen(0);
await new Promise<void>((resolve) => server.once("listening", resolve));
const address = server.address();
if (!address || typeof address === "string") throw new Error("Unable to start test server");
const base = `http://127.0.0.1:${address.port}`;
after(() => server.close());

test("health and scholarship listing return data", async () => {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  const listing = await fetch(`${base}/api/scholarships?limit=2`);
  const body = await listing.json() as { results: unknown[]; total: number };
  assert.equal(listing.status, 200);
  assert.equal(body.results.length, 2);
  assert.ok(body.total >= 50);
});
test("invalid request and unknown scholarship return useful errors", async () => {
  const invalid = await fetch(`${base}/api/scholarships/match`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ marks: 101 }) });
  assert.equal(invalid.status, 400);
  const unknown = await fetch(`${base}/api/eligibility/evaluate`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scholarshipId: "missing", profile: {} }) });
  assert.equal(unknown.status, 404);
});
