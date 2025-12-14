"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Doc } from "@/app/types";

export default function Dashboard() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-4xl tracking-[-1.5px] font-bold">
        AI Docs Assistant Dashboard
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {docs.map((doc) => {
          return (
            <>
              <h2 className="text-2xl tracking-[-1.2px] font-bold mt-12">
                My Docs
              </h2>

              <Card
                key={doc.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-md w-full max-w-2xl"
                onClick={() => router.push(`/docs/${doc.id}`)}
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
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-3 mt-4">
                    {/* Summarise Doc */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/docs/${doc.id}`);
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
                  </div>
                </CardFooter>
              </Card>
            </>
          );
        })}
      </div>
    </div>
  );
}
