export type UIContextType = {
  showDrawer: (component: React.ReactNode) => void
  hideDrawer: () => void
  showDialog: (component: React.ReactNode) => void
  hideDialog: () => void
  showSnackbar: (params: ShowSnackbarParams) => void
  showError: (params: ShowErrorParams) => void
  hideError: () => void
}

export type ShowSnackbarParams = {
  message: string
  autoHideDuration?: number // Defaults to 1000
}

export type ShowErrorParams = {
  message: string
}

export type State = {
  snackbarState: {
    open: boolean
    message: string
    autoHideDuration: number
  }
  drawerState: {
    open: boolean
    component: React.ReactNode
  }
  dialogState: {
    open: boolean
    component: React.ReactNode
  }
  error: { message: string } | null
}

export type Action =
  | { type: 'SHOW_SNACKBAR'; payload: ShowSnackbarParams }
  | { type: 'HIDE_SNACKBAR' }
  | { type: 'SHOW_DRAWER'; payload: React.ReactNode }
  | { type: 'HIDE_DRAWER' }
  | { type: 'SHOW_DIALOG'; payload: React.ReactNode }
  | { type: 'HIDE_DIALOG' }
  | { type: 'SHOW_ERROR'; payload: { message: string } }
  | { type: 'HIDE_ERROR' }
