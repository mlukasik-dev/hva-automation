import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export function FormDialog({ open, handleSubmit }) {
  const [creds, setCreds] = useState({ login: "", password: "", apiKey: "" });

  return (
    <Dialog open={open}>
      <DialogTitle>Введіть необхідні дані</DialogTitle>
      <DialogContent>
        <DialogContentText>
          В разі проблем пишіть <a href="https://t.me/mlukasik">@mlukasik.</a>
        </DialogContentText>
        <TextField
          value={creds.login}
          onChange={(e) =>
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
          onChange={(e) =>
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
        <TextField
          value={creds.apiKey}
          onChange={(e) =>
            setCreds({
              ...creds,
              apiKey: e.target.value.trim(),
            })
          }
          margin="dense"
          id="api-key"
          label="API ключ"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSubmit(creds)}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  );
}
