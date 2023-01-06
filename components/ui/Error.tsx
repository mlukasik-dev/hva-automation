import { Alert } from '@mui/material'
import { useUI } from '@/components/UIProvider/useUI'

type Props = {
  message: string
  snackbar?: boolean
}

export function Error({ message, snackbar }: Props) {
  const ui = useUI()

  const handleClose = () => {
    ui.hideError()
  }

  return (
    <Alert
      variant="filled"
      severity="error"
      onClose={snackbar ? handleClose : undefined}
      css={
        snackbar
          ? theme => ({
              position: 'absolute',
              bottom: 30,
              right: 35,
              minWidth: 350,
              zIndex: theme.zIndex.snackbar,
            })
          : {}
      }
    >
      {message}
    </Alert>
  )
}
