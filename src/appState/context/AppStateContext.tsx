// @ts-nocheck
import { createElement, useContext, useReducer } from 'react'
import { AppStateContextProps, AppStateContextState } from '../types'
import appStateContextReducer from './appStateContextReducer'

const AppStateContext = createElement({})
const AppStateDispatch = createElement({})
const AppStateDispatchProvider = AppStateDispatch.Provider

export const initialState: AppStateContextState = {}

export default function AppStateContextProvider({ children }: AppStateContextProps) {
  const [appState, dispatch] = useReducer(appStateContextReducer, initialState)

  return (
    <AppStateContext.Provider value={appState}>
      <AppStateDispatchProvider value={dispatch}>{children}</AppStateDispatchProvider>
    </AppStateContext.Provider>
  )
}

export const useAppStateContext = () => {
  const context = useContext(AppStateContext)

  if (!context) throw new Error('useAppStateContext must be used within a AppStateContextProvider')

  return context
}

export const useAppStateDispatch = () => {
  const context = useContext(AppStateDispatch)

  if (!context) throw new Error('useAppStateDispatch must be used within a AppStateContextProvider')

  return context
}
