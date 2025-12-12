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

export type { NewDocPayload };
