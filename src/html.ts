interface GenerationMetadata {
  model: string;
  timestamp: number;
  generation: {
    durationMs: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost?: number;
  };
}

interface InjectMetadataOptions {
  html: string;
  date: string;
  metadata: GenerationMetadata;
}

/**
 * Injects generation metadata into HTML using HTMLRewriter
 */
export function injectMetadata(options: InjectMetadataOptions): Response {
  const { html, date, metadata } = options;

  const metadataScript = `<script id="generation-metadata">
(function() {
  // Generation metadata
  const metadata = ${JSON.stringify({ ...metadata, date }, null, 2)};

  // Log to console
  console.group('🎨 Website Generation Info');
  console.log('Date:', '${date}');
  console.log('Model:', metadata.model);
  console.log('Timestamp:', new Date(metadata.timestamp).toLocaleString());
  console.log('Generation Time:', metadata.generation.durationMs + 'ms');
  console.log('Tokens:', {
    prompt: metadata.generation.promptTokens,
    completion: metadata.generation.completionTokens,
    total: metadata.generation.totalTokens
  });
  if (metadata.generation.cost) {
    console.log('Cost:', '$' + metadata.generation.cost.toFixed(4));
  }
  console.groupEnd();

  // Create info button and dialog
  const style = document.createElement('style');
  style.textContent = \`
    #gen-info-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 24px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      z-index: 10000;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
      white-space: nowrap;
    }
    #gen-info-btn:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    #gen-info-dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      max-width: 500px;
      width: calc(100% - 32px);
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      background: white;
      color: black;
    }
    #gen-info-dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }
    .gen-info-content {
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    @media (min-width: 640px) {
      .gen-info-content {
        padding: 24px;
      }
    }
    .gen-info-content h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
    }
    .gen-info-content dl {
      margin: 0;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 16px;
    }
    .gen-info-content dt {
      font-weight: 600;
      color: #666;
    }
    .gen-info-content dd {
      margin: 0;
    }
    .gen-info-close {
      margin-top: 20px;
      padding: 10px 20px;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
      font-size: 14px;
    }
  \`;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = 'gen-info-btn';
  button.innerHTML = '🤖 Generated with AI';
  button.setAttribute('aria-label', 'View generation info');
  button.onclick = () => dialog.showModal();

  const dialog = document.createElement('dialog');
  dialog.id = 'gen-info-dialog';
  dialog.innerHTML = \`
    <div class="gen-info-content">
      <div autofocus tabindex="-1" style="outline: none;"></div>
      <h2>🎨 AI-Generated Website</h2>
      <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
        This website is completely regenerated every night at midnight by a different AI model.
        Each day brings a unique design, created from scratch with full creative freedom.
        The entire page—HTML, CSS, and JavaScript—is generated in a single request.
      </p>
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">Generation Details</h3>
      <dl>
        <dt>Date:</dt><dd>\${metadata.date}</dd>
        <dt>Model:</dt><dd>\${metadata.model}</dd>
        <dt>Timestamp:</dt><dd>\${new Date(metadata.timestamp).toLocaleString()}</dd>
        <dt>Generation Time:</dt><dd>\${metadata.generation.durationMs}ms</dd>
        <dt>Prompt Tokens:</dt><dd>\${metadata.generation.promptTokens.toLocaleString()}</dd>
        <dt>Completion Tokens:</dt><dd>\${metadata.generation.completionTokens.toLocaleString()}</dd>
        <dt>Total Tokens:</dt><dd>\${metadata.generation.totalTokens.toLocaleString()}</dd>
        \${metadata.generation.cost ? '<dt>Cost:</dt><dd>$' + metadata.generation.cost.toFixed(4) + '</dd>' : ''}
      </dl>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px;">View Another Date</h3>
        <div style="display: flex; gap: 8px;">
          <input
            type="date"
            id="date-picker"
            value="\${metadata.date}"
            tabindex="-1"
            style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;"
          />
          <button
            onclick="const date = document.getElementById('date-picker').value; if (date) window.location.href = '/?date=' + date;"
            style="padding: 8px 16px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; white-space: nowrap;"
          >
            Go
          </button>
        </div>
      </div>
      <button class="gen-info-close" onclick="this.closest('dialog').close()">Close</button>
    </div>
  \`;

  document.body.appendChild(button);
  document.body.appendChild(dialog);

  // Store in window for programmatic access
  window.__GENERATION_METADATA__ = metadata;
})();
</script>`;

  // Create favicon link to inject in head
  const faviconLink = `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`;

  // Use HTMLRewriter to inject the favicon in <head> and script in <body>
  const rewriter = new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append(faviconLink, { html: true });
      },
    })
    .on("body", {
      element(element) {
        element.append(metadataScript, { html: true });
      },
    });

  return rewriter.transform(
    new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }),
  );
}
