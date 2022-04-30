// import { ACTION_TYPES } from './appStateActionConstants'

export default function reducer(state: any, action: { type: any; key: any; payload: any }) {
  switch (action.type) {
    // case ACTION_TYPES.ASDF:
    case 'type':
      return {
        ...state,
        [action.key]: action.payload,
      }
    default:
      return state
  }
}
