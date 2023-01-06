import { createContext, useMemo, useReducer } from 'react'
import {
  CssBaseline,
  Dialog,
  Drawer,
  Snackbar,
  Theme,
  ThemeProvider,
} from '@mui/material'
import { Error } from '@/components/ui/Error'
import { uiReducer } from './reducer'
import { State, UIContextType } from './types'

export const uiContext = createContext<UIContextType | undefined>(undefined)

type Props = {
  theme: Theme
  children?: React.ReactNode
}

const initialState: State = {
  snackbarState: {
    open: false,
    message: '',
    autoHideDuration: 4000,
  },
  drawerState: {
    open: false,
    component: null,
  },
  dialogState: {
    open: false,
    component: null,
  },
  error: null,
}

export function UIProvider({ theme, children }: Props) {
  const [state, dispatch] = useReducer(uiReducer, initialState)

  const handleDrawerClose = () => {
    dispatch({ type: 'HIDE_DRAWER' })
  }

  const handleDialogClose = () => {
    dispatch({ type: 'HIDE_DIALOG' })
  }

  const handleSnackbarClose = (_: unknown, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch({ type: 'HIDE_SNACKBAR' })
  }

  const value: UIContextType = useMemo(
    () => ({
      showDrawer(component) {
        dispatch({ type: 'SHOW_DRAWER', payload: component })
      },
      hideDrawer: handleDrawerClose,
      showDialog(component) {
        dispatch({ type: 'SHOW_DIALOG', payload: component })
      },
      hideDialog: handleDialogClose,
      showSnackbar(params) {
        dispatch({ type: 'SHOW_SNACKBAR', payload: params })
      },
      showError(params) {
        dispatch({ type: 'SHOW_ERROR', payload: params })
      },
      hideError() {
        dispatch({ type: 'HIDE_ERROR' })
      },
    }),
    [dispatch]
  )

  const { drawerState, dialogState, snackbarState, error } = state

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <uiContext.Provider value={value}>
        {children}
        <Drawer
          css={theme => ({
            zIndex: theme.zIndex.drawer + 2,
          })}
          anchor="right"
          open={drawerState.open}
          onClose={handleDrawerClose}
          elevation={1}
        >
          {drawerState.component}
        </Drawer>
        <Dialog
          open={dialogState.open}
          onClose={handleDialogClose}
          maxWidth={'xl'}
        >
          {dialogState.component}
        </Dialog>
        <Snackbar
          open={snackbarState.open}
          onClose={handleSnackbarClose}
          autoHideDuration={snackbarState.autoHideDuration}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          message={snackbarState.message}
        />
        {error && <Error message={error.message} snackbar />}
      </uiContext.Provider>
    </ThemeProvider>
  )
}
