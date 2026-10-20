import useMediaQuery from '@mui/material/useMediaQuery'
import { animated, useSpring, type SpringValue } from '@react-spring/web'
import { useEffect } from 'react'

const desktopQuery = '(min-width: 1280px) and (hover: hover) and (pointer: fine)'
const layers = [
  { name: 'distant', travel: 54 },
  { name: 'woodland', travel: 61 },
  { name: 'foreground', travel: 66.6667 },
] as const

type Layer = (typeof layers)[number]['name']
type Side = 'left' | 'right'
type TreePosition = readonly [x: number, y: number, scale: number]

const distantTrees: readonly TreePosition[] = [
  [110, 520, 0.75],
  [30, 930, 0.9],
  [150, 1310, 0.85],
  [55, 1700, 1],
  [155, 2110, 0.9],
]

const woodlandTrees: readonly TreePosition[] = [
  [30, 660, 1.1],
  [140, 1080, 1.2],
  [35, 1490, 1.35],
  [145, 1890, 1.15],
  [80, 2300, 1.25],
]

const foregroundTrees: readonly TreePosition[] = [
  [0, 790, 1.7],
  [100, 1300, 1.6],
  [12, 1830, 1.9],
  [32, 2360, 1.65],
]

function PineTrees({ positions }: { positions: readonly TreePosition[] }) {
  return positions.map(([x, y, scale]) => (
    <g key={y} className='terrain-pine' transform={`translate(${x} ${y}) scale(${scale})`}>
      <path className='terrain-trunk' d='M-7-55L-10 26H11L7-55Z' />
      <path d='M0-270L-24-225H-14L-43-181H-26L-61-132H-40L-80-77H-52L-92-22Q-45-12-10-17H10Q45-12 92-22L52-77H80L40-132H61L26-181H43L14-225H24Z' />
    </g>
  ))
}

function TerrainArtwork({ layer }: { layer: Layer }) {
  switch (layer) {
    case 'distant':
      return (
        <>
          <path className='terrain-hills' d='M0 1860Q80 1800 160 1870T240 1920V2400H0Z' />
          <g className='terrain-ridge'>
            <PineTrees positions={distantTrees} />
          </g>
        </>
      )
    case 'woodland':
      return (
        <g className='terrain-trees-back'>
          <PineTrees positions={woodlandTrees} />
        </g>
      )
    case 'foreground':
      return (
        <g className='terrain-trees-front'>
          <PineTrees positions={foregroundTrees} />
        </g>
      )
  }
}

function ForestFloor({ side, progress }: { side: Side; progress?: SpringValue<number> }) {
  return (
    <animated.svg
      className='terrain-floor'
      viewBox='0 0 240 210'
      focusable='false'
      style={{
        // The ground comes into view near the footer; its SVG keeps the elk's proportions intact.
        transform: progress
          ? progress.to((value) => `translate3d(0, ${Math.max(0, (1 - value) * 500)}%, 0)`)
          : 'translate3d(0, 0%, 0)',
      }}>
      <path className='terrain-ground' d='M0 191Q55 178 115 194T240 190V210H0Z' />
      {side === 'right' && (
        <g className='terrain-elk' transform='translate(36 160) scale(1.05)'>
          <path d='M20-10C13-17 11-32 18-41C26-52 52-53 73-47L88-42L96-61L99-75L112-82L130-79L140-69L135-61L119-59L111-40L103-16L94-5L92 35H85L84 3L76-8L60-5L47-7L35 5L28 35H21L24-1Z' />
          <path d='M38-5L43 11L40 35H34L33 9L29 0ZM76-7L79 35H72L67 1ZM19-35L6-39L12-27L22-24ZM99-75L95-94L106-86L113-79Z' />
          <path
            className='terrain-antlers'
            d='M111-80L108-101L94-116L89-132M100-109L84-112L78-122M108-101L113-120L108-133M113-120L125-125L128-137M109-96L129-107L135-122'
          />
        </g>
      )}
      <g className='terrain-rocks'>
        <path d='M0 205L8 173L31 158L59 164L77 187L75 210H0ZM63 210L72 193L94 188L112 198L116 210ZM172 210L182 186L202 179L226 189L240 210Z' />
        <path
          className='terrain-rock-faces'
          d='M8 173L31 158L40 181L20 194ZM182 186L202 179L211 198L192 202Z'
        />
      </g>
    </animated.svg>
  )
}

function TerrainScene({
  progress,
  reveal,
}: {
  progress?: SpringValue<number>
  reveal?: SpringValue<number>
}) {
  return (
    <animated.div className='terrain-journey' aria-hidden='true' style={{ opacity: reveal ?? 1 }}>
      {(['left', 'right'] as const).map((side) => (
        <div key={side} className={`terrain-rail terrain-rail--${side}`}>
          <div className='terrain-world'>
            {layers.map(({ name, travel }) => (
              <animated.svg
                key={name}
                className={`terrain-layer terrain-layer--${name}`}
                viewBox='0 0 240 2400'
                preserveAspectRatio='none'
                focusable='false'
                style={{
                  transform: progress
                    ? progress.to((value) => `translate3d(0, ${-value * travel}%, 0)`)
                    : 'translate3d(0, -34%, 0)',
                }}>
                <TerrainArtwork layer={name} />
              </animated.svg>
            ))}
            <ForestFloor side={side} progress={progress} />
          </div>
        </div>
      ))}
    </animated.div>
  )
}

function AnimatedTerrain() {
  const [{ progress, reveal }, api] = useSpring(() => ({
    progress: 0,
    reveal: 0,
    config: { mass: 1, tension: 170, friction: 30, clamp: true },
  }))

  useEffect(() => {
    let frame: number | undefined
    const readPosition = () => ({
      progress: Math.max(
        0,
        Math.min(
          1,
          window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
        ),
      ),
      reveal: Math.max(0, Math.min(1, (window.scrollY - 300) / 450)),
    })
    const update = () => {
      frame = undefined
      void api.start(readPosition())
    }
    const schedule = () => {
      frame ??= window.requestAnimationFrame(update)
    }

    // Direct section links and restored scroll positions should start in the right landscape.
    api.set(readPosition())
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [api])

  return <TerrainScene progress={progress} reveal={reveal} />
}

export default function TerrainJourney() {
  const desktop = useMediaQuery(desktopQuery)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  if (!desktop) return null
  return reducedMotion ? <TerrainScene /> : <AnimatedTerrain />
}
