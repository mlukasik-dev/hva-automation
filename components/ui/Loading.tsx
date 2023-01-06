import { CircularProgress } from '@mui/material'

export function Loading() {
  return (
    <div
      css={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress color="primary" />
    </div>
  )
}
