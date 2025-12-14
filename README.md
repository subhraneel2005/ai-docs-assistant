# ai docs assistant

ai docs assistant is a self-hostable tool that helps you capture any documentation page, turn it into clean markdown, and work with it inside a simple dashboard. the goal is to make reading and understanding docs easier by keeping everything in one place.

the project includes a chrome extension for grabbing content from the web and a next.js dashboard for viewing and running ai actions on the saved markdown. everything stays under your control and can run locally or on your own setup.

---

## what this project does

* captures documentation pages using a chrome extension
* converts the page into clean, readable markdown
* saves the markdown to your dashboard
* lets you generate summaries based on tone, style, and length
* processes docs using a kestra ai agent
* keeps everything self-hostable
* dashboard is deployed on vercel

---

## main features

* chrome extension to extract content from any documentation url
* markdown cleaner for consistent formatting
* dashboard to view, organize, and summarize saved docs
* kestra ai workflow for markdown summarization
* support for tone, summary style, and markdown length
* simple and minimal ui
* monorepo setup using turborepo

---

## tools and tech used

**next.js**
powers the dashboard and api routes.

**chrome extension (plasmo)**
used to capture webpage content and send it to the backend.

**kestra ai agent**
handles markdown analysis and summarization workflows. currently runs locally.

**vercel**
used to deploy the next.js dashboard.

**turborepo**
manages the dashboard, extension, and shared code in a single repo.

---

## kestra setup (local)

kestra is currently expected to run locally.

run:

```
docker run --pull=always --rm -it \
  -p 8080:8080 \
  --user=root \
  -v /var/run/docker.sock:/var/run/docker.sock \
  kestra/kestra:latest server local
```

then:

* open [http://localhost:8080](http://localhost:8080)
* create an account
* go to **key value pairs** and add `GEMINI_API_KEY`
* create a flow under the `tutorial` namespace
* paste the contents of `apps/dashboard/agents/markdown_summarizer_kestra.yaml`
* save the flow

once saved, the dashboard can trigger this workflow for summarization.

---

## chrome extension (local)

```
cd apps/extension
pnpm dev
```

then load the extension manually:

* open chrome extensions
* enable developer mode
* load unpacked
* select `apps/extension/build/chrome-mv3-dev`

---

## deployed dashboard

[https://ai-docs-assistant-dashboard.vercel.app/](https://ai-docs-assistant-dashboard.vercel.app/)

---

## repo structure

* `apps/extension` – chrome extension for capturing docs
* `apps/dashboard` – next.js dashboard and api
* `packages/shared` – shared utils and types

---

this project focuses on making documentation easier to work with, without locking users into a hosted service. it’s built to be simple, extendable, and fully under your control.
