## project workflow for ai docs assistant

this document explains how the current version of ai docs assistant works, what is implemented, and what is planned. it is written to reflect the actual demo and submission state.

this project is a single turborepo with `apps/extension`, `apps/dashboard`, and `packages/shared`.

---

## goals

* demonstrate a working end-to-end docs capture and summarization flow
* use kestra’s built-in ai agent in a real workflow
* keep the system self-hostable while deploying the dashboard on vercel
* keep architecture simple and understandable for judges

---

## high-level architecture

* **chrome extension**
  captures documentation pages, converts them to clean markdown, and sends them to the dashboard api.

* **dashboard (next.js)**
  stores markdown, triggers kestra workflows, and displays summaries.

* **shared packages**
  markdown cleanup utilities and shared types.

---

## core workflow (implemented)

1. user opens a documentation page
2. chrome extension captures the content and converts it to markdown
3. extension sends the markdown to `POST /api/docs`
4. user triggers summarization from the dashboard
5. dashboard calls a local kestra workflow
6. kestra ai agent generates a summary based on tone, style, and length
7. summary is returned and shown in the dashboard

---

## tool-by-tool status

### kestra (used)

status: implemented

kestra is actively used for summarization.

* runs locally using docker
* uses kestra’s built-in ai agent
* workflow steps:

  * analyze markdown length and structure
  * generate summary based on user-selected tone and style
  * format output for display

kestra is triggered from the dashboard and returns results synchronously for demo purposes.

[https://kestra.io/](https://kestra.io/)

---

### vercel (used)

status: implemented

the next.js dashboard is deployed on vercel and live.

[https://ai-docs-assistant-dashboard.vercel.app/](https://ai-docs-assistant-dashboard.vercel.app/)

kestra continues to run locally and is accessed via configuration.

[https://vercel.com/](https://vercel.com/)

---

### cline (planned)

status: planned

cline is planned to be used to generate starter code or scaffolding directly from captured documentation. this would bridge the gap between reading docs and starting implementation.

not wired into the current submission.

---

## demo checklist (what judges should see)

* capture a real documentation page using the chrome extension
* save it to the dashboard
* trigger kestra summarization with tone and style options
* view the generated summary
* open the live vercel deployment

---

## self-hosting notes

* dashboard runs on vercel
* kestra runs locally using docker
* extension is loaded manually from the build output
