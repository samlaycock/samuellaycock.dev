import {
  WorkflowEntrypoint,
  WorkflowStep,
  WorkflowEvent,
} from "cloudflare:workers";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { MODELS, PROMPT } from "./ai";
import { logger } from "./logger";

interface WebsiteGeneration {
  date: string; // ISO date string (YYYY-MM-DD)
  indexKey: string; // Key for the index.html file (index.html_YYYY-MM-DD)
  html: string; // The complete HTML content
  metadata: {
    model: string;
    timestamp: number;
    generation: {
      durationMs: number;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      cost?: number;
    };
  };
}

/**
 * Fetches cost information from OpenRouter's generation endpoint
 */
async function fetchGenerationCost(
  generationId: string | undefined,
  apiKey: string,
): Promise<number | undefined> {
  if (!generationId) {
    return undefined;
  }

  try {
    const generationResponse = await fetch(
      `https://openrouter.ai/api/v1/generation?id=${generationId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (generationResponse.ok) {
      const generationData = (await generationResponse.json()) as any;
      // OpenRouter returns cost in USD
      return generationData.data?.total_cost;
    }
  } catch (error) {
    logger.error({ error, generationId }, "Failed to fetch cost information");
  }

  return undefined;
}

export class WebsiteGeneratorWorkflow extends WorkflowEntrypoint<Env> {
  async run(event: Readonly<WorkflowEvent<unknown>>, step: WorkflowStep) {
    logger.info("Starting website generation workflow");

    // Step 1: Select a random model from Open Router
    const model = await step.do("select-random-model", async () => {
      const randomIndex = Math.floor(Math.random() * MODELS.length);
      const selectedModel = MODELS[randomIndex];
      logger.info({ model: selectedModel }, "Selected random model");
      return selectedModel;
    });

    // Step 2: Generate the website using the selected model
    const websiteFiles = await step.do(
      "generate-website",
      {
        retries: {
          limit: 0,
          delay: "1 second",
          backoff: "constant",
        },
      },
      async () => {
        logger.info({ model }, "Generating website with LLM");
        const startTime = Date.now();

        // Create OpenRouter client
        const openrouter = createOpenRouter({
          apiKey: this.env.OPENROUTER_API_KEY,
        });

        // Define the schema for the website generation
        const websiteSchema = z.object({
          html: z
            .string()
            .describe(
              "Complete self-contained HTML document with all CSS in <style> tags and all JavaScript in <script> tags",
            ),
        });

        // Generate the website using structured output
        const result = await generateObject({
          model: openrouter(model),
          schema: websiteSchema,
          prompt: PROMPT,
        });

        const endTime = Date.now();
        const durationMs = endTime - startTime;

        logger.info({ durationMs, model }, "Website generated successfully");

        // Extract usage data from the response
        const usage = result.usage;

        // Fetch cost information from OpenRouter
        const cost = await fetchGenerationCost(
          result.response?.id,
          this.env.OPENROUTER_API_KEY,
        );

        logger.info(
          {
            promptTokens: usage.inputTokens,
            completionTokens: usage.outputTokens,
            totalTokens: usage.totalTokens,
            cost,
          },
          "Token usage and cost",
        );

        // Generate date string in ISO format (YYYY-MM-DD)
        const now = new Date();
        const dateString = now.toISOString().split("T")[0];

        // Create the index.html key with date
        const indexKey = `index.html_${dateString}`;

        const response: WebsiteGeneration = {
          date: dateString,
          indexKey,
          html: result.object.html,
          metadata: {
            model,
            timestamp: now.getTime(),
            generation: {
              durationMs,
              promptTokens: usage.inputTokens ?? 0,
              completionTokens: usage.outputTokens ?? 0,
              totalTokens: usage.totalTokens ?? 0,
              cost,
            },
          },
        };

        return response;
      },
    );

    // Step 3: Store HTML and metadata in KV
    await step.do("store-website", async () => {
      // Store the raw HTML with metadata attached to the KV entry
      await this.env.WEBSITE_KV.put(websiteFiles.indexKey, websiteFiles.html, {
        metadata: websiteFiles.metadata,
      });
    });

    logger.info(
      {
        date: websiteFiles.date,
        model,
        indexKey: websiteFiles.indexKey,
      },
      "Website generation workflow completed successfully",
    );

    return {
      success: true,
      date: websiteFiles.date,
      model,
      indexKey: websiteFiles.indexKey,
    };
  }
}
