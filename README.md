# Nate's Portfolio

Nathaniel P. Young's portfolio, built with React 19, TypeScript, Vite 8, Material UI, and Bun.

## Getting started

- Bun **1.4.2+** (the committed lockfile uses Bun).
- Node **24.22.0** recommended; see `.node-version`. Vite, Vitest, and other tooling run on Node.

```sh
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:5173>. Use `bun run test`, not `bun test`: the tests use Vitest and jsdom.

## Commands

| Command                                           | Purpose                                                      |
| ------------------------------------------------- | ------------------------------------------------------------ |
| `bun run dev`                                     | Vite development server (`start` is an alias)                |
| `bun run build`                                   | Strict TypeScript checks and production build to `dist/`     |
| `bun run preview`                                 | Serve the production build locally                           |
| `bun run typecheck`                               | Check application, config, and test types                    |
| `bun run lint`                                    | ESLint, including React hook checks                          |
| `bun run format` / `bun run format:check`         | Write / verify Prettier formatting                           |
| `bun run test` / `bun run test:watch`             | Component/unit tests once / in watch mode                    |
| `bun run test:ui`                                 | Vitest UI                                                    |
| `bun run test:coverage`                           | V8 coverage with enforced thresholds                         |
| `bun run test:e2e`                                | Desktop and mobile Chromium tests against a production build |
| `bun run test:e2e:headed` / `bun run test:e2e:ui` | Interactive browser tests                                    |
| `bun run check`                                   | Formatting, lint, coverage, types, and build                 |
| `bun audit`                                       | Check installed dependencies for known vulnerabilities       |

Install the browser before running E2E tests:

```sh
bunx --no-install playwright install chromium
bun run test:e2e
```

Coverage gates: 90% statements, functions, and lines; 85% branches. Reports are in `coverage/`.
Husky runs lint-staged and unit tests before commits, and coverage before pushes. CI also checks
dependencies and runs desktop/mobile browser tests. No live deployments or credentials are required.

TypeScript stays on 6.0 until typescript-eslint supports TypeScript 7. Keep the Vitest packages on
matching versions when upgrading.

## Structure and content

```text
src/
  main.tsx                 # React entry point
  App.tsx                  # Theme and routes
  theme.ts                 # Shared Material UI theme
  index.css                # Responsive layout and global styles
  components/
    common/                # Navigation, layout, original signature
    home/                  # Introduction, education, technology links
    projects/              # Typed project data and cards
    skills/                # Skills and background
    contact/               # Contact links, references, résumé
  test/                    # React Testing Library setup
tests/e2e/                 # Playwright user-flow tests
public/assets/Resume.pdf   # Original résumé; replace here when updating
```

There is one responsive component tree for mobile and desktop, with keyboard navigation, a skip
link, route focus handling, and reduced-motion support. The résumé uses the browser's PDF viewer
with always-available open/download links rather than a Webpack-specific renderer.

Project descriptions and source repositories were retained. The six old Heroku demos returned 404
during migration, so their URLs are retained as `archivedDemo` metadata but are not clickable.
`plannedProjects` retains the unpublished HJReptiles entry. Confirm current project statuses,
education/employment details, reference contact details, and the résumé before publishing; the
migration does not verify or invent updated biographical information.

## Deployment

Deploy **`dist/`**, not CRA's old `build/` directory. Configure the host to serve `index.html` for
application routes such as `/projects`, `/skills`, and `/contact`. Serve real static files directly
(especially the PDF and worker), not through that fallback.

For a subdirectory deployment:

```sh
bun run build --base /portfolio/
```

The router and asset paths use Vite's base URL. Deploy that output at `/portfolio/` and configure
the fallback to `/portfolio/index.html`.

The old CRA service worker is no longer registered. Keep `public/service-worker.js` deployed as a
migration-only worker so returning visitors can leave the old cache-first version. The app also
unregisters only the previous portfolio worker; it does not remove other apps' workers or caches.
Offline/PWA caching is not enabled. A previously cached tab may need to be reloaded after the worker
updates. No environment variables are needed; any future `VITE_*` variables are public browser data,
not secrets.
