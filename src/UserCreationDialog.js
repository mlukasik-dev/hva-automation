import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const COURSE_IDS = {
  Громада: 10128,
  Культура: 10131,
  "Консультування плюс сім'я": 10126,
};

export function UserCreationDialog({ open, user: propUser, api, handleClose }) {
  const [user, setUser] = useState(propUser);
  useEffect(() => {
    setUser(propUser);
  }, [propUser]);
  if (!user) {
    return;
  }
  const txt = getMessage(user);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Дії</DialogTitle>
      <DialogContent>
        <TextField
          style={{ marginTop: 5, marginBottom: 10 }}
          label="Логін"
          size="small"
          value={user.login}
          onChange={(e) => setUser({ ...user, login: e.target.value })}
        />
        <TextField
          style={{ marginTop: 5, marginBottom: 10 }}
          label="Email"
          size="small"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <DialogContentText component="pre">{txt}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            api
              .createUser(user)
              .then((r) => {
                if (r.ok) {
                  alert("Створено особистий кабінет");
                } else {
                  alert("Помилка при створені особистого кабінету");
                }
              })
              .catch(() => alert("Помилка при створені особистого кабінету"));
          }}
        >
          Створити кабінет
        </Button>
        <Button
          style={{ textAlign: "center" }}
          component="a"
          target="_blank"
          href={api.getLink(user.id, user.course)}
        >
          Поставити галочку
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            const id = await api.getUserId(user.login);
            api.addToCourse(COURSE_IDS[user.course], id);
          }}
        >
          Додати до курсу
        </Button>
        <Button
          onClick={() => {
            copyTextToClipboard(txt);
          }}
        >
          Копіювати повідомлення
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function getMessage(user) {
  return `Добрий день, ${user.name}!
Повідомляємо ваші дані до навчального кабінету:

Логін: ${user.login}
Пароль: ${user.password}

Вас вже підключено до курсу 🎓
Заходьте на сайт ХВА: https://hva.org.ua`;
}
