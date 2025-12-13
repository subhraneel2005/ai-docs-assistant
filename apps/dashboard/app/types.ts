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

// KESTRA TYPES
interface KestraSummarizerInputPayload {
  markdown: string;
  tone: SummaryTones;
  summary_style: SummaryStyles;
  preserve_code: boolean;
}

export enum SummaryTones {
  professional = "professional",
  friendly = "friendly",
  neutral = "neutral",
  technical = "technical",
  casual = "casual",
  concise = "concise",
}

export enum SummaryStyles {
  auto = "auto",
  brief = "brief",
  standard = "standard",
  detailed = "detailed",
  bullet_points = "bullet_points",
}

interface KestraSummarizerOutputResponse {
  summary: string;
  metadata: KestraResponseMetadata;
}

interface KestraResponseMetadata {
  word_count: number;
  complexity: string;
  tone: string;
  style: SummaryStyles;
}

export type {
  NewDocPayload,
  Doc,
  Summary,
  KestraSummarizerInputPayload,
  KestraSummarizerOutputResponse,
};
