import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { WebsiteGeneratorWorkflow } from "./workflow";
import { logger } from "./logger";
import { injectMetadata } from "./html";

type Bindings = {
  WEBSITE_KV: KVNamespace;
  OPENROUTER_API_KEY: string;
  WEBSITE_GENERATOR: Workflow;
};

export { WebsiteGeneratorWorkflow };

const app = new Hono<{ Bindings: Bindings }>();

// Add secure headers middleware with inline script support
app.use(
  "*",
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://esm.sh"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  }),
);

// Root route - serve the latest generated website
app.get("/", async (c) => {
  // Get the date parameter or use latest
  const dateParam = c.req.query("date");

  let indexKey: string;
  let date: string;

  if (dateParam) {
    indexKey = `index.html_${dateParam}`;
    date = dateParam;
  } else {
    // Get the latest index.html key by listing with prefix
    const allKeys = await c.env.WEBSITE_KV.list({
      prefix: "index.html_",
    });

    if (allKeys.keys.length === 0) {
      return c.json(
        {
          error: "Not Found",
          message: "No website generated yet",
        },
        404,
      );
    }

    // Sort keys in descending order to get the most recent (lexicographical order)
    const sortedKeys = allKeys.keys.sort((a, b) =>
      b.name.localeCompare(a.name),
    );
    indexKey = sortedKeys[0].name;
    // Extract date from key (index.html_YYYY-MM-DD)
    date = indexKey.replace("index.html_", "");
  }

  // Fetch the HTML and metadata from KV
  const result = await c.env.WEBSITE_KV.getWithMetadata(indexKey);

  if (!result.value || !result.metadata) {
    return c.json(
      {
        error: "Not Found",
        message: dateParam
          ? `No website found for date: ${dateParam}`
          : "No website found",
      },
      404,
    );
  }

  // Inject metadata into HTML using HTMLRewriter
  return injectMetadata({
    html: result.value,
    date,
    metadata: result.metadata as any,
  });
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: Date.now() });
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      path: c.req.path,
      message: "The requested resource was not found",
    },
    404,
  );
});

// Error handler
app.onError((err, c) => {
  logger.error({ err, path: c.req.path }, "Request error");
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500,
  );
});

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    logger.info(
      { cron: event.cron, scheduledTime: event.scheduledTime },
      "CRON triggered: Starting website generation workflow",
    );

    try {
      // Create a new workflow instance
      const instance = await env.WEBSITE_GENERATOR.create();

      logger.info({ workflowId: instance.id }, "Workflow instance created");

      // Wait for the workflow to complete (optional - can also run async)
      ctx.waitUntil(
        (async () => {
          const status = await instance.status();
          logger.info({ workflowId: instance.id, status }, "Workflow status");
        })(),
      );
    } catch (error) {
      logger.error({ error }, "Failed to create workflow instance");
      throw error;
    }
  },
};
