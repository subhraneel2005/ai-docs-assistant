interface NewDocPayload {
  success: boolean;
  rawContent: string;
  html: string;
  parsedMarkdown: string;
  metadata: DocPageMetadata;
}

interface DocPageMetadata {
  url: string;
  title: string;
  description: string;
  image: string | null;
  canonical: string | null;
}

interface Summary {
  id: string;
  docId: string;
  type: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface Doc {
  id: string;
  userId: string;
  markdown: string;
  title: string;
  description: string;
  image?: string | null;
  canonical?: string | null;
  pageUrl: string;
  summaries: Summary[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type { NewDocPayload, Doc, Summary };
