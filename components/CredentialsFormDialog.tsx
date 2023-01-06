import { useState } from 'react'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { InCaseOfProblems } from './InCaseOfProblems'

export type Credentials = {
  login: string
  password: string
}

type Props = {
  handleSubmit: (creds: Credentials) => void
}

export function CredentialsFormDialog({ handleSubmit }: Props) {
  const [creds, setCreds] = useState({ login: '', password: '' })

  return (
    <>
      <DialogTitle>Введіть необхідні дані</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <InCaseOfProblems />
        </DialogContentText>
        <TextField
          value={creds.login}
          onChange={e =>
            setCreds({
              ...creds,
              login: e.target.value.trim(),
            })
          }
          margin="dense"
          id="name"
          label="Логін"
          fullWidth
        />
        <TextField
          value={creds.password}
          onChange={e =>
            setCreds({
              ...creds,
              password: e.target.value.trim(),
            })
          }
          margin="dense"
          id="password"
          label="Пароль"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSubmit(creds)}>Зберегти</Button>
      </DialogActions>
    </>
  )
}
