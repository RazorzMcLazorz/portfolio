export interface PortfolioProject {
  id: string
  title: string
  summary: string
  date: string
  github: string
  archivedDemo?: string
}

// These original Heroku demos returned 404 when checked during the migration.
// Keep their URLs as historical metadata, but don't send visitors to broken demos.
export const projectGroups = [
  {
    title: 'Featured Project',
    projects: [
      {
        id: 'wbcf',
        title: "Wolf's Bane Cabinetry and Furniture",
        summary:
          'A custom landing page for a cabinetry and furniture business. I worked with a friend to select a design and built the site using freely available stock photography.',
        date: 'August 2020 – January 2021',
        github: 'https://github.com/RazorzMcLazorz/wbcf',
        archivedDemo: 'https://wbcf.herokuapp.com/',
      },
    ],
  },
  {
    title: 'Project Explorations',
    projects: [
      {
        id: 'medicy',
        title: 'Medicy',
        summary:
          'An RTS-style browser game built with TypeScript, React, and CSS. Players manage a kingdom and its wealth, with events that challenge how they maintain it. This project explores building game interfaces without a component library.',
        date: 'Started March 2022',
        github: 'https://github.com/RazorzMcLazorz/medicy',
        archivedDemo: 'https://medicy.herokuapp.com/',
      },
    ],
  },
  {
    title: 'Past Projects',
    projects: [
      {
        id: 'ww1Sim',
        title: 'WW1 Simulation Tracker',
        summary:
          'My first database-backed website, built with Node.js and MySQL for my high school history teacher. It tracks player groups, decisions, resources, and rankings for a classroom World War I simulation.',
        date: 'November 2018 – August 2019',
        github: 'https://github.com/RazorzMcLazorz/WW1SimulationGame',
        archivedDemo: 'https://ww1sim.herokuapp.com/',
      },
    ],
  },
  {
    title: 'Past Personal Projects',
    projects: [
      {
        id: 'medicyLegacy',
        title: 'Medicy Legacy',
        summary:
          'The original version of Medicy, archived after I decided to revisit the stack and start a new implementation.',
        date: 'April 2020 – March 2022',
        github: 'https://github.com/RazorzMcLazorz/Medicy_Legacy',
      },
      {
        id: 'wwOutpostSingle',
        title: 'World War Outpost',
        summary:
          'A twelve-round colony simulation focused on supplies, research, production, buildings, and small battles against a simple randomized enemy.',
        date: 'September – December 2018',
        github: 'https://github.com/RazorzMcLazorz/WWOutpost',
        archivedDemo: 'https://wwoutpost.herokuapp.com/',
      },
      {
        id: 'blackjack',
        title: 'Black Jack',
        summary:
          'An online Black Jack game combining JavaScript and React to create a playable browser-based card game.',
        date: 'September – October 2018',
        github: 'https://github.com/RazorzMcLazorz/BlackJackWebsite',
        archivedDemo: 'https://black-jack-website.herokuapp.com/',
      },
      {
        id: 'madlibs',
        title: 'Bottega Madlibs',
        summary:
          'A browser-based Madlibs game that uses React state to turn user input into a story.',
        date: 'September – October 2018',
        github: 'https://github.com/RazorzMcLazorz/Madlibs',
        archivedDemo: 'https://madlibschallenge.herokuapp.com/',
      },
    ],
  },
] satisfies { title: string; projects: PortfolioProject[] }[]

// Retained from the original portfolio; not yet part of the published project groups.
export const plannedProjects: PortfolioProject[] = [
  {
    id: 'hjreptiles',
    title: 'HJReptiles',
    summary: 'A planned client website to showcase reptiles and connect with customers.',
    date: 'Planning stages',
    github: 'https://github.com/RazorzMcLazorz/HJReptiles',
  },
]
