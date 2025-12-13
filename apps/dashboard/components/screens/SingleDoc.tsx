"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Doc, SummaryTones, SummaryStyles } from "@/app/types";

interface SingleDocProps {
  doc: Doc;
}

export default function SingleDoc({ doc }: SingleDocProps) {
  const [tone, setTone] = useState<SummaryTones>(SummaryTones.professional);
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyles>(
    SummaryStyles.auto
  );
  const [preserveCode, setPreserveCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setGeneratedSummary(null);

    try {
      const response = await fetch("/api/docs/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markdown: doc.markdown,
          tone,
          summary_style: summaryStyle,
          preserve_code: preserveCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();

      if (data.summary) {
        setGeneratedSummary(data.summary);
      } else {
        throw new Error(data.error || "Failed to generate summary");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* AI Summarizer Card */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-xl">AI Summarizer</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
            >
              {showOptions ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showOptions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              {/* Tone Selection */}
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(value) => setTone(value as SummaryTones)}
                >
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SummaryTones.professional}>
                      Professional
                    </SelectItem>
                    <SelectItem value={SummaryTones.friendly}>
                      Friendly
                    </SelectItem>
                    <SelectItem value={SummaryTones.neutral}>
                      Neutral
                    </SelectItem>
                    <SelectItem value={SummaryTones.technical}>
                      Technical
                    </SelectItem>
                    <SelectItem value={SummaryTones.casual}>Casual</SelectItem>
                    <SelectItem value={SummaryTones.concise}>
                      Concise
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Summary Style Selection */}
              <div className="space-y-2">
                <Label htmlFor="style">Summary Style</Label>
                <Select
                  value={summaryStyle}
                  onValueChange={(value) =>
                    setSummaryStyle(value as SummaryStyles)
                  }
                >
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SummaryStyles.auto}>
                      Auto (Recommended)
                    </SelectItem>
                    <SelectItem value={SummaryStyles.brief}>
                      Brief (2-3 sentences)
                    </SelectItem>
                    <SelectItem value={SummaryStyles.standard}>
                      Standard (1 paragraph)
                    </SelectItem>
                    <SelectItem value={SummaryStyles.detailed}>
                      Detailed (Multiple paragraphs)
                    </SelectItem>
                    <SelectItem value={SummaryStyles.bullet_points}>
                      Bullet Points
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preserve Code Checkbox */}
              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id="preserve-code"
                  checked={preserveCode}
                  onCheckedChange={(checked) =>
                    setPreserveCode(checked as boolean)
                  }
                />
                <Label
                  htmlFor="preserve-code"
                  className="text-sm font-normal cursor-pointer"
                >
                  Preserve code blocks in summary
                </Label>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Summary
              </>
            )}
          </Button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Generated Summary */}
          {generatedSummary && (
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Generated Summary
              </h4>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown>{generatedSummary}</Markdown>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Original Document Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{doc.title}</CardTitle>
          {doc.description && (
            <p className="text-sm text-muted-foreground">{doc.description}</p>
          )}
        </CardHeader>

        <CardContent className="prose max-w-none dark:prose-invert">
          <Markdown>{doc.markdown}</Markdown>
        </CardContent>
      </Card>

      {/* Existing Summaries */}
      {doc.summaries?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Summaries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {doc.summaries.map((summary) => (
              <div
                key={summary.id}
                className="border rounded-md p-4 bg-muted/30"
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {summary.content}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
