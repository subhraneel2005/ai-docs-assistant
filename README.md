# ai docs assistant

ai docs assistant is a self-hostable tool that helps you capture any documentation page, turn it into clean markdown, and process it inside a simple dashboard. the goal is to make reading and understanding docs easier by giving you a single place where you can store, summarize, and generate things from them.

the project includes a browser extension for grabbing content from the web and a dashboard for viewing and running ai actions on the saved markdown. everything stays under your control and can run locally or on your own server.

---

## what this project does

- captures documentation pages using a chrome extension
- converts the page into clean markdown
- saves the markdown to your dashboard
- lets you run summaries, explanations, and breakdowns on any saved doc
- improves summary quality over time using reinforcement feedback
- can generate starter code or project scaffolding using the cline cli
- works fully self-hosted
- dashboard can be deployed on vercel

---

## main features

- browser extension to extract content directly from any url
- markdown cleaner for consistent formatting
- dashboard to view, organize, and process saved docs
- kestra ai workflows for different types of summaries
- oumi reinforcement loop to refine results based on your feedback
- cline integration to turn documentation into working starter code
- simple and minimal ui
- monorepo structure using turborepo

---

## tools and tech used

**next.js**
dashboard and backend api routes.

**chrome extension (plasmo)**
used for capturing content and sending it to the backend.

**kestra ai agent**
handles summarization and doc processing workflows.

**oumi**
used for reinforcement learning based on user feedback.

**cline cli**
generates starter code or scaffolding from the captured markdown.

**vercel**
deployment target for the dashboard.

**docker (planned)**
for self-hostable packaging.

**turborepo**
manages the dashboard, extension, and shared packages in one codebase.

---

## structure

- extension: captures and sends markdown
- dashboard: ui and api
- shared: utils and types
- cline automation: scripts to trigger code generation
