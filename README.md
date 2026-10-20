# Nate's Portfolio

Nathaniel P. Young's portfolio, built with React 19, TypeScript, Vite 8, Material UI, and Bun.

The main page adapts the design from
[portfolio2023](https://github.com/RazorzMcLazorz/portfolio2023) (source commit `5905eb9`):
sunrise/sunset mountain artwork, Iceberg typography, offset-shadow cards, work experience, projects,
orbiting technologies, about/contact, résumé, and references. The existing Bun/Vite toolchain is
retained; this is not a migration back to Next.js.

The theme switch remembers your choice locally and defaults to sunset. Skill orbits pause on hover,
keyboard focus, or the pause button. Narrow screens and reduced-motion preferences use a static
technology list. All assets and the font are served locally; the font license is included alongside
it.

On desktop screens (1280px+ with a fine pointer), React Spring moves three simple SVG layers in the
side gutters as you scroll: large, side-on pine trees with distant woodland behind them. Rocky
ground and a simple elk silhouette come into view near the footer. The reading column stays clear,
both themes have matching scenery, and scrolling remains native. Smaller/touch screens do not mount
the scenery or its scroll listeners; reduced-motion users get a static illustration. The terrain is
only shown on the home page.

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
  theme.ts                 # Sunrise/sunset Material UI palettes
  SceneryContext.ts        # Shared theme selection
  index.css                # Responsive layout and global styles
  components/
    common/                # Navigation, layout, original signature
    home/                  # Single-page portfolio, experience, about/education
    projects/              # Typed project data and cards
    skills/                # Accessible skill orbits and background
    contact/               # Contact links, references, résumé
  test/                    # React Testing Library setup
tests/e2e/                 # Playwright user-flow tests
public/assets/Resume.pdf   # Résumé imported from portfolio2023; review before publishing
public/assets/concept/     # Original artwork, logo, photo, and licensed Iceberg font
```

There is one responsive component tree for mobile and desktop, with keyboard navigation, a skip
link, route/section focus handling, and reduced-motion support. Navigation links to sections of the
home page; `/projects`, `/skills`, and `/contact` remain available as directly accessible pages. The
résumé uses the browser's PDF viewer with always-available open/download links rather than a
Webpack-specific renderer.

Legacy project descriptions and source repositories were retained, with the concept's client
projects and portfolio entry added. The cabinetry project uses the concept's `WolfsBaneWebsite`
source link. Private repositories are labeled without exposing source links. The six old Heroku
demos returned 404 during migration, so their URLs are retained as `archivedDemo` metadata but are
not clickable. Allergen Buddy's domain failed DNS resolution during the theme migration, so its URL
is also retained only as archived metadata. Wild Haven responded successfully and keeps its live
link. `plannedProjects` retains the unpublished HJReptiles entry. Dyno Nobel's work summary was
updated with Nate's 2021–2026 contributions, and Nate confirmed the role is current in October 2026
(“May 2021 – Present”). RoviTracker's work summary is based on Nate's commits and source code in the
local frontend and QA repositories, covering 2020–2021; its employment dates remain from the 2023
concept. Both work cards open highlights in bounded, scrollable overlays without resizing the cards
or page; the panels close with their close button, Escape, or a click outside. Confirm current
project statuses, remaining education/employment details, reference contact details, and the résumé
before publishing; the résumé PDF has not been updated to match these work summaries.

## Deployment

Deploy **`dist/`**, not CRA's old `build/` directory. Configure the host to serve `index.html` for
application routes such as `/projects`, `/skills`, and `/contact`. Serve real static files directly
(especially the PDF and worker), not through that fallback.

### Netlify

`netlify.toml` sets the build command to `bun run build` and the publish directory to `dist`,
overriding the old Netlify UI settings (`npm run build` / `build`). Bun is pinned to the project's
version and installs use the frozen lockfile; Node uses `.node-version`.

The SPA rewrite serves `index.html` for application routes while real assets, including the résumé
and migration worker, take precedence. After deploying this configuration, retry the **latest branch
commit** with Netlify's clear-cache option if the old deployment settings or dependencies persist.

### Other hosts and subdirectories

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
