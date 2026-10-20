import type { Highlight } from '../common/HighlightsPopover'

export interface PortfolioProject {
  id: string
  title: string
  summary: string
  date: string
  status: 'active' | 'past' | 'planned'
  github?: string
  website?: string
  private?: boolean
  archivedDemo?: string
  highlights?: Highlight[]
}

// These original Heroku demos returned 404 when checked during the migration.
// Keep their URLs as historical metadata, but don't send visitors to broken demos.
const projects: PortfolioProject[] = [
  {
    id: 'artisan-ray-tech',
    title: 'Artisan Ray Tech Home Page',
    summary:
      'Our company home page, built with React and TypeScript to showcase Artisan Ray Tech’s creations and connect visitors with our Square store.',
    date: 'Company project',
    status: 'active',
    website: 'https://artisanraytech.com',
    private: true,
  },
  {
    id: 'game-mapster',
    title: 'Game Mapster',
    summary:
      'An interactive game-map website, starting with ARC Raiders. Players can explore map layouts and keep track of their discoveries.',
    date: 'Company project',
    status: 'active',
    website: 'https://gamemapster.com',
    private: true,
    highlights: [
      {
        title: 'Interactive map exploration',
        description:
          'Built a React and TypeScript map viewer with Leaflet, smooth zooming, multi-level maps, and shareable game and map URLs.',
      },
      {
        title: 'Locations and community tools',
        description:
          'Developed searchable marker filters, quest grouping, custom icons, and shared location editing with revision checks and moderation tools.',
      },
      {
        title: 'Accounts and discovery tracking',
        description:
          'Implemented local guest discoveries and Appwrite account progress, keeping them separate and guarding against failed saves and stale account or map responses.',
      },
      {
        title: 'Accessible map controls',
        description:
          'Added keyboard-accessible markers and map controls, responsive layouts, and selectable color-vision palettes with distinct category symbols.',
      },
      {
        title: 'Map-loading performance',
        description:
          'Prioritized the selected map, prefetched other layers at low priority, and built bounded memory and browser image caches with cancellation and storage-failure fallbacks.',
      },
      {
        title: 'Testing and delivery',
        description:
          'Added Vitest and Testing Library coverage, desktop and mobile Playwright tests, quality gates, and Gitea-to-Netlify deployment workflows.',
      },
    ],
  },
  {
    id: 'wild-haven',
    title: 'Wild Haven / Wolf Haven',
    summary:
      'Rewrote the entire website in React, replacing the original PHP-based application. Continue to develop and maintain the site.',
    date: 'Company project',
    status: 'active',
    website: 'https://wild-haven.app',
    private: true,
    highlights: [
      {
        title: 'Full-site rewrite',
        description:
          'Rewrote the entire legacy PHP/MySQL website as a React and TypeScript application with Vite.',
      },
      {
        title: 'Gameplay and community',
        description:
          'Developed character profiles, inventories, quests, combat, packs, forums, friends, messaging, and notifications.',
      },
      {
        title: 'Custom artwork and marketplace',
        description:
          'Built artist tools, custom character previews, design listings, favorites, and order-management interfaces.',
      },
      {
        title: 'Backend and permissions',
        description:
          'Built Bun-based Appwrite Functions for gameplay and community operations, with server-side authorization and role-gated staff tools.',
      },
      {
        title: 'Design system and quality',
        description:
          'Created reusable UI components with Storybook coverage, unit and browser tests, accessibility checks, and Sentry monitoring.',
      },
      {
        title: 'Migration and delivery',
        description:
          'Built a private legacy-data archive importer and Gitea deployment workflows with validation, health checks, and rollback support.',
      },
    ],
  },
  {
    id: 'portfolio-v1',
    title: 'Portfolio',
    summary:
      'My personal portfolio, built with React and TypeScript and continually updated with a new design, current work, and a modern toolchain.',
    date: 'Personal project',
    status: 'active',
    github: 'https://github.com/RazorzMcLazorz/portfolio',
  },
  {
    id: 'allergen-buddy',
    title: 'Allergen Buddy',
    summary: 'A website that helps people with allergies plan events.',
    date: 'Client project',
    status: 'past',
    private: true,
    archivedDemo: 'https://allergenbuddy.com',
  },
  {
    id: 'wbcf',
    title: "Wolf's Bane Cabinetry and Furniture",
    summary:
      'A custom landing page for a cabinetry and furniture business. I worked with a friend to select a design and built the site using freely available stock photography.',
    date: 'August 2020 – January 2021',
    status: 'past',
    github: 'https://github.com/RazorzMcLazorz/WolfsBaneWebsite',
    archivedDemo: 'https://wbcf.herokuapp.com/',
  },
  {
    id: 'medicy',
    title: 'Medicy',
    summary:
      'An RTS-style browser game built with TypeScript, React, and CSS. Players manage a kingdom and its wealth, with events that challenge how they maintain it. This project explores building game interfaces without a component library.',
    date: 'Started March 2022',
    status: 'past',
    github: 'https://github.com/RazorzMcLazorz/medicy',
    archivedDemo: 'https://medicy.herokuapp.com/',
  },
  {
    id: 'ww1Sim',
    title: 'WW1 Simulation Tracker',
    summary:
      'My first database-backed website, built with Node.js and MySQL for my high school history teacher. It tracks player groups, decisions, resources, and rankings for a classroom World War I simulation.',
    date: 'November 2018 – August 2019',
    status: 'past',
    github: 'https://github.com/RazorzMcLazorz/WW1SimulationGame',
    archivedDemo: 'https://ww1sim.herokuapp.com/',
  },
  {
    id: 'medicyLegacy',
    title: 'Medicy Legacy',
    summary:
      'The original version of Medicy, archived after I decided to revisit the stack and start a new implementation.',
    date: 'April 2020 – March 2022',
    status: 'past',
    github: 'https://github.com/RazorzMcLazorz/Medicy_Legacy',
  },
  {
    id: 'wwOutpostSingle',
    title: 'World War Outpost',
    summary:
      'A twelve-round colony simulation focused on supplies, research, production, buildings, and small battles against a simple randomized enemy.',
    date: 'September – December 2018',
    status: 'past',
    github: 'https://github.com/RazorzMcLazorz/WWOutpost',
    archivedDemo: 'https://wwoutpost.herokuapp.com/',
  },
  {
    id: 'blackjack',
    title: 'Black Jack',
    summary:
      'An online Black Jack game combining JavaScript and React to create a playable browser-based card game.',
    date: 'September – October 2018',
    status: 'past',
    github: 'https://github.com/RazorzMcLazorz/BlackJackWebsite',
    archivedDemo: 'https://black-jack-website.herokuapp.com/',
  },
  {
    id: 'madlibs',
    title: 'Bottega Madlibs',
    summary: 'A browser-based Madlibs game that uses React state to turn user input into a story.',
    date: 'September – October 2018',
    status: 'past',
    github: 'https://github.com/RazorzMcLazorz/Madlibs',
    archivedDemo: 'https://madlibschallenge.herokuapp.com/',
  },
]

export const projectGroups: { title: string; projects: PortfolioProject[] }[] = [
  {
    title: 'Active Projects',
    projects: projects.filter(({ status }) => status === 'active'),
  },
  {
    title: 'Past Projects',
    projects: projects.filter(({ status }) => status === 'past'),
  },
]

// Retained from the original portfolio; not yet part of the published project groups.
export const plannedProjects: PortfolioProject[] = [
  {
    id: 'hjreptiles',
    title: 'HJReptiles',
    summary: 'A planned client website to showcase reptiles and connect with customers.',
    date: 'Planning stages',
    status: 'planned',
    github: 'https://github.com/RazorzMcLazorz/HJReptiles',
  },
]
