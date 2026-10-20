import { createContext } from 'react'

export type Scenery = 'sunset' | 'sunrise'

export const SceneryContext = createContext<{
  scenery: Scenery
  toggleScenery: () => void
}>({ scenery: 'sunset', toggleScenery: () => {} })
