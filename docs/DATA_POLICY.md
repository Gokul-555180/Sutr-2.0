# Sutr dataset policy

## Record categories

Each record has one of two `recordType` values:

- `verified`: displayed facts are supported by the attached authoritative source reference.
- `demo`: a fictional Sutr example created solely to demonstrate discovery, matching, checklists, and roadmaps.

Demo records use `officialUrl: null` and `applicationUrl: null`, are badged as “Demonstration” in the interface, and explicitly say they are not funding offers. Their criteria, awards, and document names are invented illustrative data and must never be treated as real programmes.

## Verified source scope

The current verified source material is limited to the official Kerala e-Grantz portal/FAQ and an official-hosted archived PM YASASVI notice. Source links and access dates are stored per record. A source being official does not make every missing fact known.

`official_details_incomplete` means an official page establishes that the portal or service exists, but does not document a particular award, deadline, document list, or eligibility detail in the record. Those fields are kept `null`, `unknown`, or explicitly not documented. The e-Grantz records are service/portal records, not a claim that one universal award or rule applies to all e-Grantz schemes.

The PM YASASVI item is plainly named as a 2023 archived reference. It must not be read as evidence that applications are currently open.

## What Sutr will not invent

Sutr does not fabricate a deadline, award amount, application URL, mandatory document, or official eligibility rule when the source does not support it. Unknown criteria remain unknown in the eligibility engine. A blank list is not assumed to mean unrestricted eligibility: the paired requirement status explicitly expresses `restricted`, `not_required`, or `unknown`.

## Update process

Before moving a record to `verified`, review an authoritative source (for example, the official provider or government portal), preserve its link and access date, and include only information it supports. If current availability or terms cannot be verified, retain a demo label or mark facts unknown. Re-run `node backend/scripts/generate-dataset.mjs` after any source-data change to reproduce `backend/data/scholarships.json`.
