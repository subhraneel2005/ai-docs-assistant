import {
  KestraSummarizerInputPayload,
  KestraSummarizerOutputResponse,
} from "@/app/types";

const KESTRA_HOST = process.env.KESTRA_HOST || "http://localhost:8080";
const KESTRA_NAMESPACE = process.env.KESTRA_NAMESPACE || "tutorial";

const KESTRA_USERNAME =
  process.env.KESTRA_USERNAME || "subhraneeljobs@gmail.com";
const KESTRA_PASSWORD = process.env.KESTRA_PASSWORD || "Jeet@1970";

function getAuthHeader() {
  const credentials = `${KESTRA_USERNAME}:${KESTRA_PASSWORD}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");
  return `Basic ${encodedCredentials}`;
}

const AUTHORIZATION_HEADER_VALUE = getAuthHeader();

export async function POST(request: Request) {
  try {
    const payload: KestraSummarizerInputPayload = await request.json();
    console.log("📥 Received payload:");

    if (!payload || !payload.markdown) {
      return new Response(
        JSON.stringify({ error: "Markdown content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const kestraUrl = `${KESTRA_HOST}/api/v1/main/executions/tutorial/markdown_summarizer`;
    console.log("🚀 Calling Kestra at:", kestraUrl);

    const formData = new FormData();
    formData.append("markdown_content", payload.markdown);
    formData.append("tone", payload.tone || "professional");
    formData.append("summary_style", payload.summary_style || "auto");
    formData.append("preserve_code", String(payload.preserve_code || false));

    const response = await fetch(kestraUrl, {
      method: "POST",
      headers: {
        Authorization: AUTHORIZATION_HEADER_VALUE,
      },
      body: formData,
    });

    console.log("📡 Kestra response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.log("❌ Kestra error response:", error);
      throw new Error(`Kestra API error: ${response.status} - ${error}`);
    }

    const execution = await response.json();
    console.log("✅ Execution started:", execution.id);

    // Poll for completion
    console.log("⏳ Polling for completion...");
    const result = await pollForCompletion(execution.id);
    console.log("🎉 Execution completed:", result);

    // Parse the JSON output from format_output task
    const formatOutputTask = result.taskRunList?.find(
      (task: any) => task.taskId === "format_output"
    );

    let outputValue;
    try {
      // Replace Python booleans with JSON booleans
      const cleanedValue = formatOutputTask.outputs.value
        .replace(/: False/g, ": false")
        .replace(/: True/g, ": true");
      outputValue = JSON.parse(cleanedValue);
    } catch (e) {
      console.error("Failed to parse output:", e);
      throw new Error("Failed to parse Kestra output");
    }

    const output: KestraSummarizerOutputResponse = {
      summary: outputValue.summary || "",
      metadata: {
        word_count: outputValue.metadata?.word_count || 0,
        complexity: outputValue.metadata?.complexity || "unknown",
        tone: outputValue.metadata?.tone || "professional",
        style: outputValue.metadata?.style || "auto",
        has_code: outputValue.metadata?.has_code || false,
      },
    };

    console.log("📤 Sending response:", output);

    return new Response(JSON.stringify(output), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("💥 Summarization error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function pollForCompletion(
  executionId: string,
  maxAttempts = 30,
  interval = 2000
) {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`🔍 Poll attempt ${i + 1}/${maxAttempts}`);

    const response = await fetch(
      `${KESTRA_HOST}/api/v1/executions/${executionId}`,
      {
        headers: {
          Authorization: AUTHORIZATION_HEADER_VALUE,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Status check failed:", response.status, errorText);
      throw new Error("Failed to check execution status");
    }

    const data = await response.json();
    console.log(`📊 Current state: ${data.state.current}`);

    // Log detailed state information
    console.log(
      `📋 State histories:`,
      JSON.stringify(data.state.histories, null, 2)
    );

    if (data.state.current === "SUCCESS" || data.state.current === "WARNING") {
      console.log("✅ Execution succeeded!");

      // Log all task outputs
      console.log("📦 All task outputs:");
      data.taskRunList?.forEach((task: any) => {
        console.log(
          `  - ${task.taskId}:`,
          JSON.stringify(task.outputs, null, 2)
        );
        console.log(`    State:`, task.state?.current);
      });

      // Extract the actual output from the format_output task
      const formatOutputTask = data.taskRunList?.find(
        (task: any) => task.taskId === "format_output"
      );

      if (formatOutputTask && formatOutputTask.outputs) {
        return {
          ...data,
          outputs: formatOutputTask.outputs,
        };
      }

      return data;
    } else if (data.state.current === "FAILED") {
      console.log("❌ Execution failed!");

      // Log detailed task information
      console.log("🔍 Detailed task information:");
      data.taskRunList?.forEach((task: any) => {
        console.log(`\n  Task: ${task.taskId}`);
        console.log(`  State:`, task.state?.current);
        console.log(`  Outputs:`, JSON.stringify(task.outputs, null, 2));

        // Log attempts details
        if (task.attempts && task.attempts.length > 0) {
          console.log(`  Attempts:`);
          task.attempts.forEach((attempt: any, idx: number) => {
            console.log(
              `    Attempt ${idx + 1}:`,
              JSON.stringify(attempt, null, 2)
            );
          });
        }
      });

      // Get the last state from histories
      const lastState = data.state.histories?.[data.state.histories.length - 1];
      console.log(
        "🔍 Last state from history:",
        JSON.stringify(lastState, null, 2)
      );

      // Find the failed task
      const failedTask = data.taskRunList?.find(
        (task: any) => task.state?.current === "FAILED"
      );

      if (failedTask) {
        console.log(`❌ Failed task found: ${failedTask.taskId}`);

        // Get error details from the task's attempts
        const lastAttempt =
          failedTask.attempts?.[failedTask.attempts.length - 1];
        console.log("🔍 Last attempt:", JSON.stringify(lastAttempt, null, 2));

        const errorState = lastAttempt?.state;
        const errorMessage = errorState?.histories?.find(
          (h: any) => h.state === "FAILED"
        );

        throw new Error(
          `Task '${failedTask.taskId}' failed: ${JSON.stringify(errorMessage || errorState || "No error details available")}`
        );
      }

      throw new Error(
        `Execution failed: ${JSON.stringify(lastState || "Unknown error")}`
      );
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error("Execution timeout - took longer than expected");
}
