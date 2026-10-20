import { Globals } from '@react-spring/web'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TerrainJourney from './TerrainJourney'

let desktop = true
let reducedMotion = false
let observe: ReturnType<typeof vi.fn>
let disconnect: ReturnType<typeof vi.fn>
let resize: ResizeObserverCallback

beforeEach(() => {
  desktop = true
  reducedMotion = false
  Globals.assign({ skipAnimation: true })
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('min-width') ? desktop : reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  observe = vi.fn()
  disconnect = vi.fn()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback
      }
      observe = observe
      disconnect = disconnect
    },
  )
  vi.stubGlobal('innerHeight', 1000)
  vi.stubGlobal('scrollY', 0)
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(4000)
})

afterEach(() => {
  Globals.assign({ skipAnimation: false })
  vi.unstubAllGlobals()
})

describe('desktop terrain', () => {
  it('does not mount scenery or observe scrolling on smaller or touch screens', () => {
    desktop = false
    const { container } = render(<TerrainJourney />)
    expect(container).toBeEmptyDOMElement()
    expect(observe).not.toHaveBeenCalled()
  })

  it('provides static decorative SVGs without scroll tracking for reduced motion', () => {
    reducedMotion = true
    const { container } = render(<TerrainJourney />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('svg')).toHaveLength(8)
    expect(container.querySelectorAll('.terrain-elk')).toHaveLength(1)
    expect(container.querySelectorAll('.terrain-floor')).toHaveLength(2)
    expect(container.querySelectorAll('.terrain-pine')).toHaveLength(28)
    expect(container.querySelector('.terrain-river, .terrain-waterline')).not.toBeInTheDocument()
    for (const layer of container.querySelectorAll('svg')) {
      expect(layer).toHaveAttribute('focusable', 'false')
    }
    for (const layer of container.querySelectorAll<SVGElement>('.terrain-layer')) {
      expect(layer.style.transform).toBe('translate3d(0, -34%, 0)')
    }
    expect(container.querySelector<SVGElement>('.terrain-floor')?.style.transform).toBe(
      'translate3d(0, 0%, 0)',
    )
    expect(observe).not.toHaveBeenCalled()
    fireEvent.scroll(window)
    expect(container.querySelector('svg')?.style.transform).toBe('translate3d(0, -34%, 0)')
  })

  it('starts at a restored scroll position and moves the landscape at different depths', async () => {
    vi.stubGlobal('scrollY', 750)
    const { container } = render(<TerrainJourney />)
    const distant = container.querySelector<SVGElement>('.terrain-layer--distant')!
    const woodland = container.querySelector<SVGElement>('.terrain-layer--woodland')!
    const floor = container.querySelector<SVGElement>('.terrain-floor')!
    await waitFor(() => expect(distant.style.transform).toBe('translate3d(0, -13.5%, 0)'))
    expect(woodland.style.transform).toBe('translate3d(0, -15.25%, 0)')
    expect(floor.style.transform).toBe('translate3d(0, 375%, 0)')
    expect(container.firstChild).toHaveStyle({ opacity: 1 })
    expect(observe).toHaveBeenCalledWith(document.body)

    vi.stubGlobal('scrollY', 1500)
    fireEvent.scroll(window)
    await waitFor(() => expect(distant.style.transform).toBe('translate3d(0, -27%, 0)'))

    vi.stubGlobal('scrollY', 6000)
    fireEvent.resize(window)
    await waitFor(() => expect(distant.style.transform).toBe('translate3d(0, -54%, 0)'))
    expect(floor.style.transform).toBe('translate3d(0, 0%, 0)')

    vi.stubGlobal('scrollY', -100)
    act(() => resize([], {} as ResizeObserver))
    await waitFor(() => expect(distant.style.transform).toBe('translate3d(0, 0%, 0)'))
    expect(container.firstChild).toHaveStyle({ opacity: 0 })
  })

  it('coalesces scroll events and cancels queued work on unmount', () => {
    const request = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(42)
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const { unmount } = render(<TerrainJourney />)
    request.mockClear()
    fireEvent.scroll(window)
    fireEvent.scroll(window)
    expect(request).toHaveBeenCalledOnce()
    unmount()
    expect(cancel).toHaveBeenCalledWith(42)
    expect(disconnect).toHaveBeenCalledOnce()
    request.mockClear()
    fireEvent.scroll(window)
    fireEvent.resize(window)
    expect(request).not.toHaveBeenCalled()
  })
})
