import Link from "next/link";
import {
  Github,
  ArrowRight,
  FileText,
  Database,
  Settings,
  Cloud,
  Cpu,
  LayoutTemplate,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center space-y-8">
        <Badge
          variant="secondary"
          className="px-4 py-1.5 text-sm font-medium rounded-full"
        >
          v1.0.0 Public Release
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-4.5px] text-primary max-w-3xl">
          Read Docs 10x faster
        </h1>

        <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
          AI Docs Assistant that turns browser tabs into clean markdown and
          customised summaries. Powered by Kestra, deployed on Vercel.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href={"/dashboard"}>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="h-12 px-8 font-medium">
                  Create account or Login
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="h-12 px-8 font-medium">
                Try the Dashboard
              </Button>
            </SignedIn>
          </Link>
          <Link
            href={"https://github.com/subhraneel2005/ai-docs-assistant"}
            target="_blank"
          >
            <Button size="lg" variant="outline" className="h-12 px-8 gap-2">
              <Github className="w-4 h-4" />
              View Repo
            </Button>
          </Link>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How it Works */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-3xl font-bold tracking-[-1.4px]">Workflow</h2>
          <p className="text-muted-foreground">
            From browser to dashboard in three steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <LayoutTemplate className="w-6 h-6" />,
              title: "Capture",
              desc: "Use the Chrome extension to snapshot any documentation page instantly.",
            },
            {
              icon: <FileText className="w-6 h-6" />,
              title: "Convert",
              desc: "Engine automates the cleanup, stripping noise and converting HTML to clean Markdown.",
            },
            {
              icon: <Cpu className="w-6 h-6" />,
              title: "Summarize",
              desc: "Kestra workflows generate concise summaries based on your tone configuration.",
            },
          ].map((item, i) => (
            <Card key={i} className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 text-primary">
                  {item.icon}
                </div>
                <CardTitle className="tracking-tight">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/20 border-y border-border/50">
        <div className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-[-1.4px]">
                Built for documentation hoarders.
              </h2>
              <p className="text-lg text-muted-foreground">
                Stop bookmarking. Start indexing. A self-hostable solution to
                manage technical knowledge bases effectively.
              </p>
              <div className="flex flex-col gap-4 pt-4">
                {[
                  "One-click Markdown capture",
                  "Configurable summary tone & length",
                  "Self-hostable Kestra backend",
                  "Zero-config Vercel deployment",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Capture Config
                    </CardTitle>
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-2 w-16 bg-muted rounded" />
                    <div className="h-8 w-full bg-secondary rounded-md border border-border/50 flex items-center px-3 text-sm text-muted-foreground">
                      summary_style: &quot;technical&quot;
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-12 bg-muted rounded" />
                    <div className="h-8 w-full bg-secondary rounded-md border border-border/50 flex items-center px-3 text-sm text-muted-foreground">
                      output_format: &quot;markdown&quot;
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="opacity-80 scale-95 origin-top">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Recent Activity
                    </CardTitle>
                    <Database className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-3/4 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-[-1.4px]">Architecture</h2>
          <p className="text-muted-foreground">
            Simple, decoupled, and easy to maintain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="flex flex-col items-center text-center p-6 border-2 border-dashed shadow-none">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Chrome Extension</h3>
            <p className="text-sm text-muted-foreground">
              Captures DOM content and communicates with API.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 border-2 border-primary/20 shadow-sm">
            <div className="p-4 bg-primary text-primary-foreground rounded-full mb-4">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Next.js Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Vercel-deployed frontend for managing docs.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 border-2 border-dashed shadow-none">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Kestra Workflows</h3>
            <p className="text-sm text-muted-foreground">
              Orchestration engine for AI processing logic.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary rounded-sm" />
            <span className="font-bold tracking-tight">AI Docs Assistant</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="https://github.com/subhraneel2005/ai-docs-assistant"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com/subhraneel2005/ai-docs-assistant"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              Deploy Guide
            </Link>
            <Link
              href="https://github.com/subhraneel2005/ai-docs-assistant"
              target="_blank"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Link>
          </div>

          <p className="text-xs text-muted-foreground flex justify-center items-center">
            made with ❤️ by{" "}
            <Link href={""} target="_blank" className="text-blue-500 ml-1.5">
              Subhraneel
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
