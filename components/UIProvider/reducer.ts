import { Action, State } from './types'

export function uiReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SHOW_DRAWER':
      return {
        ...state,
        drawerState: {
          open: true,
          component: action.payload,
        },
      }
    case 'HIDE_DRAWER':
      return {
        ...state,
        drawerState: {
          open: false,
          component: undefined,
        },
      }
    case 'SHOW_DIALOG':
      return {
        ...state,
        dialogState: {
          open: true,
          component: action.payload,
        },
      }
    case 'HIDE_DIALOG':
      return {
        ...state,
        dialogState: {
          open: false,
          component: undefined,
        },
      }
    case 'SHOW_SNACKBAR':
      return {
        ...state,
        snackbarState: {
          ...state.snackbarState,
          ...action.payload,
          open: true,
        },
      }
    case 'HIDE_SNACKBAR':
      return {
        ...state,
        snackbarState: {
          ...state.snackbarState,
          open: false,
        },
      }
    case 'SHOW_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'HIDE_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}
