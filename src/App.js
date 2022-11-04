import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { transliterate } from "transliteration";
import { API } from "./api";
import { FormDialog } from "./FormDialog";
import { UserCreationDialog } from "./UserCreationDialog";

const ID = "1WUdFK28ijRp-R66PwPcNEekAB01OuxvEPcYfPt01TPE";
const COURSES = ["Громада", "Культура", "Консультування плюс сім'я"];

function App() {
  const [creds, setCreds] = useState(null);
  const [range, setRange] = useState(COURSES[0]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const api = new API({ user: creds?.login, password: creds?.password });

  const loadUsers = useCallback(() => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/${range}?key=${creds.apiKey}`;

    fetch(url)
      .then((r) => r.json())
      .then((body) => {
        let v = body.values;
        v.shift();
        v = v.filter(
          (user) => user[3] !== "" && (user[6] === "" || user[7] === "")
        );
        setUsers(
          v.map((user) => ({
            id: user[0],
            surname: user[1].trim(),
            name: user[2].trim(),
            email: user[3].trim(),
            login: generateLogin(user),
            password: generatePassword(user),
            hasProfile: user[6] !== "",
            addedToCourse: user[7] !== "",
            course: range,
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

  const columns = [
    { field: "surname", headerName: "Прізвище", flex: 1 },
    { field: "name", headerName: "Іʼмя", flex: 1 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "login", headerName: "Логін", flex: 2 },
    { field: "password", headerName: "Пароль", flex: 3 },
    {
      field: "-",
      headerName: "Відкрити дії",
      renderCell: (params) => (
        <Button
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => setUser(params.row)}
        >
          Відкрити дії
        </Button>
      ),
      flex: 1,
    },
  ];

  return (
    <div>
      <FormControl style={{ margin: 15 }}>
        <Select value={range} onChange={(e) => setRange(e.target.value)}>
          {COURSES.map((range) => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={loadUsers}>
          Оновити
        </Button>
      </FormControl>
      <DataGrid
        autoHeight
        columns={columns}
        rows={users}
        onRowClick={(params) => setUser(params.row)}
      />
      <FormDialog open={creds === null} handleSubmit={setCreds} />
      <UserCreationDialog
        api={api}
        open={user !== null}
        user={user}
        handleClose={() => setUser(null)}
      />
    </div>
  );
}

function generateLogin(user) {
  return user[3].substring(0, user[3].indexOf("@")).toLowerCase();
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

export default App;
