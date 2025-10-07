const OPENAI_MODELS = [
  "openai/gpt-5-pro",
  "openai/gpt-5-codex",
  "openai/gpt-5-chat",
  "openai/gpt-5",
  "openai/gpt-5-mini",
  "openai/gpt-5-nano",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
];

const GOOGLE_MODELS = [
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
];

const DEEPSEEK_MODELS = [
  "deepseek/deepseek-v3.1-terminus",
  "deepseek/deepseek-chat-v3.1",
  "deepseek/deepseek-r1-0528",
];

const QWEN_MODELS = [
  "qwen/qwen3-vl-235b-a22b-thinking",
  "qwen/qwen3-vl-235b-a22b-instruct",
  "qwen/qwen3-coder-plus",
  "qwen/qwen3-next-80b-a3b-thinking",
  "qwen/qwen3-next-80b-a3b-instruct",
  "qwen/qwen-plus-2025-07-28",
  "qwen/qwen3-coder-30b-a3b-instruct",
];

const X_AI_MODELS = ["x-ai/grok-4-fast", "x-ai/grok-code-fast-1"];

const Z_AI_MODELS = ["z-ai/glm-4.6", "z-ai/glm-4.5v"];

const ALIBABA_MODELS = [
  "alibaba/tongyi-deepresearch-30b-a3b:free",
  "alibaba/tongyi-deepresearch-30b-a3b",
];

const NVIDIA_MODELS = [
  "nvidia/nemotron-nano-9b-v2:free",
  "nvidia/nemotron-nano-9b-v2",
];

const BAIDU_MODELS = ["baidu/ernie-4.5-21b-a3b", "baidu/ernie-4.5-vl-28b-a3b"];

const NOUSRESEARCH_MODELS = [
  "nousresearch/hermes-4-70b",
  "nousresearch/hermes-4-405b",
];

const MOONSHOTAI_MODELS = ["moonshotai/kimi-k2-0905"];

const ARCEE_AI_MODELS = ["arcee-ai/afm-4.5b"];

const OPENGVLAB_MODELS = ["opengvlab/internvl3-78b"];

const DEEPCOGITO_MODELS = ["deepcogito/cogito-v2-preview-llama-109b-moe"];

const STEPFUN_AI_MODELS = ["stepfun-ai/step3"];

export const MODELS = [
  ...OPENAI_MODELS,
  ...GOOGLE_MODELS,
  ...DEEPSEEK_MODELS,
  ...QWEN_MODELS,
  // ...X_AI_MODELS,
  // ...Z_AI_MODELS,
  // ...ALIBABA_MODELS,
  // ...NVIDIA_MODELS,
  // ...BAIDU_MODELS,
  // ...NOUSRESEARCH_MODELS,
  // ...MOONSHOTAI_MODELS,
  // ...ARCEE_AI_MODELS,
  // ...OPENGVLAB_MODELS,
  // ...DEEPCOGITO_MODELS,
  // ...STEPFUN_AI_MODELS,
];

export const PROMPT = `You are generating a SINGLE PAGE website for Samuel Laycock, a Director of Software Engineering at World 50.

CRITICAL ACCURACY REQUIREMENT:
- This is a TECH DEMO showcasing your creative and technical capabilities
- You MUST display ONLY the factual information provided: "Samuel Laycock, Director of Software Engineering at World 50"
- DO NOT invent, fabricate, or add ANY other information about career history, achievements, projects, or personal details
- DO NOT create fake portfolio items, past roles, testimonials, or biographical information
- The focus should be on the creative presentation and interactivity, NOT on expanding the career narrative

THINK DIFFERENTLY - AVOID GENERIC OUTPUT:
- Do NOT create safe, corporate, or generic designs
- Do NOT use common portfolio templates or standard layouts
- PUSH boundaries and take creative risks
- Make something MEMORABLE and UNEXPECTED that stands out
- This should feel like an art piece or experimental demo, not a traditional professional website

VISUAL STYLE REQUIREMENTS:
- Choose ONE distinct visual style and commit to it fully throughout the entire design
- Style options (pick ONE and execute it boldly):
  * Skeuomorphism (realistic textures, shadows, 3D elements)
  * Brutalism (raw, bold, stark, unconventional layouts)
  * Glassmorphism (frosted glass effects, transparency, depth)
  * Neomorphism (soft shadows, subtle 3D, minimal)
  * Bento grids (card-based layouts, clear sections)
  * Kinetic typography (animated, dynamic text as the hero)
  * 3D rendering (Three.js/WebGL style 3D graphics)
  * Vaporwave/Retrowave (80s/90s aesthetic, neon, grids)
  * Swiss/International (grid-based, clean, typographic)
  * Maximalism (MORE is MORE - patterns, colors, elements)
  * Or invent your own unique style direction
- Be BOLD and VIBRANT with colors - avoid muted or safe palettes
- Use striking color combinations that create visual impact
- Ensure all elements consistently follow your chosen style

CREATIVE FREEDOM:
Make something interesting and unexpected! Ideas to consider (or invent your own):
- An interactive art piece or generative art
- A mini-game or puzzle
- A poetic or philosophical experience
- An educational demo or visualization
- A fun interactive tool or calculator
- Something surreal and experimental
- A data visualization or animation showcase
- An experimental UI/UX concept

PERFORMANCE REQUIREMENTS - CRITICAL:
- BE EXTREMELY CAREFUL about performance - this will run in real browsers on real devices
- ALWAYS use requestAnimationFrame for animations, NEVER setInterval for visual updates
- Debounce or throttle event handlers (scroll, resize, mousemove) to avoid performance issues
- Limit DOM manipulations - batch updates when possible, use CSS transforms over layout changes
- For particle systems or animations: keep particle counts reasonable (<1000), use object pooling
- Optimize canvas/WebGL rendering - don't redraw unnecessarily, use dirty rectangles when possible
- Lazy load or defer non-critical JavaScript execution
- Use CSS hardware acceleration (transform, opacity) for smooth animations
- Test performance mentally as you write - if something might cause jank or lag, optimize it
- Prefer CSS animations over JavaScript when possible for better performance
- If using heavy computations, consider using Web Workers or breaking work into chunks
- MAKE ABSOLUTELY SURE your demo runs smoothly at 60fps on average hardware

Technical requirements:
- The website MUST be a SINGLE PAGE (no navigation to other pages)
- ALL CSS must be inline within <style> tags in the HTML OR load fonts from Google Fonts (https://fonts.googleapis.com)
- ALL JavaScript must be inline within <script> tags in the HTML OR load libraries from ESM (https://esm.sh/)
- HTML must be complete with proper DOCTYPE, meta tags, and all necessary structure
- The website should work immediately when loaded in a browser
- Images must be inline via data URIs or SVG (no external image URLs)
- For fonts: Use Google Fonts (https://fonts.googleapis.com and https://fonts.gstatic.com)
- For JavaScript libraries: Use ESM CDN (https://esm.sh/) with ES module imports`;
