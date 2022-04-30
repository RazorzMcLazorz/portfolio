import useAppStateDispatchHook from './useAppStateDispatchHook'
import useAppStateContext from './context/AppStateContext'
import { AppStateHook, AppState, AppStateHelpers } from './types'

export default function useAppState(): AppStateHook {
  const helpers = useAppStateDispatchHook()
  // @ts-ignore
  const state = useAppStateContext()

  // Code goes here

  const hookState: AppState = {
    ...state,
  }

  const hookHelpers: AppStateHelpers = {
    ...helpers,
  }

  return [hookState, hookHelpers]
}
