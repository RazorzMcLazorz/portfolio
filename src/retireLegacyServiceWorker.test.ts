import { afterEach, describe, expect, it, vi } from 'vitest'
import { retireLegacyServiceWorker } from './retireLegacyServiceWorker'

afterEach(() => {
  Reflect.deleteProperty(navigator, 'serviceWorker')
})

describe('retireLegacyServiceWorker', () => {
  it('does nothing when service workers are unavailable', async () => {
    await expect(retireLegacyServiceWorker()).resolves.toBeUndefined()
  })

  it('unregisters only the old CRA worker, including a waiting or installing worker', async () => {
    const legacyUrl = new URL('/service-worker.js', location.origin).href
    const active = { active: { scriptURL: legacyUrl }, unregister: vi.fn().mockResolvedValue(true) }
    const waiting = {
      waiting: { scriptURL: legacyUrl },
      unregister: vi.fn().mockResolvedValue(true),
    }
    const installing = {
      installing: { scriptURL: legacyUrl },
      unregister: vi.fn().mockResolvedValue(true),
    }
    const unrelated = {
      active: { scriptURL: new URL('/other-app/sw.js', location.origin).href },
      unregister: vi.fn(),
    }
    const empty = { unregister: vi.fn() }
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        getRegistrations: vi
          .fn()
          .mockResolvedValue([active, waiting, installing, unrelated, empty]),
      },
    })

    await retireLegacyServiceWorker()
    expect(active.unregister).toHaveBeenCalledOnce()
    expect(waiting.unregister).toHaveBeenCalledOnce()
    expect(installing.unregister).toHaveBeenCalledOnce()
    expect(unrelated.unregister).not.toHaveBeenCalled()
    expect(empty.unregister).not.toHaveBeenCalled()
  })

  it('allows errors to be handled by the caller', async () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistrations: vi.fn().mockRejectedValue(new Error('Unavailable')) },
    })
    await expect(retireLegacyServiceWorker()).rejects.toThrow('Unavailable')
  })
})
