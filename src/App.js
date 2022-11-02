import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { transliterate } from "transliteration";
import { FormDialog } from "./FormDialog";

const ID = "1WUdFK28ijRp-R66PwPcNEekAB01OuxvEPcYfPt01TPE";
const RANGES = ["Громада", "Культура", "Консультування плюс сім'я"];
const RANGES_MAP = {
  Громада: 563749336,
  Культура: 918094572,
  "Консультування плюс сім'я": 862170911,
};

function App() {
  const [creds, setCreds] = useState(null);
  const [range, setRange] = useState(RANGES[0]);
  const [users, setUsers] = useState([]);

  const loadUsers = useCallback(() => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/${range}?key=${creds.apiKey}`;

    fetch(url)
      .then((r) => r.json())
      .then((body) => {
        let v = body.values;
        v.shift();
        v = v.filter((user) => user[3] !== "" && user[6] === "");
        setUsers(
          v.map((user) => ({
            id: user[0],
            surname: user[1],
            name: user[2],
            email: user[3],
            login: generateLogin(user),
            password: generatePassword(user),
          }))
        );
      })
      .catch(() =>
        alert(
          "Введені неправильні дані (перезавантажте сторінку та спробуйте ще раз)"
        )
      );
  }, [creds, range]);

  useEffect(() => {
    if (creds) {
      loadUsers();
    }
  }, [creds, loadUsers]);

  function createUser(user) {
    const authorization = `Basic ${btoa(creds.login + ":" + creds.password)}`;
    const url = "https://hva.org.ua/wp-json/wp/v2/users";
    const data = {
      username: user.login,
      name: user.surname + " " + user.name,
      email: user.email,
      password: user.password,
    };

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((r) => {
        if (r.ok) {
          alert("Створено особистий кабінет");
        } else {
          alert("Помилка при створені особистого кабінету");
        }
      })
      .catch(() => alert("Помилка при створені особистого кабінету"));
  }

  function getLink(id, range) {
    return `https://docs.google.com/spreadsheets/d/1WUdFK28ijRp-R66PwPcNEekAB01OuxvEPcYfPt01TPE/edit#gid=${
      RANGES_MAP[range]
    }&range=G${+id + 1}`;
  }

  const columns = [
    { field: "surname", headerName: "Прізвище", flex: 1 },
    { field: "name", headerName: "Іʼмя", flex: 1 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "login", headerName: "Логін", flex: 2 },
    { field: "password", headerName: "Пароль", flex: 3 },
    {
      field: "-",
      headerName: "Створити кабінет",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => createUser(params.row)}
        >
          Створити
        </Button>
      ),
      flex: 1,
    },
    {
      field: "--",
      headerName: "Копіювати повідомлення",
      renderCell: (params) => (
        <Button
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => {
            const txt = `Логін: ${params.row.login}
Пароль: ${params.row.password}`;
            return copyTextToClipboard(txt);
          }}
        >
          Копіювати
        </Button>
      ),
      flex: 1,
    },
    {
      field: "---",
      headerName: "Поставити галочку",
      renderCell: (params) => (
        <Button
          target="_blank"
          href={getLink(params.row.id, range)}
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
        >
          Галочка
        </Button>
      ),
      flex: 1,
    },
  ];

  return (
    <div>
      <FormControl style={{ margin: 15 }}>
        <Select value={range} onChange={(e) => setRange(e.target.value)}>
          {RANGES.map((range) => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={loadUsers}>
          Оновити
        </Button>
      </FormControl>
      <DataGrid autoHeight columns={columns} rows={users} />
      <FormDialog open={creds === null} handleSubmit={setCreds} />
    </div>
  );
}

function generateLogin(user) {
  return user[3].substring(0, user[3].indexOf("@"));
}

function generatePassword(user) {
  const s = getRandomSeparator();
  const n = Math.floor(Math.random() * 4);
  const threeDigits = randomThreeDigits();
  let password = "";
  switch (n) {
    case 1:
      password =
        transliterate(user[1]) + s + transliterate(user[2]) + s + threeDigits;
      break;
    case 2:
      password =
        transliterate(user[2]) + s + transliterate(user[1]) + s + threeDigits;
      break;
    case 3:
      password =
        threeDigits + s + transliterate(user[1]) + s + transliterate(user[2]);
      break;
    default:
      password =
        threeDigits + s + transliterate(user[2]) + s + transliterate(user[1]);
      break;
  }
  return password.replace(/\s/g, "");
}

function getRandomSeparator() {
  const n = Math.floor(Math.random() * 4);
  return [".", "-", "_", ""][n];
}

function randomThreeDigits() {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
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

export default App;
