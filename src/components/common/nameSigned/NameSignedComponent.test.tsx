import { act, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import NameSignedComponent from './NameSignedComponent'

afterEach(() => vi.unstubAllGlobals())

it('starts drawing only when revealed and stays drawn after leaving view', () => {
  let intersect: (visible: boolean) => void = () => {}
  const unobserve = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: (entries: { target: Element; isIntersecting: boolean }[]) => void) {
        intersect = (visible) => {
          callback([{ target: document.querySelector('.signature')!, isIntersecting: visible }])
        }
      }
      observe = vi.fn()
      unobserve = unobserve
    },
  )

  const { container } = render(<NameSignedComponent />)
  const signature = container.querySelector('.signature')
  expect(signature).not.toHaveClass('signature--visible')

  act(() => intersect(false))
  expect(signature).not.toHaveClass('signature--visible')

  act(() => intersect(true))
  expect(signature).toHaveClass('signature--visible')
  expect(unobserve).toHaveBeenCalledWith(signature)

  act(() => intersect(false))
  expect(signature).toHaveClass('signature--visible')
})
