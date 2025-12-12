"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Doc } from "./types";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Home() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/docs/all");
        if (!res.ok) throw new Error("Failed to fetch");

        const data: Doc[] = await res.json();
        setDocs(data);
      } catch (err) {
        setError("Could not load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const truncate = (markdown: string, len = 200) => {
    if (markdown.length <= len) return markdown;
    return markdown.slice(0, len) + " ...";
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Docs Assistant Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {docs.map((doc) => {
          const isOpen = expandedId === doc.id;
          const content = isOpen ? doc.markdown : truncate(doc.markdown);

          return (
            <Card
              key={doc.id}
              onClick={() => toggleExpand(doc.id)}
              className="cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex gap-2 items-center">
                  <CardTitle>{doc.title}</CardTitle>
                  <Link
                    href={doc.pageUrl}
                    target="_blank"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <ExternalLink size={20} className="text-blue-500 " />
                  </Link>
                </div>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(doc.createdAt).toLocaleString()}
                </p>

                {/* Animated height for smooth open/close */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[9999px]" : "max-h-[120px]"
                  }`}
                >
                  <Markdown>{content}</Markdown>
                </div>

                {!isOpen && (
                  <div className="flex items-center gap-3 mt-4">
                    {/* Summarise Doc */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Summarise doc:", doc.id);
                            }}
                          >
                            Summarise this Doc
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Generate an AI-powered summary of this document
                            using Kestra AI Agent.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Generate Starter Code */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Generate starter code for:", doc.id);
                            }}
                          >
                            Generate Starter Code
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Creates boilerplate code based on this
                            document&apos;s content using Cline.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <ButtonGroup className="cursor-pointer">
                      <Button variant={"outline"}>Click to expand</Button>
                      <Button variant={"outline"}>
                        <ArrowDown />
                      </Button>
                    </ButtonGroup>
                  </div>
                )}
                {isOpen && (
                  <ButtonGroup className="cursor-pointer">
                    <Button variant={"outline"}>Click to collapse</Button>
                    <Button variant={"outline"}>
                      <ArrowUp />
                    </Button>
                  </ButtonGroup>
                )}

                <div className="flex flex-wrap gap-2">
                  {doc.summaries?.map((sum) => (
                    <Badge key={sum.id} variant="secondary">
                      {sum.type || "summary"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
