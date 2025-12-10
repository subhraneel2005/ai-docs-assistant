# Project workflow for ai docs assistant

this document explains, in practical detail, how each required tool (cline, kestra, oumi, vercel, coderabbit) fits into this project, how they interact, and the recommended workflows for development, demo, and self-hosting.

this project is a single turborepo with `apps/extension`, `apps/dashboard`, and `packages/shared`.

---

## goals

- satisfy hackathon requirements by integrating all five tools
- make workflows simple and reproducible
- keep the system self-hostable while allowing vercel deployment for the dashboard
- provide clear trigger points and api endpoints so components can be tested independently

---

## high-level architecture

- chrome extension: captures page content, converts to markdown, calls dashboard api to save.
- dashboard (next.js): ui, api routes, kestra orchestration, oumi feedback sink, cline trigger endpoints, job logs, user interface for summaries and project generation.
- shared packages: markdown cleaning utilities, types, api clients.

---

## key concepts and trigger points

- capture -> save: extension sends `POST /api/docs` with a payload `{ title, url, markdown, rawHtml, meta }`.
- summarize -> kestra: `POST /api/docs/:id/summarize` enqueues a kestra workflow that reads the stored markdown and returns a structured summary.
- feedback -> oumi: user presses "good" or "bad" in the ui, which calls `POST /api/docs/:id/feedback` storing feedback and sending a reward signal to oumi.
- generate -> cline: user presses "generate starter" which calls `POST /api/docs/:id/generate`. backend runs cline with a prompt built from the markdown and returns an artifact (zip) and logs.

---

## tool-by-tool detailed workflow

### cline

purpose:

- generate starter projects, example apps, or scaffolding from captured documentation and summary.

how to integrate:

- backend endpoint: `POST /api/generate` (or `POST /api/docs/:id/generate`).
- the backend composes a prompt/template from the markdown and calls cline. options:
  - run cline as a local subprocess (recommended for self-hosting)
  - run cline inside a container (docker) and mount a workspace
  - if running on a hosted ci runner, call cline there and store artifacts in s3-like storage

expected outputs:

- a zip file with generated code
- a log of the cline session (stdout/stderr)

notes:

- make cline runs asynchronous: return a job id immediately and stream logs to dashboard via a job status endpoint.
- store artifacts in `storage/artifacts/<job-id>.zip` for download.

### kestra

purpose:

- run ai workflows for summarization, breakdown, and decision logic.

how to integrate:

- create kestra workflows that accept markdown and return:
  - short summary
  - bullet points
  - tutorial outline
  - flashcards

- dashboard calls kestra via `POST /api/kestra/run` or calls a dashboard api which acts as a wrapper.
- kestra workflow should include simple decision logic (document length -> choose summary style). this satisfies the "agent makes decisions" requirement.

implementation tips:

- keep a thin wrapper in the dashboard that translates app inputs into kestra workflow inputs.
- store kestra run ids and results in the db so ui can show history.

### oumi

purpose:

- use reinforcement learning signals to improve summary quality over time.

how to integrate:

- capture user feedback in the ui: thumbs up / thumbs down or a 1-5 rating.
- endpoint: `POST /api/docs/:id/feedback { runId, rating, notes }`.
- pipeline:
  1. save feedback to db
  2. call an oumi adapter that converts feedback into a reward signal
  3. queue a small finetune or re-ranking job (or, at minimum, use oumi as a judge to rank multiple candidate summaries)

practical/fast approach for hackathon:

- use oumi's `llm-as-judge` to compare two or three candidate summaries and pick the best one; store the judge score as a reward.
- show that feedback influences which summary type is presented first.

## notes:

if you want this turned into a shorter cheatsheet or a flow diagram (text form), i can add it. otherwise this document should be enough to implement and demo the full toolchain.

- do not try to run large RL training during the hackathon; show the pipeline and run small sample updates or use oumi's judge mode.

### vercel

purpose:

- deploy the dashboard publicly---

if you want this turned into a shorter cheatsheet or a flow diagram (text form), i can add it. otherwise this document should be enough to implement and demo the full toolchain. for judges.

how to integrate:

- deploy only `apps/dashboard` to vercel (the extension is a static build in `apps/extension` you can publish separately if needed).
- use vercel environment variables for kestra endpoint, oumi adapter endpoint, storage connection, and github tokens if you use cline in the cloud.

self-hosting considerations:

- provide a docker-compose that spins up the next app + a local kestra adapter + local storage. the readme should explain how to switch config between vercel and local.

### coderabbit

purpose:

- automatic pr reviews, suggestions, and documentation improvements in the repo.

how to integrate:

- enable coderabbit in the repo and create a few deliberate PRs: initial structure, extension, dashboard, kestra workflows.
- keep the PRs small and descriptive so coderabbit feedback is visible.
- capture coderabbit comments as part of the project demo (screenshot or link).

notes:

- coderabbit runs in github actions context; no code changes needed beyond opening PRs.

---

## api surface (recommended)

- `POST /api/docs` - save captured markdown. returns `{ id }`.
- `GET /api/docs` - list docs.
- `GET /api/docs/:id` - get doc and metadata.
- `POST /api/docs/:id/summarize` - trigger kestra summary run.
- `GET /api/docs/:id/summarize/:runId` - fetch summary result.
- `POST /api/docs/:id/feedback` - submit user feedback (oumi signal).
- `POST /api/docs/:id/generate` - trigger cline project generation. returns job id.
- `GET /api/jobs/:jobId` - fetch job status and logs.
- `GET /api/artifacts/:artifactId` - download generated zip.

---

## developer workflow and ci

- repo structure uses turborepo. keep extension and dashboard in `apps/`.
- make small, focused PRs and let coderabbit comment.
- implement job queue (simple redis or database queue) for cline and kestra runs.
- use github actions for basic lint and tests. avoid heavy ci steps to keep demo fast.

---

## demo checklist (what to show to judges)

- capture a real documentation page with the extension and save it to dashboard
- run kestra summary and show result
- submit feedback and show that oumi judge or feedback is recorded
- trigger cline to generate a starter project and download the artifact
- show job logs and cline output
- show the repo with coderabbit comments on at least one PR
- provide vercel link to the deployed dashboard and instructions to run locally (docker-compose)

---

## self-hosting notes

- provide `docker-compose.yml` that runs:
  - next.js app (dashboard)
  - a small kestra adapter (or point to a remote kestra)
  - optional local oumi adapter (or fallback to judge-only mode)
  - storage (local volume or s3-compatible)

- document how to switch environment variables between vercel and local.
- keep cline invocation as a local subprocess in docker so it works in a self-hosted environment.

---

## troubleshooting tips

- if cline fails, check logs in `jobs` and ensure the cli is installed in the container image.
- if kestra runs fail, ensure the workflow payload is valid and the kestra server url is reachable from the dashboard.
- if oumi adapter doesn't accept rewards, fall back to storing feedback and demonstrating judge-only ranking.

---

## appendix: minimal job event flow

1. extension -> `POST /api/docs` (store markdown)
2. ui -> `POST /api/docs/:id/summarize` (creates kestra run, returns run id)
3. kestra executes workflow, writes summary to db
4. ui polls `GET /api/docs/:id/summarize/:runId` and shows summary
5. user gives feedback -> `POST /api/docs/:id/feedback` -> oumi adapter consumes reward
6. user triggers generate -> `POST /api/docs/:id/generate` -> backend enqueues cline job -> cline runs -> artifact saved -> ui shows download link
