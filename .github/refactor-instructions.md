# Copilot Instructions

Instructions for building high-quality ReactJS applications with modern patterns, hooks, and best practices following the official React documentation at https://react.dev.
You are an expert in accessibility with deep software engineering expertise.
Instructions for creating effective and portable Agent Skills that enhance GitHub Copilot with specialized capabilities, workflows, and bundled resources.

- Follow React's naming conventions (PascalCase for components, camelCase for functions)
- Use meaningful commit messages and maintain clean git history
- Implement proper code splitting and lazy loading strategies
- Document complex components and custom hooks with JSDoc
- Use ESLint and Prettier for consistent code formatting
- Keep dependencies up to date and audit for security vulnerabilities
- Implement proper environment configuration for different deployment stages
- Use React Developer Tools for debugging and performance analysis
- Use JavaScript with ES2022 features and Node.js (20+) ESM modules
- Use Node.js built-in modules and avoid external dependencies where possible
- Ask the user if you require any additional dependencies before adding them
- Always use async/await for asynchronous code, and use 'node:util' promisify function to avoid callbacks
- Keep the code simple and maintainable
- Use descriptive variable and function names
- Do not add comments unless absolutely necessary, the code should be self-explanatory
- Never use `null`, always use `undefined` for optional values
- Prefer functions over classes
- Use the **@modelcontextprotocol/sdk** npm package: `npm install @modelcontextprotocol/sdk`
- Import from specific paths: `@modelcontextprotocol/sdk/server/mcp.js`, `@modelcontextprotocol/sdk/server/stdio.js`, etc.
- Use `McpServer` class for high-level server implementation with automatic protocol handling
- Use `Server` class for low-level control with manual request handlers
- Use **zod** for input/output schema validation: `npm install zod@3`
- Always provide `title` field for tools, resources, and prompts for better UI display
- Use `registerTool()`, `registerResource()`, and `registerPrompt()` methods (recommended over older APIs)
- Define schemas using zod: `{ inputSchema: { param: z.string() }, outputSchema: { result: z.string() } }`
- Return both `content` (for display) and `structuredContent` (for structured data) from tools
- For HTTP servers, use `StreamableHTTPServerTransport` with Express or similar frameworks
- For local integrations, use `StdioServerTransport` for stdio-based communication
- Create new transport instances per request to prevent request ID collisions (stateless mode)
- Use session management with `sessionIdGenerator` for stateful servers
- Enable DNS rebinding protection for local servers: `enableDnsRebindingProtection: true`
- Configure CORS headers and expose `Mcp-Session-Id` for browser-based clients
- Use `ResourceTemplate` for dynamic resources with URI parameters: `new ResourceTemplate('resource://{param}', { list: undefined })`
- Support completions for better UX using `completable()` wrapper from `@modelcontextprotocol/sdk/server/completable.js`
- Implement sampling with `server.server.createMessage()` to request LLM completions from clients
- Use `server.server.elicitInput()` to request additional user input during tool execution
- Enable notification debouncing for bulk updates: `debouncedNotificationMethods: ['notifications/tools/list_changed']`
- Dynamic updates: call `.enable()`, `.disable()`, `.update()`, or `.remove()` on registered items to emit `listChanged` notifications
- Use `getDisplayName()` from `@modelcontextprotocol/sdk/shared/metadataUtils.js` for UI display names
- Test servers with MCP Inspector: `npx @modelcontextprotocol/inspector`
- Keep tool implementations focused on single responsibilities
- Provide clear, descriptive titles and descriptions for LLM understanding
- Use proper TypeScript types for all parameters and return values
- Implement comprehensive error handling with try-catch blocks
- Return `isError: true` in tool results for error conditions
- Use async/await for all asynchronous operations
- Close database connections and clean up resources properly
- Validate input parameters before processing
- Use structured logging for debugging without polluting stdout/stderr
- Consider security implications when exposing file system or network access
- Implement proper resource cleanup on transport close events
- Use environment variables for configuration (ports, API keys, etc.)
- Document tool capabilities and limitations clearly
- Test with multiple clients to ensure compatibility

## Project Context

- Latest React version (React 19+)
- TypeScript for type safety (when applicable)
- Functional components with hooks as default
- Follow React's official style guide and best practices
- Use modern build tools (Vite, Create React App, or custom Webpack setup)
- Implement proper component composition and reusability patterns

## Development Standards

### Architecture

- Use functional components with hooks as the primary pattern
- Implement component composition over inheritance
- Organize components by feature or domain for scalability
- Separate presentational and container components clearly
- Use custom hooks for reusable stateful logic
- Implement proper component hierarchies with clear data flow

### TypeScript Integration

- Use TypeScript interfaces for props, state, and component definitions
- Define proper types for event handlers and refs
- Implement generic components where appropriate
- Use strict mode in `tsconfig.json` for type safety
- Leverage React's built-in types (`React.FC`, `React.ComponentProps`, etc.)
- Create union types for component variants and states

### Component Design

- Follow the single responsibility principle for components
- Use descriptive and consistent naming conventions
- Implement proper prop validation with TypeScript or PropTypes
- Design components to be testable and reusable
- Keep components small and focused on a single concern
- Use composition patterns (render props, children as functions)

### State Management

- Use `useState` for local component state
- Implement `useReducer` for complex state logic
- Leverage `useContext` for sharing state across component trees
- Consider external state management (Redux Toolkit, Zustand) for complex applications
- Implement proper state normalization and data structures
- Use React Query or SWR for server state management

### Hooks and Effects

- Use `useEffect` with proper dependency arrays to avoid infinite loops
- Implement cleanup functions in effects to prevent memory leaks
- Use `useMemo` and `useCallback` for performance optimization when needed
- Create custom hooks for reusable stateful logic
- Follow the rules of hooks (only call at the top level)
- Use `useRef` for accessing DOM elements and storing mutable values

### Styling

- Use CSS Modules, Styled Components, or modern CSS-in-JS solutions
- Implement responsive design with mobile-first approach
- Follow BEM methodology or similar naming conventions for CSS classes
- Use CSS custom properties (variables) for theming
- Implement consistent spacing, typography, and color systems
- Ensure accessibility with proper ARIA attributes and semantic HTML

### Performance Optimization

- Use `React.memo` for component memoization when appropriate
- Implement code splitting with `React.lazy` and `Suspense`
- Optimize bundle size with tree shaking and dynamic imports
- Use `useMemo` and `useCallback` judiciously to prevent unnecessary re-renders
- Implement virtual scrolling for large lists
- Profile components with React DevTools to identify performance bottlenecks

### Data Fetching

- Use modern data fetching libraries (React Query, SWR, Apollo Client)
- Implement proper loading, error, and success states
- Handle race conditions and request cancellation
- Use optimistic updates for better user experience
- Implement proper caching strategies
- Handle offline scenarios and network errors gracefully

### Error Handling

- Implement Error Boundaries for component-level error handling
- Use proper error states in data fetching
- Implement fallback UI for error scenarios
- Log errors appropriately for debugging
- Handle async errors in effects and event handlers
- Provide meaningful error messages to users

### Forms and Validation

- Use controlled components for form inputs
- Implement proper form validation with libraries like Formik, React Hook Form
- Handle form submission and error states appropriately
- Implement accessibility features for forms (labels, ARIA attributes)
- Use debounced validation for better user experience
- Handle file uploads and complex form scenarios

### Routing

- Use React Router for client-side routing
- Implement nested routes and route protection
- Handle route parameters and query strings properly
- Implement lazy loading for route-based code splitting
- Use proper navigation patterns and back button handling
- Implement breadcrumbs and navigation state management

### Testing

- Write unit tests for components using React Testing Library
- Test component behavior, not implementation details
- Use Jest for test runner and assertion library
- Implement integration tests for complex component interactions
- Mock external dependencies and API calls appropriately
- Test accessibility features and keyboard navigation

### Security

- Sanitize user inputs to prevent XSS attacks
- Validate and escape data before rendering
- Use HTTPS for all external API calls
- Implement proper authentication and authorization patterns
- Avoid storing sensitive data in localStorage or sessionStorage
- Use Content Security Policy (CSP) headers

### Accessibility

- Use semantic HTML elements appropriately
- Implement proper ARIA attributes and roles
- Ensure keyboard navigation works for all interactive elements
- Provide alt text for images and descriptive text for icons
- Implement proper color contrast ratios
- Test with screen readers and accessibility tools

## Implementation Process

1. Plan component architecture and data flow
2. Set up project structure with proper folder organization
3. Define TypeScript interfaces and types
4. Implement core components with proper styling
5. Add state management and data fetching logic
6. Implement routing and navigation
7. Add form handling and validation
8. Implement error handling and loading states
9. Add testing coverage for components and functionality
10. Optimize performance and bundle size
11. Ensure accessibility compliance
12. Add documentation and code comments

## Common Patterns

- Higher-Order Components (HOCs) for cross-cutting concerns
- Render props pattern for component composition
- Compound components for related functionality
- Provider pattern for context-based state sharing
- Container/Presentational component separation
- Custom hooks for reusable logic extraction

# Agent Safety & Governance

## Core Principles

- **Fail closed**: If a governance check errors or is ambiguous, deny the action rather than allowing it
- **Policy as configuration**: Define governance rules in YAML/JSON files, not hardcoded in application logic
- **Least privilege**: Agents should have the minimum tool access needed for their task
- **Append-only audit**: Never modify or delete audit trail entries — immutability enables compliance

## Tool Access Controls

- Always define an explicit allowlist of tools an agent can use — never give unrestricted tool access
- Separate tool registration from tool authorization — the framework knows what tools exist, the policy controls which are allowed
- Use blocklists for known-dangerous operations (shell execution, file deletion, database DDL)
- Require human-in-the-loop approval for high-impact tools (send email, deploy, delete records)
- Enforce rate limits on tool calls per request to prevent infinite loops and resource exhaustion

## Content Safety

- Scan all user inputs for threat signals before passing to the agent (data exfiltration, prompt injection, privilege escalation)
- Filter agent arguments for sensitive patterns: API keys, credentials, PII, SQL injection
- Use regex pattern lists that can be updated without code changes
- Check both the user's original prompt AND the agent's generated tool arguments

## Multi-Agent Safety

- Each agent in a multi-agent system should have its own governance policy
- When agents delegate to other agents, apply the most restrictive policy from either
- Track trust scores for agent delegates — degrade trust on failures, require ongoing good behavior
- Never allow an inner agent to have broader permissions than the outer agent that called it

## Audit & Observability

- Log every tool call with: timestamp, agent ID, tool name, allow/deny decision, policy name
- Log every governance violation with the matched rule and evidence
- Export audit trails in JSON Lines format for integration with log aggregation systems
- Include session boundaries (start/end) in audit logs for correlation

## Code Patterns

When writing agent tool functions:

```python
# Good: Governed tool with explicit policy
@govern(policy)
async def search(query: str) -> str:
    ...

# Bad: Unprotected tool with no governance
async def search(query: str) -> str:
    ...
```

When defining policies:

```yaml
# Good: Explicit allowlist, content filters, rate limit
name: my-agent
allowed_tools: [search, summarize]
blocked_patterns: ["(?i)(api_key|password)\\s*[:=]"]
max_calls_per_request: 25

# Bad: No restrictions
name: my-agent
allowed_tools: ["*"]
```

When composing multi-agent policies:

```python
# Good: Most-restrictive-wins composition
final_policy = compose_policies(org_policy, team_policy, agent_policy)

# Bad: Only using agent-level policy, ignoring org constraints
final_policy = agent_policy
```

## Framework-Specific Notes

- **PydanticAI**: Use `@agent.tool` with a governance decorator wrapper. PydanticAI's upcoming Traits feature is designed for this pattern.
- **CrewAI**: Apply governance at the Crew level to cover all agents. Use `before_kickoff` callbacks for policy validation.
- **OpenAI Agents SDK**: Wrap `@function_tool` with governance. Use handoff guards for multi-agent trust.
- **LangChain/LangGraph**: Use `RunnableBinding` or tool wrappers for governance. Apply at the graph edge level for flow control.
- **AutoGen**: Implement governance in the `ConversableAgent.register_for_execution` hook.

## Common Mistakes

- Relying only on output guardrails (post-generation) instead of pre-execution governance
- Hardcoding policy rules instead of loading from configuration
- Allowing agents to self-modify their own governance policies
- Forgetting to governance-check tool _arguments_, not just tool _names_
- Not decaying trust scores over time — stale trust is dangerous
- Logging prompts in audit trails — log decisions and metadata, not user content

## Non-negotiables (MUST)

- Conform to [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/).
- Go beyond minimum conformance when it meaningfully improves usability.
- If the project uses a UI component library, you MUST use the component patterns as defined by the library. Do not recreate patterns.
  - If unsure, find an existing usage in the project and follow the same patterns.
  - Ensure the resulting UI still has correct accessible name/role/value, keyboard behavior, focus management, visible labels and meets at least minimum contrast requirements.
- If there is no component library (or a needed component does not exist), prefer native HTML elements/attributes over ARIA.
- Use ARIA only when necessary (do not add ARIA to native elements when the native semantics already work).
- Ensure correct accessible **name, role, value, states, and properties**.
- All interactive elements are keyboard operable, with clearly visible focus, and no keyboard traps.
- Do not claim the output is “fully accessible”.

## Inclusive language (MUST)

- Use respectful, inclusive, people-first language in any user-facing text.
- Avoid stereotypes or assumptions about ability, cognition, or experience.

## Cognitive load (SHOULD)

- Prefer plain language.
- Use consistent page structure (landmarks).
- Keep navigation order consistent.
- Keep the interface clean and simple (avoid unnecessary distractions).

## Structure and semantics

### Page structure (MUST)

- Use landmarks (`header`, `nav`, `main`, `footer`) appropriately.
- Use headings to introduce new sections of content; avoid skipping heading levels.
- Prefer one `h1` for the page topic. Generally, the first heading within the `main` element / landmark.

### Page title (SHOULD)

- Set a descriptive `<title>`.
- Prefer: “Unique page - section - site”.

## Keyboard and focus

### Core rules (MUST)

- All interactive elements are keyboard operable.
- Tab order follows reading order and is predictable.
- Focus is always visible.
- Hidden content is not focusable (`hidden`, `display:none`, `visibility:hidden`).
- If content is hidden from assistive technology using `aria-hidden="true"`, then neither that content nor any of its descendants can be focusable.
- Static content MUST NOT be tabbable.
  - Exception: if an element needs programmatic focus, use `tabindex="-1"`.

- Text contrast: at least 4.5:1 (large text: 3:1).
  - Large text is at least 24px regular or 18.66px bold.
- Focus indicators and key control boundaries: at least 3:1 vs adjacent colors.
- Do not rely on color alone to convey information (error/success/required/selected). Provide text and/or icons with accessible names.
- Do not invent arbitrary colors.
  - Use project-approved design tokens (CSS variables).
  - If no palette exists, define a small token palette and only use those tokens.
- Avoid alpha for text and key UI affordances (`opacity`, `rgba`, `hsla`) because contrast becomes background-dependent and often fails.
- Ensure contrast for all interactive states: default, hover, active, focus, visited (links), and disabled.
- Use responsive layout primitives (`flex`, `grid`) with fluid sizing; enable text wrapping.
- Avoid fixed widths that force two-dimensional scrolling at 320px.
- Avoid absolute positioning and `overflow: hidden` when it causes content loss, or would result in the obscuring of content at smaller viewport sizes.
- Media and containers SHOULD NOT overflow the viewport at 320px (for example, prefer `max-width: 100%` for images/video/canvas/iframes).
- In flex/grid layouts, ensure children can shrink/wrap (common fix: `min-width: 0` on flex/grid children).
- Handle long strings (URLs, tokens) without forcing overflow (common fix: `overflow-wrap: anywhere` or equivalent).
- Ensure all interactive elements remain visible, reachable, and operable at 320px.
  **CRITICAL**: The `description` field is the PRIMARY mechanism for automatic skill discovery. Copilot reads ONLY the `name` and `description` to decide whether to load a skill. If your description is vague, the skill will never be activated.
  **What to include in description:**

1. **WHAT** the skill does (capabilities)
2. **WHEN** to use it (specific triggers, scenarios, file types, or user requests)
3. **Keywords** that users might mention in their prompts
   **Good description:**

```yaml
description: Toolkit for testing local web applications using Playwright. Use when asked to verify frontend functionality, debug UI behavior, capture browser screenshots, check for visual regressions, or view browser console logs. Supports Chrome, Firefox, and WebKit browsers.
```

**Poor description:**

```yaml
description: Web testing helpers
```

The poor description fails because:

- No specific triggers (when should Copilot load this?)
- No keywords (what user prompts would match?)
- No capabilities (what can it actually do?)
  When including scripts, prefer cross-platform languages:
  | Language | Use Case |
  |----------|----------|
  | Python | Complex automation, data processing |
  | pwsh | PowerShell Core scripting |
  | Node.js | JavaScript-based tooling |
  | Bash/Shell | Simple automation tasks |
  Best practices:
- Include help/usage documentation (`--help` flag)
- Handle errors gracefully with clear messages
- Avoid storing credentials or secrets
- Use relative paths where possible
- **Principle:** Copy only what is necessary, when it is necessary, to optimize layer caching and reduce image size.
- **Deeper Dive:**
  - **Selective Copying:** Copy specific files or directories rather than entire project directories when possible.
  - **Layer Caching:** Each `COPY` instruction creates a new layer. Copy files that change together in the same instruction.
  - **Build Context:** Only copy files that are actually needed for the build or runtime.
  - **Security:** Be careful not to copy sensitive files or unnecessary configuration files.
- **Guidance for Copilot:**
  - Use specific paths for `COPY` (`COPY src/ ./src/`) instead of copying the entire directory (`COPY . .`) if only a subset is needed.
  - Copy dependency files (like `package.json`, `requirements.txt`) before copying source code to leverage layer caching.
  - Recommend copying only the necessary files for each stage in multi-stage builds.
  - Suggest using `.dockerignore` to exclude files that shouldn't be copied.
- **Example (Optimized COPY Strategy):**

````dockerfile
### Skip link / bypass blocks (MUST)

Provide a skip link as the first focusable element.

```html
<header>
  <a href="#maincontent" class="sr-only">Skip to main content</a>
  <!-- header content -->
</header>
<nav>
  <!-- navigation -->
</nav>
<main id="maincontent" tabindex="-1">
  <h1><!-- page title --></h1>
  <!-- content -->
</main>
````

```css
.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

### Composite widgets (SHOULD)

If a component uses arrow-key navigation within itself (tabs, listbox, menu-like UI, grid/date picker):

- Provide one tab stop for the composite container or one child.
- Manage internal focus with either roving tabindex or `aria-activedescendant`.

Roving tabindex (SHOULD):

- Exactly one focusable item has `tabindex="0"`; all others are `-1`.
- Arrow keys move focus by swapping tabindex and calling `.focus()`.

`aria-activedescendant` (SHOULD):

- Container is implicitly focusable or has `tabindex="0"` and `aria-activedescendant="IDREF"`.
- Arrow keys update `aria-activedescendant`.

## Low vision and contrast (MUST)

### Safe defaults when unsure (SHOULD)

- Prefer very dark text on very light backgrounds, or the reverse.
- Avoid mid-gray text on white; muted text should still meet 4.5:1.

### Tokenized palette contract (SHOULD)

- Define and use tokens like: `--color-bg`, `--color-text`, `--color-muted-text`, `--color-link`, `--color-border`, `--color-focus`, `--color-danger`, `--color-success`.
- Only assign UI colors via these tokens (avoid scattered inline hex values).

### Verification (MUST)

Contrast verification is covered by the Final verification checklist.

## High contrast / forced colors mode (MUST)

### Support OS-level accessibility features (MUST)

- Never override or disrupt OS accessibility settings.
- The UI MUST adapt to High Contrast / Forced Colors mode automatically.
- Avoid hard-coded colors that conflict with user-selected system colors.

### Use the `forced-colors` media query when needed (SHOULD)

Use `@media (forced-colors: active)` only when system defaults are not sufficient.

```css
@media (forced-colors: active) {
  /* Example: Replace box-shadow (suppressed in forced-colors) with a border */
  .button {
    border: 2px solid ButtonBorder;
  }
}

/* if using box-shadow for a focus style, also use a transparent outline
    so that the outline will render when the high contrast setting is enabled */
.button:focus {
  box-shadow: 0 0 4px 3px rgba(90, 50, 200, 0.7);
  outline: 2px solid transparent;
}
```

In Forced Colors mode, avoid relying on:

- Box shadows
- Decorative gradients

### Respect user color schemes in forced colors (MUST)

- Use system color keywords (e.g., `ButtonText`, `ButtonBorder`, `CanvasText`, `Canvas`).
- Do not use fixed hex/RGB colors inside `@media (forced-colors: active)`.

### Do not disable forced colors (MUST)

- Do not use `forced-color-adjust: none` unless absolutely necessary and explicitly justified.
- If it is required for a specific element, provide an accessible alternative that still works in Forced Colors mode.

### Icons (MUST)

- Icons MUST adapt to text color.
- Prefer `currentColor` for SVG icon fills/strokes; avoid embedding fixed colors inside SVGs.

```css
svg {
  fill: currentColor;
  stroke: currentColor;
}
```

## Reflow (WCAG 2.2 SC 1.4.10) (MUST)

### Goal (MUST)

Multi-line text must be able to fit within 320px wide containers or viewports, so that users do not need to scroll in two-dimensions to read sections of content.

### Core principles (MUST)

- Preserve information and function: nothing essential is removed, obscured, or truncated.
- At narrow widths, multi-column layouts MUST stack into a single column; text MUST wrap; controls SHOULD rearrange vertically.
- Users MUST NOT need to scroll left/right to read multi-line text.
- If content is collapsed in the narrow layout, the full content/function MUST be available within 1 click (e.g., overflow menu, dialog, tooltip).

### Exceptions (SHOULD)

If a component truly requires a two-dimensional layout for meaning/usage (e.g., large data tables, maps, diagrams, charts, games, presentations), allow horizontal scrolling only at the component level.

- The page as a whole MUST still reflow (unless the page layout truly requires two-dimensional layout for usage).
- The component MUST remain fully usable (all content reachable; controls operable).

## Controls and labels

### Visible labels (MUST)

- Every interactive element has a visible label.
- The label cannot disappear while entering text or after the field has a value.

### Voice access (MUST)

- The accessible name of each interactive element MUST contain the visible label.
  - If using `aria-label`, include the visual label text.
- If multiple controls share the same visible label (e.g., many “Remove” buttons), use an `aria-label` that keeps the visible label text and adds context (e.g., “Remove item: Socks”).

## Forms

### Labels and help text (MUST)

- Every form control has a programmatic label.
  - Prefer `<label for="...">`.
- Labels describe the input purpose.
- If help text exists, associate it with `aria-describedby`.

### Required fields (MUST)

- Indicate required fields visually (often `*`) and programmatically (`aria-required="true"`).

### Errors and validation (MUST)

- Provide error messages that explain how to fix the issue.
- Use `aria-invalid="true"` for invalid fields; remove it when valid.
- Associate inline errors with the field via `aria-describedby`.
- Submit buttons SHOULD NOT be disabled solely to prevent submission.
- On submit with invalid input, focus the first invalid control.

## Graphics and images

All graphics include `img`, `svg`, icon fonts, and emojis.

- Informative graphics MUST have meaningful alternatives.
  - `img`: use `alt`.
  - `svg`: prefer `role="img"` and `aria-label`/`aria-labelledby`.
- Decorative graphics MUST be hidden.
  - `img`: `alt=""`.
  - Other: `aria-hidden="true"`.

## Navigation and menus

- Use semantic navigation: `<nav>` with lists and links.
- Do not use `role="menu"` / `role="menubar"` for site navigation.
- For expandable navigation:
  - Include button elements to toggle navigation and/or sub-navigations. Use `aria-expanded` on the button to indicate state.
  - `Escape` MAY close open sub-navigations.

## Tables and grids

### Tables for static data (MUST)

- Use `<table>` for static tabular data.
- Use `<th>` to associate headers.
  - Column headers are in the first row.
  - Row headers (when present) use `<th>` in each row.

### Grids for dynamic UIs (SHOULD)

- Use grid roles only for truly interactive/dynamic experiences.
- If using `role="grid"`, grid cells MUST be nested in rows so header/cell relationships are determinable.
- Use arrow navigation to navigate within the grid.

## Final verification checklist (MUST)

Before finalizing output, explicitly verify:

- Structure and semantics: landmarks, headings, and one `h1` for the page topic.
- Keyboard and focus: operable controls, visible focus, predictable tab order, no traps, skip link works.
- Controls and labels: visible labels present and included in accessible names.
- Forms: labels, required indicators, errors (`aria-invalid` + `aria-describedby`), focus first invalid.
- Contrast: meets 4.5:1 / 3:1 thresholds, focus/boundaries meet 3:1, color not the only cue.
- Forced colors: does not break OS High Contrast / Forced Colors; uses system colors in `forced-colors: active`.
- Reflow: sections of content should be able to adjust to 320px width without the need for two-dimensional scrolling to read multi-line text; no content loss; controls remain operable.
- Graphics: informative alternatives; decorative graphics hidden.
- Tables/grids: tables use `<th>`; grids (when needed) are structured with rows and cells.

## Final note

Generate the HTML with accessibility in mind, but accessibility issues may still exist; manual review and testing (for example with Accessibility Insights) is still recommended.

## What Are Agent Skills?

Agent Skills are self-contained folders with instructions and bundled resources that teach AI agents specialized capabilities. Unlike custom instructions (which define coding standards), skills enable task-specific workflows that can include scripts, examples, templates, and reference data.

Key characteristics:

- **Portable**: Works across VS Code, Copilot CLI, and Copilot coding agent
- **Progressive loading**: Only loaded when relevant to the user's request
- **Resource-bundled**: Can include scripts, templates, examples alongside instructions
- **On-demand**: Activated automatically based on prompt relevance

## Directory Structure

Skills are stored in specific locations:

| Location                         | Scope                | Recommendation                     |
| -------------------------------- | -------------------- | ---------------------------------- |
| `.github/skills/<skill-name>/`   | Project/repository   | Recommended for project skills     |
| `.claude/skills/<skill-name>/`   | Project/repository   | Legacy, for backward compatibility |
| `~/.github/skills/<skill-name>/` | Personal (user-wide) | Recommended for personal skills    |
| `~/.claude/skills/<skill-name>/` | Personal (user-wide) | Legacy, for backward compatibility |

Each skill **must** have its own subdirectory containing at minimum a `SKILL.md` file.

## Required SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: webapp-testing
description: Toolkit for testing local web applications using Playwright. Use when asked to verify frontend functionality, debug UI behavior, capture browser screenshots, check for visual regressions, or view browser console logs. Supports Chrome, Firefox, and WebKit browsers.
license: Complete terms in LICENSE.txt
---
```

| Field         | Required | Constraints                                                                         |
| ------------- | -------- | ----------------------------------------------------------------------------------- |
| `name`        | Yes      | Lowercase, hyphens for spaces, max 64 characters (e.g., `webapp-testing`)           |
| `description` | Yes      | Clear description of capabilities AND use cases, max 1024 characters                |
| `license`     | No       | Reference to LICENSE.txt (e.g., `Complete terms in LICENSE.txt`) or SPDX identifier |

### Body Content

The body contains detailed instructions that Copilot loads AFTER the skill is activated. Recommended sections:

| Section                     | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `# Title`                   | Brief overview of what this skill enables           |
| `## When to Use This Skill` | List of scenarios (reinforces description triggers) |
| `## Prerequisites`          | Required tools, dependencies, environment setup     |
| `## Step-by-Step Workflows` | Numbered steps for common tasks                     |
| `## Troubleshooting`        | Common issues and solutions table                   |
| `## References`             | Links to bundled docs or external resources         |

## Bundling Resources

Skills can include additional files that Copilot accesses on-demand:

### Supported Resource Types

| Folder        | Purpose                                                               | Loaded into Context? | Example Files                                             |
| ------------- | --------------------------------------------------------------------- | -------------------- | --------------------------------------------------------- |
| `scripts/`    | Executable automation that performs specific operations               | When executed        | `helper.py`, `validate.sh`, `build.ts`                    |
| `references/` | Documentation the AI agent reads to inform decisions                  | Yes, when referenced | `api_reference.md`, `schema.md`, `workflow_guide.md`      |
| `assets/`     | **Static files used AS-IS** in output (not modified by the AI agent)  | No                   | `logo.png`, `brand-template.pptx`, `custom-font.ttf`      |
| `templates/`  | **Starter code/scaffolds that the AI agent MODIFIES** and builds upon | Yes, when referenced | `viewer.html` (insert algorithm), `hello-world/` (extend) |

### Directory Structure Example

```
.github/skills/my-skill/
├── SKILL.md              # Required: Main instructions
├── LICENSE.txt           # Recommended: License terms (Apache 2.0 typical)
├── scripts/              # Optional: Executable automation
│   ├── helper.py         # Python script
│   └── helper.ps1        # PowerShell script
├── references/           # Optional: Documentation loaded into context
│   ├── api_reference.md
│   ├── workflow-setup.md     # Detailed workflow (>5 steps)
│   └── workflow-deployment.md
├── assets/               # Optional: Static files used AS-IS in output
│   ├── baseline.png      # Reference image for comparison
│   └── report-template.html
└── templates/            # Optional: Starter code the AI agent modifies
    ├── scaffold.py       # Code scaffold the AI agent customizes
    └── config.template   # Config template the AI agent fills in
```

> **LICENSE.txt**: When creating a skill, download the Apache 2.0 license text from https://www.apache.org/licenses/LICENSE-2.0.txt and save as `LICENSE.txt`. Update the copyright year and owner in the appendix section.

### Assets vs Templates: Key Distinction

**Assets** are static resources **consumed unchanged** in the output:

- A `logo.png` that gets embedded into a generated document
- A `report-template.html` copied as output format
- A `custom-font.ttf` applied to text rendering

**Templates** are starter code/scaffolds that **the AI agent actively modifies**:

- A `scaffold.py` where the AI agent inserts logic
- A `config.template` where the AI agent fills in values based on user requirements
- A `hello-world/` project directory that the AI agent extends with new features

**Rule of thumb**: If the AI agent reads and builds upon the file content → `templates/`. If the file is used as-is in output → `assets/`.

### Referencing Resources in SKILL.md

Use relative paths to reference files within the skill directory:

```markdown
## Available Scripts

Run the [helper script](./scripts/helper.py) to automate common tasks.

See [API reference](./references/api_reference.md) for detailed documentation.

Use the [scaffold](./templates/scaffold.py) as a starting point.
```

## Progressive Loading Architecture

Skills use three-level loading for efficiency:

| Level           | What Loads                    | When                              |
| --------------- | ----------------------------- | --------------------------------- |
| 1. Discovery    | `name` and `description` only | Always (lightweight metadata)     |
| 2. Instructions | Full `SKILL.md` body          | When request matches description  |
| 3. Resources    | Scripts, examples, docs       | Only when Copilot references them |

This means:

- Install many skills without consuming context
- Only relevant content loads per task
- Resources don't load until explicitly needed

### Writing Style

- Use imperative mood: "Run", "Create", "Configure" (not "You should run")
- Be specific and actionable
- Include exact commands with parameters
- Show expected outputs where helpful
- Keep sections focused and scannable

### When to Bundle Scripts

Include scripts in your skill when:

- The same code would be rewritten repeatedly by the agent
- Deterministic reliability is critical (e.g., file manipulation, API calls)
- Complex logic benefits from being pre-tested rather than generated each time
- The operation has a self-contained purpose that can evolve independently
- Testability matters — scripts can be unit tested and validated
- Predictable behavior is preferred over dynamic generation

Scripts enable evolution: even simple operations benefit from being implemented as scripts when they may grow in complexity, need consistent behavior across invocations, or require future extensibility.

### Security Considerations

- Scripts rely on existing credential helpers (no credential storage)
- Include `--force` flags only for destructive operations
- Warn users before irreversible actions
- Document any network operations or external calls

## Common Patterns

### Parameter Table Pattern

Document parameters clearly:

```markdown
| Parameter   | Required | Default | Description                  |
| ----------- | -------- | ------- | ---------------------------- |
| `--input`   | Yes      | -       | Input file or URL to process |
| `--action`  | Yes      | -       | Action to perform            |
| `--verbose` | No       | `false` | Enable verbose output        |
```

## Validation Checklist

Before publishing a skill:

- [ ] `SKILL.md` has valid frontmatter with `name` and `description`
- [ ] `name` is lowercase with hyphens, ≤64 characters
- [ ] `description` clearly states **WHAT** it does, **WHEN** to use it, and relevant **KEYWORDS**
- [ ] Body includes when to use, prerequisites, and step-by-step workflows
- [ ] SKILL.md body kept under 500 lines (split large content into `references/` folder)
- [ ] Large workflows (>5 steps) split into `references/` folder with clear links from SKILL.md
- [ ] Scripts include help documentation and error handling
- [ ] Relative paths used for all resource references
- [ ] No hardcoded credentials or secrets

## Workflow Execution Pattern

When executing multi-step workflows, create a TODO list where each step references the relevant documentation:

```markdown
## TODO

- [ ] Step 1: Configure environment - see [workflow-setup.md](./references/workflow-setup.md#environment)
- [ ] Step 2: Build project - see [workflow-setup.md](./references/workflow-setup.md#build)
- [ ] Step 3: Deploy to staging - see [workflow-deployment.md](./references/workflow-deployment.md#staging)
- [ ] Step 4: Run validation - see [workflow-deployment.md](./references/workflow-deployment.md#validation)
- [ ] Step 5: Deploy to production - see [workflow-deployment.md](./references/workflow-deployment.md#production)
```

This ensures traceability and allows resuming workflows if interrupted.

## Related Resources

- [Agent Skills Specification](https://agentskills.io/)
- [VS Code Agent Skills Documentation](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Reference Skills Repository](https://github.com/anthropics/skills)
- [Awesome Copilot Skills](https://github.com/github/awesome-copilot/blob/main/docs/README.skills.md)

# Tailwind CSS v4+ Installation with Vite

Instructions for installing and configuring Tailwind CSS version 4 and above using the official Vite plugin. Tailwind CSS v4 introduces a simplified setup that eliminates the need for PostCSS configuration and tailwind.config.js in most cases.

## Key Changes in Tailwind CSS v4

- **No PostCSS configuration required** when using the Vite plugin
- **No tailwind.config.js required** - configuration is done via CSS
- **New @tailwindcss/vite plugin** replaces the PostCSS-based approach
- **CSS-first configuration** using `@theme` directive
- **Automatic content detection** - no need to specify content paths

## Installation Steps

### Step 1: Install Dependencies

Install `tailwindcss` and the `@tailwindcss/vite` plugin:

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2: Configure Vite Plugin

Add the `@tailwindcss/vite` plugin to your Vite configuration file:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

For React projects with Vite:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Step 3: Import Tailwind CSS

Add the Tailwind CSS import to your main CSS file (e.g., `src/index.css` or `src/App.css`):

```css
@import "tailwindcss";
```

### Step 4: Verify CSS Import in Entry Point

Ensure your main CSS file is imported in your application entry point:

```typescript
// src/main.tsx or src/main.ts
import "./index.css";
```

### Step 5: Start Development Server

Run the development server to verify installation:

```bash
npm run dev
```

## What NOT to Do in Tailwind v4

### Do NOT Create tailwind.config.js

Tailwind v4 uses CSS-first configuration. Do not create a `tailwind.config.js` file unless you have specific legacy requirements.

```javascript
// ❌ NOT NEEDED in Tailwind v4
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Do NOT Create postcss.config.js for Tailwind

When using the `@tailwindcss/vite` plugin, PostCSS configuration for Tailwind is not required.

```javascript
// ❌ NOT NEEDED when using @tailwindcss/vite
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Do NOT Use Old Directives

The old `@tailwind` directives are replaced by a single import:

```css
/* ❌ OLD - Do not use in Tailwind v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ NEW - Use this in Tailwind v4 */
@import "tailwindcss";
```

## CSS-First Configuration (Tailwind v4)

### Custom Theme Configuration

Use the `@theme` directive in your CSS to customize your design tokens:

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --font-sans: "Inter", system-ui, sans-serif;
  --radius-lg: 0.75rem;
}
```

### Adding Custom Utilities

Define custom utilities directly in CSS:

```css
@import "tailwindcss";

@utility content-auto {
  content-visibility: auto;
}

@utility scrollbar-hidden {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Adding Custom Variants

Define custom variants in CSS:

```css
@import "tailwindcss";

@variant hocus (&:hover, &:focus);
@variant group-hocus (:merge(.group):hover &, :merge(.group):focus &);
```

## Verification Checklist

After installation, verify:

- [ ] `tailwindcss` and `@tailwindcss/vite` are in `package.json` dependencies
- [ ] `vite.config.ts` includes the `tailwindcss()` plugin
- [ ] Main CSS file contains `@import "tailwindcss";`
- [ ] CSS file is imported in the application entry point
- [ ] Development server runs without errors
- [ ] Tailwind utility classes (e.g., `text-blue-500`, `p-4`) render correctly

## Example Usage

Test the installation with a simple component:

```tsx
export function TestComponent() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 underline">
        Hello, Tailwind CSS v4!
      </h1>
    </div>
  );
}
```

## Troubleshooting

### Styles Not Applying

1. Verify CSS import statement is `@import "tailwindcss";` (not old directives)
2. Ensure CSS file is imported in your entry point
3. Check Vite config includes the `tailwindcss()` plugin
4. Clear Vite cache: `rm -rf node_modules/.vite && npm run dev`

### Plugin Not Found Error

If you see "Cannot find module '@tailwindcss/vite'":

```bash
npm install @tailwindcss/vite
```

### TypeScript Errors

If TypeScript cannot find types for the Vite plugin, ensure you have the correct import:

```typescript
import tailwindcss from "@tailwindcss/vite";
```

## Migration from Tailwind v3

If migrating from Tailwind v3:

1. Remove `tailwind.config.js` (move customizations to CSS `@theme`)
2. Remove `postcss.config.js` (if only used for Tailwind)
3. Uninstall old packages: `npm uninstall postcss autoprefixer`
4. Install new packages: `npm install tailwindcss @tailwindcss/vite`
5. Replace `@tailwind` directives with `@import "tailwindcss";`
6. Update Vite config to use `@tailwindcss/vite` plugin

## Reference

- Official Documentation: https://tailwindcss.com/docs/installation/using-vite
- Tailwind CSS v4 Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide

## Testing

- Use Vitest for testing
- Write tests for all new features and bug fixes
- Ensure tests cover edge cases and error handling
- NEVER change the original code to make it easier to test, instead, write tests that cover the original code as it is

## Documentation

- When adding new features or making significant changes, update the README.md file where necessary

## User interactions

- Ask questions if you are unsure about the implementation details, design choices, or need clarification on the requirements
- Always answer in the same language as the question, but use english for the generated content like code, comments or docs

## Your Mission

As GitHub Copilot, you are an expert in containerization with deep knowledge of Docker best practices. Your goal is to guide developers in building highly efficient, secure, and maintainable Docker images and managing their containers effectively. You must emphasize optimization, security, and reproducibility.

## Core Principles of Containerization

### **1. Immutability**

- **Principle:** Once a container image is built, it should not change. Any changes should result in a new image.
- **Deeper Dive:**
  - **Reproducible Builds:** Every build should produce identical results given the same inputs. This requires deterministic build processes, pinned dependency versions, and controlled build environments.
  - **Version Control for Images:** Treat container images like code - version them, tag them meaningfully, and maintain a clear history of what each image contains.
  - **Rollback Capability:** Immutable images enable instant rollbacks by simply switching to a previous image tag, without the complexity of undoing changes.
  - **Security Benefits:** Immutable images reduce the attack surface by preventing runtime modifications that could introduce vulnerabilities.
- **Guidance for Copilot:**
  - Advocate for creating new images for every code change or configuration update, never modifying running containers in production.
  - Recommend using semantic versioning for image tags (e.g., `v1.2.3`, `latest` for development only).
  - Suggest implementing automated image builds triggered by code changes to ensure consistency.
  - Emphasize the importance of treating container images as artifacts that should be versioned and stored in registries.
- **Pro Tip:** This enables easy rollbacks and consistent environments across dev, staging, and production. Immutable images are the foundation of reliable deployments.

### **2. Portability**

- **Principle:** Containers should run consistently across different environments (local, cloud, on-premise) without modification.
- **Deeper Dive:**
  - **Environment Agnostic Design:** Design applications to be environment-agnostic by externalizing all environment-specific configurations.
  - **Configuration Management:** Use environment variables, configuration files, or external configuration services rather than hardcoding environment-specific values.
  - **Dependency Management:** Ensure all dependencies are explicitly defined and included in the container image, avoiding reliance on host system packages.
  - **Cross-Platform Compatibility:** Consider the target deployment platforms and ensure compatibility (e.g., ARM vs x86, different Linux distributions).
- **Guidance for Copilot:**
  - Design Dockerfiles that are self-contained and avoid environment-specific configurations within the image itself.
  - Use environment variables for runtime configuration, with sensible defaults but allowing overrides.
  - Recommend using multi-platform base images when targeting multiple architectures.
  - Suggest implementing configuration validation to catch environment-specific issues early.
- **Pro Tip:** Portability is achieved through careful design and testing across target environments, not by accident.

### **3. Isolation**

- **Principle:** Containers provide process and resource isolation, preventing interference between applications.
- **Deeper Dive:**
  - **Process Isolation:** Each container runs in its own process namespace, preventing one container from seeing or affecting processes in other containers.
  - **Resource Isolation:** Containers have isolated CPU, memory, and I/O resources, preventing resource contention between applications.
  - **Network Isolation:** Containers can have isolated network stacks, with controlled communication between containers and external networks.
  - **Filesystem Isolation:** Each container has its own filesystem namespace, preventing file system conflicts.
- **Guidance for Copilot:**
  - Recommend running a single process per container (or a clear primary process) to maintain clear boundaries and simplify management.
  - Use container networking for inter-container communication rather than host networking.
  - Suggest implementing resource limits to prevent containers from consuming excessive resources.
  - Advise on using named volumes for persistent data rather than bind mounts when possible.
- **Pro Tip:** Proper isolation is the foundation of container security and reliability. Don't break isolation for convenience.

### **4. Efficiency & Small Images**

- **Principle:** Smaller images are faster to build, push, pull, and consume fewer resources.
- **Deeper Dive:**
  - **Build Time Optimization:** Smaller images build faster, reducing CI/CD pipeline duration and developer feedback time.
  - **Network Efficiency:** Smaller images transfer faster over networks, reducing deployment time and bandwidth costs.
  - **Storage Efficiency:** Smaller images consume less storage in registries and on hosts, reducing infrastructure costs.
  - **Security Benefits:** Smaller images have a reduced attack surface, containing fewer packages and potential vulnerabilities.
- **Guidance for Copilot:**
  - Prioritize techniques for reducing image size and build time throughout the development process.
  - Advise against including unnecessary tools, debugging utilities, or development dependencies in production images.
  - Recommend regular image size analysis and optimization as part of the development workflow.
  - Suggest using multi-stage builds and minimal base images as the default approach.
- **Pro Tip:** Image size optimization is an ongoing process, not a one-time task. Regularly review and optimize your images.

### **1. Multi-Stage Builds (The Golden Rule)**

- **Principle:** Use multiple `FROM` instructions in a single Dockerfile to separate build-time dependencies from runtime dependencies.
- **Deeper Dive:**
  - **Build Stage Optimization:** The build stage can include compilers, build tools, and development dependencies without affecting the final image size.
  - **Runtime Stage Minimization:** The runtime stage contains only the application and its runtime dependencies, significantly reducing the attack surface.
  - **Artifact Transfer:** Use `COPY --from=<stage>` to transfer only necessary artifacts between stages.
  - **Parallel Build Stages:** Multiple build stages can run in parallel if they don't depend on each other.
- **Guidance for Copilot:**
  - Always recommend multi-stage builds for compiled languages (Go, Java, .NET, C++) and even for Node.js/Python where build tools are heavy.
  - Suggest naming build stages descriptively (e.g., `AS build`, `AS test`, `AS production`) for clarity.
  - Recommend copying only the necessary artifacts between stages to minimize the final image size.
  - Advise on using different base images for build and runtime stages when appropriate.
- **Benefit:** Significantly reduces final image size and attack surface.
- **Example (Advanced Multi-Stage with Testing):**

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Test
FROM build AS test
RUN npm run test
RUN npm run lint

# Stage 4: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### **2. Choose the Right Base Image**

- **Principle:** Select official, stable, and minimal base images that meet your application's requirements.
- **Deeper Dive:**
  - **Official Images:** Prefer official images from Docker Hub or cloud providers as they are regularly updated and maintained.
  - **Minimal Variants:** Use minimal variants (`alpine`, `slim`, `distroless`) when possible to reduce image size and attack surface.
  - **Security Updates:** Choose base images that receive regular security updates and have a clear update policy.
  - **Architecture Support:** Ensure the base image supports your target architectures (x86_64, ARM64, etc.).
- **Guidance for Copilot:**
  - Prefer Alpine variants for Linux-based images due to their small size (e.g., `alpine`, `node:18-alpine`).
  - Use official language-specific images (e.g., `python:3.9-slim-buster`, `openjdk:17-jre-slim`).
  - Avoid `latest` tag in production; use specific version tags for reproducibility.
  - Recommend regularly updating base images to get security patches and new features.
- **Pro Tip:** Smaller base images mean fewer vulnerabilities and faster downloads. Always start with the smallest image that meets your needs.

### **3. Optimize Image Layers**

- **Principle:** Each instruction in a Dockerfile creates a new layer. Leverage caching effectively to optimize build times and image size.
- **Deeper Dive:**
  - **Layer Caching:** Docker caches layers and reuses them if the instruction hasn't changed. Order instructions from least to most frequently changing.
  - **Layer Size:** Each layer adds to the final image size. Combine related commands to reduce the number of layers.
  - **Cache Invalidation:** Changes to any layer invalidate all subsequent layers. Place frequently changing content (like source code) near the end.
  - **Multi-line Commands:** Use `\` for multi-line commands to improve readability while maintaining layer efficiency.
- **Guidance for Copilot:**
  - Place frequently changing instructions (e.g., `COPY . .`) _after_ less frequently changing ones (e.g., `RUN npm ci`).
  - Combine `RUN` commands where possible to minimize layers (e.g., `RUN apt-get update && apt-get install -y ...`).
  - Clean up temporary files in the same `RUN` command (`rm -rf /var/lib/apt/lists/*`).
  - Use multi-line commands with `\` for complex operations to maintain readability.
- **Example (Advanced Layer Optimization):**

```dockerfile
# BAD: Multiple layers, inefficient caching
FROM ubuntu:20.04
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN pip3 install flask
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# GOOD: Optimized layers with proper cleanup
FROM ubuntu:20.04
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install flask && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### **4. Use `.dockerignore` Effectively**

- **Principle:** Exclude unnecessary files from the build context to speed up builds and reduce image size.
- **Deeper Dive:**
  - **Build Context Size:** The build context is sent to the Docker daemon. Large contexts slow down builds and consume resources.
  - **Security:** Exclude sensitive files (like `.env`, `.git`) to prevent accidental inclusion in images.
  - **Development Files:** Exclude development-only files that aren't needed in the production image.
  - **Build Artifacts:** Exclude build artifacts that will be generated during the build process.
- **Guidance for Copilot:**
  - Always suggest creating and maintaining a comprehensive `.dockerignore` file.
  - Common exclusions: `.git`, `node_modules` (if installed inside container), build artifacts from host, documentation, test files.
  - Recommend reviewing the `.dockerignore` file regularly as the project evolves.
  - Suggest using patterns that match your project structure and exclude unnecessary files.
- **Example (Comprehensive .dockerignore):**

```dockerignore
# Version control
.git*

# Dependencies (if installed in container)
node_modules
vendor
__pycache__

# Build artifacts
dist
build
*.o
*.so

# Development files
.env.*
*.log
coverage
.nyc_output

# IDE files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Documentation
*.md
docs/

# Test files
test/
tests/
spec/
__tests__/
```

# Copy dependency files first (for better caching)

COPY package\*.json ./
RUN npm ci

# Copy source code (changes more frequently)

COPY src/ ./src/
COPY public/ ./public/

# Copy configuration files

COPY config/ ./config/

# Don't copy everything with COPY . .

````

### **6. Define Default User and Port**
- **Principle:** Run containers with a non-root user for security and expose expected ports for clarity.
- **Deeper Dive:**
    - **Security Benefits:** Running as non-root reduces the impact of security vulnerabilities and follows the principle of least privilege.
    - **User Creation:** Create a dedicated user for your application rather than using an existing user.
    - **Port Documentation:** Use `EXPOSE` to document which ports the application listens on, even though it doesn't actually publish them.
    - **Permission Management:** Ensure the non-root user has the necessary permissions to run the application.
- **Guidance for Copilot:**
    - Use `USER <non-root-user>` to run the application process as a non-root user for security.
    - Use `EXPOSE` to document the port the application listens on (doesn't actually publish).
    - Create a dedicated user in the Dockerfile rather than using an existing one.
    - Ensure proper file permissions for the non-root user.
- **Example (Secure User Setup):**
```dockerfile
# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/main.js"]
````

### **7. Use `CMD` and `ENTRYPOINT` Correctly**

- **Principle:** Define the primary command that runs when the container starts, with clear separation between the executable and its arguments.
- **Deeper Dive:**
  - **`ENTRYPOINT`:** Defines the executable that will always run. Makes the container behave like a specific application.
  - **`CMD`:** Provides default arguments to the `ENTRYPOINT` or defines the command to run if no `ENTRYPOINT` is specified.
  - **Shell vs Exec Form:** Use exec form (`["command", "arg1", "arg2"]`) for better signal handling and process management.
  - **Flexibility:** The combination allows for both default behavior and runtime customization.
- **Guidance for Copilot:**
  - Use `ENTRYPOINT` for the executable and `CMD` for arguments (`ENTRYPOINT ["/app/start.sh"]`, `CMD ["--config", "prod.conf"]`).
  - For simple execution, `CMD ["executable", "param1"]` is often sufficient.
  - Prefer exec form over shell form for better process management and signal handling.
  - Consider using shell scripts as entrypoints for complex startup logic.
- **Pro Tip:** `ENTRYPOINT` makes the image behave like an executable, while `CMD` provides default arguments. This combination provides flexibility and clarity.

### **8. Environment Variables for Configuration**

- **Principle:** Externalize configuration using environment variables or mounted configuration files to make images portable and configurable.
- **Deeper Dive:**
  - **Runtime Configuration:** Use environment variables for configuration that varies between environments (databases, API endpoints, feature flags).
  - **Default Values:** Provide sensible defaults with `ENV` but allow overriding at runtime.
  - **Configuration Validation:** Validate required environment variables at startup to fail fast if configuration is missing.
  - **Security:** Never hardcode secrets in environment variables in the Dockerfile.
- **Guidance for Copilot:**
  - Avoid hardcoding configuration inside the image. Use `ENV` for default values, but allow overriding at runtime.
  - Recommend using environment variable validation in application startup code.
  - Suggest using configuration management tools or external configuration services for complex applications.
  - Advise on using secrets management solutions for sensitive configuration.
- **Example (Environment Variable Best Practices):**

```dockerfile
# Set default values
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Use ARG for build-time variables
ARG BUILD_VERSION
ENV APP_VERSION=$BUILD_VERSION

# The application should validate required env vars at startup
CMD ["node", "dist/main.js"]
```

### **1. Non-Root User**

- **Principle:** Running containers as `root` is a significant security risk and should be avoided in production.
- **Deeper Dive:**
  - **Privilege Escalation:** Root containers can potentially escape to the host system if there are vulnerabilities in the container runtime.
  - **File System Access:** Root containers have access to all files and directories, potentially exposing sensitive host data.
  - **Network Access:** Root containers can bind to privileged ports and potentially interfere with host networking.
  - **Resource Abuse:** Root containers can consume excessive system resources without proper limits.
- **Guidance for Copilot:**
  - Always recommend defining a non-root `USER` in the Dockerfile. Create a dedicated user for your application.
  - Ensure the non-root user has the minimum necessary permissions to run the application.
  - Use `USER` directive early in the Dockerfile to ensure subsequent operations run as the non-root user.
  - Consider using user namespaces or other security features when available.
- **Example (Secure User Creation):**

```dockerfile
# Create a dedicated user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper ownership of application files
RUN chown -R appuser:appgroup /app

# Ensure the user can write to necessary directories
VOLUME ["/app/data"]
```

### **2. Minimal Base Images**

- **Principle:** Smaller images mean fewer packages, thus fewer vulnerabilities and a reduced attack surface.
- **Deeper Dive:**
  - **Attack Surface Reduction:** Each package in the base image represents a potential vulnerability. Fewer packages mean fewer potential attack vectors.
  - **Update Frequency:** Minimal images are updated more frequently and have shorter vulnerability exposure windows.
  - **Resource Efficiency:** Smaller images consume less storage and network bandwidth.
  - **Build Speed:** Smaller base images build faster and are easier to scan for vulnerabilities.
- **Guidance for Copilot:**
  - Prioritize `alpine`, `slim`, or `distroless` images over full distributions when possible.
  - Review base image vulnerabilities regularly using security scanning tools.
  - Consider using language-specific minimal images (e.g., `openjdk:17-jre-slim` instead of `openjdk:17`).
  - Stay updated with the latest minimal base image versions for security patches.
- **Example (Minimal Base Image Selection):**

```dockerfile
# BAD: Full distribution with many unnecessary packages
FROM ubuntu:20.04

# GOOD: Minimal Alpine-based image
FROM node:18-alpine

# BETTER: Distroless image for maximum security
FROM gcr.io/distroless/nodejs18-debian11
```

### **3. Static Analysis Security Testing (SAST) for Dockerfiles**

- **Principle:** Scan Dockerfiles for security misconfigurations and known vulnerabilities before building images.
- **Deeper Dive:**
  - **Dockerfile Linting:** Use tools like `hadolint` to check for Dockerfile best practices and security issues.
  - **Base Image Scanning:** Scan base images for known vulnerabilities before using them.
  - **CI/CD Integration:** Integrate security scanning into the CI/CD pipeline to catch issues early.
  - **Policy Enforcement:** Define security policies and enforce them through automated scanning.
- **Guidance for Copilot:**
  - Recommend integrating tools like `hadolint` (for Dockerfile linting) and `Trivy`, `Clair`, or `Snyk Container` (for image vulnerability scanning) into your CI pipeline.
  - Suggest setting up automated scanning for both Dockerfiles and built images.
  - Recommend failing builds if critical vulnerabilities are found in base images.
  - Advise on regular scanning of images in registries for newly discovered vulnerabilities.
- **Example (Security Scanning in CI):**

```yaml
# GitHub Actions example
- name: Run Hadolint
  run: |
    docker run --rm -i hadolint/hadolint < Dockerfile

- name: Scan image for vulnerabilities
  run: |
    docker build -t myapp .
    trivy image myapp
```

### **4. Image Signing & Verification**

- **Principle:** Ensure images haven't been tampered with and come from trusted sources.
- **Deeper Dive:**
  - **Cryptographic Signing:** Use digital signatures to verify the authenticity and integrity of container images.
  - **Trust Policies:** Define trust policies that specify which images are allowed to run in your environment.
  - **Supply Chain Security:** Image signing is a key component of securing the software supply chain.
  - **Compliance:** Many compliance frameworks require image signing for production deployments.
- **Guidance for Copilot:**
  - Suggest using Notary or Docker Content Trust for signing and verifying images in production.
  - Recommend implementing image signing in the CI/CD pipeline for all production images.
  - Advise on setting up trust policies that prevent running unsigned images.
  - Consider using newer tools like Cosign for more advanced signing features.
- **Example (Image Signing with Cosign):**

```bash
# Sign an image
cosign sign -key cosign.key myregistry.com/myapp:v1.0.0

# Verify an image
cosign verify -key cosign.pub myregistry.com/myapp:v1.0.0
```

### **5. Limit Capabilities & Read-Only Filesystems**

- **Principle:** Restrict container capabilities and ensure read-only access where possible to minimize the attack surface.
- **Deeper Dive:**
  - **Linux Capabilities:** Drop unnecessary Linux capabilities that containers don't need to function.
  - **Read-Only Root:** Mount the root filesystem as read-only when possible to prevent runtime modifications.
  - **Seccomp Profiles:** Use seccomp profiles to restrict system calls that containers can make.
  - **AppArmor/SELinux:** Use security modules to enforce additional access controls.
- **Guidance for Copilot:**
  - Consider using `CAP_DROP` to remove unnecessary capabilities (e.g., `NET_RAW`, `SYS_ADMIN`).
  - Recommend mounting read-only volumes for sensitive data and configuration files.
  - Suggest using security profiles and policies when available in your container runtime.
  - Advise on implementing defense in depth with multiple security controls.
- **Example (Capability Restrictions):**

```dockerfile
# Drop unnecessary capabilities
RUN setcap -r /usr/bin/node

# Or use security options in docker run
# docker run --cap-drop=ALL --security-opt=no-new-privileges myapp
```

### **6. No Sensitive Data in Image Layers**

- **Principle:** Never include secrets, private keys, or credentials in image layers as they become part of the image history.
- **Deeper Dive:**
  - **Layer History:** All files added to an image are stored in the image history and can be extracted even if deleted in later layers.
  - **Build Arguments:** While `--build-arg` can pass data during build, avoid passing sensitive information this way.
  - **Runtime Secrets:** Use secrets management solutions to inject sensitive data at runtime.
  - **Image Scanning:** Regular image scanning can detect accidentally included secrets.
- **Guidance for Copilot:**
  - Use build arguments (`--build-arg`) for temporary secrets during build (but avoid passing sensitive info directly).
  - Use secrets management solutions for runtime (Kubernetes Secrets, Docker Secrets, HashiCorp Vault).
  - Recommend scanning images for accidentally included secrets.
  - Suggest using multi-stage builds to avoid including build-time secrets in the final image.
- **Anti-pattern:** `ADD secrets.txt /app/secrets.txt`
- **Example (Secure Secret Management):**

```dockerfile
# BAD: Never do this
# COPY secrets.txt /app/secrets.txt

# GOOD: Use runtime secrets
# The application should read secrets from environment variables or mounted files
CMD ["node", "dist/main.js"]
```

### **7. Health Checks (Liveness & Readiness Probes)**

- **Principle:** Ensure containers are running and ready to serve traffic by implementing proper health checks.
- **Deeper Dive:**
  - **Liveness Probes:** Check if the application is alive and responding to requests. Restart the container if it fails.
  - **Readiness Probes:** Check if the application is ready to receive traffic. Remove from load balancer if it fails.
  - **Health Check Design:** Design health checks that are lightweight, fast, and accurately reflect application health.
  - **Orchestration Integration:** Health checks are critical for orchestration systems like Kubernetes to manage container lifecycle.
- **Guidance for Copilot:**
  - Define `HEALTHCHECK` instructions in Dockerfiles. These are critical for orchestration systems like Kubernetes.
  - Design health checks that are specific to your application and check actual functionality.
  - Use appropriate intervals and timeouts for health checks to balance responsiveness with overhead.
  - Consider implementing both liveness and readiness checks for complex applications.
- **Example (Comprehensive Health Check):**

```dockerfile
# Health check that verifies the application is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1

# Alternative: Use application-specific health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
```

### **1. Resource Limits**

- **Principle:** Limit CPU and memory to prevent resource exhaustion and noisy neighbors.
- **Deeper Dive:**
  - **CPU Limits:** Set CPU limits to prevent containers from consuming excessive CPU time and affecting other containers.
  - **Memory Limits:** Set memory limits to prevent containers from consuming all available memory and causing system instability.
  - **Resource Requests:** Set resource requests to ensure containers have guaranteed access to minimum resources.
  - **Monitoring:** Monitor resource usage to ensure limits are appropriate and not too restrictive.
- **Guidance for Copilot:**
  - Always recommend setting `cpu_limits`, `memory_limits` in Docker Compose or Kubernetes resource requests/limits.
  - Suggest monitoring resource usage to tune limits appropriately.
  - Recommend setting both requests and limits for predictable resource allocation.
  - Advise on using resource quotas in Kubernetes to manage cluster-wide resource usage.
- **Example (Docker Compose Resource Limits):**

```yaml
services:
  app:
    image: myapp:latest
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```

### **2. Logging & Monitoring**

- **Principle:** Collect and centralize container logs and metrics for observability and troubleshooting.
- **Deeper Dive:**
  - **Structured Logging:** Use structured logging (JSON) for better parsing and analysis.
  - **Log Aggregation:** Centralize logs from all containers for search, analysis, and alerting.
  - **Metrics Collection:** Collect application and system metrics for performance monitoring.
  - **Distributed Tracing:** Implement distributed tracing for understanding request flows across services.
- **Guidance for Copilot:**
  - Use standard logging output (`STDOUT`/`STDERR`) for container logs.
  - Integrate with log aggregators (Fluentd, Logstash, Loki) and monitoring tools (Prometheus, Grafana).
  - Recommend implementing structured logging in applications for better observability.
  - Suggest setting up log rotation and retention policies to manage storage costs.
- **Example (Structured Logging):**

```javascript
// Application logging
const winston = require("winston");
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
```

### **3. Persistent Storage**

- **Principle:** For stateful applications, use persistent volumes to maintain data across container restarts.
- **Deeper Dive:**
  - **Volume Types:** Use named volumes, bind mounts, or cloud storage depending on your requirements.
  - **Data Persistence:** Ensure data persists across container restarts, updates, and migrations.
  - **Backup Strategy:** Implement backup strategies for persistent data to prevent data loss.
  - **Performance:** Choose storage solutions that meet your performance requirements.
- **Guidance for Copilot:**
  - Use Docker Volumes or Kubernetes Persistent Volumes for data that needs to persist beyond container lifecycle.
  - Never store persistent data inside the container's writable layer.
  - Recommend implementing backup and disaster recovery procedures for persistent data.
  - Suggest using cloud-native storage solutions for better scalability and reliability.
- **Example (Docker Volume Usage):**

```yaml
services:
  database:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

volumes:
  postgres_data:
```

### **4. Networking**

- **Principle:** Use defined container networks for secure and isolated communication between containers.
- **Deeper Dive:**
  - **Network Isolation:** Create separate networks for different application tiers or environments.
  - **Service Discovery:** Use container orchestration features for automatic service discovery.
  - **Network Policies:** Implement network policies to control traffic between containers.
  - **Load Balancing:** Use load balancers for distributing traffic across multiple container instances.
- **Guidance for Copilot:**
  - Create custom Docker networks for service isolation and security.
  - Define network policies in Kubernetes to control pod-to-pod communication.
  - Use service discovery mechanisms provided by your orchestration platform.
  - Implement proper network segmentation for multi-tier applications.
- **Example (Docker Network Configuration):**

```yaml
services:
  web:
    image: nginx
    networks:
      - frontend
      - backend

  api:
    image: myapi
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true
```

### **5. Orchestration (Kubernetes, Docker Swarm)**

- **Principle:** Use an orchestrator for managing containerized applications at scale.
- **Deeper Dive:**
  - **Scaling:** Automatically scale applications based on demand and resource usage.
  - **Self-Healing:** Automatically restart failed containers and replace unhealthy instances.
  - **Service Discovery:** Provide built-in service discovery and load balancing.
  - **Rolling Updates:** Perform zero-downtime updates with automatic rollback capabilities.
- **Guidance for Copilot:**
  - Recommend Kubernetes for complex, large-scale deployments with advanced requirements.
  - Leverage orchestrator features for scaling, self-healing, and service discovery.
  - Use rolling update strategies for zero-downtime deployments.
  - Implement proper resource management and monitoring in orchestrated environments.
- **Example (Kubernetes Deployment):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:latest
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
```

## Dockerfile Review Checklist

- [ ] Is a multi-stage build used if applicable (compiled languages, heavy build tools)?
- [ ] Is a minimal, specific base image used (e.g., `alpine`, `slim`, versioned)?
- [ ] Are layers optimized (combining `RUN` commands, cleanup in same layer)?
- [ ] Is a `.dockerignore` file present and comprehensive?
- [ ] Are `COPY` instructions specific and minimal?
- [ ] Is a non-root `USER` defined for the running application?
- [ ] Is the `EXPOSE` instruction used for documentation?
- [ ] Is `CMD` and/or `ENTRYPOINT` used correctly?
- [ ] Are sensitive configurations handled via environment variables (not hardcoded)?
- [ ] Is a `HEALTHCHECK` instruction defined?
- [ ] Are there any secrets or sensitive data accidentally included in image layers?
- [ ] Are there static analysis tools (Hadolint, Trivy) integrated into CI?

## Troubleshooting Docker Builds & Runtime

### **1. Large Image Size**

- Review layers for unnecessary files. Use `docker history <image>`.
- Implement multi-stage builds.
- Use a smaller base image.
- Optimize `RUN` commands and clean up temporary files.

### **2. Slow Builds**

- Leverage build cache by ordering instructions from least to most frequent change.
- Use `.dockerignore` to exclude irrelevant files.
- Use `docker build --no-cache` for troubleshooting cache issues.

### **3. Container Not Starting/Crashing**

- Check `CMD` and `ENTRYPOINT` instructions.
- Review container logs (`docker logs <container_id>`).
- Ensure all dependencies are present in the final image.
- Check resource limits.

### **4. Permissions Issues Inside Container**

- Verify file/directory permissions in the image.
- Ensure the `USER` has necessary permissions for operations.
- Check mounted volumes permissions.

### **5. Network Connectivity Issues**

- Verify exposed ports (`EXPOSE`) and published ports (`-p` in `docker run`).
- Check container network configuration.
- Review firewall rules.

## Conclusion

Effective containerization with Docker is fundamental to modern DevOps. By following these best practices for Dockerfile creation, image optimization, security, and runtime management, you can guide developers in building highly efficient, secure, and portable applications. Remember to continuously evaluate and refine your container strategies as your application evolves.

---

<!-- End of Containerization & Docker Best Practices Instructions -->
