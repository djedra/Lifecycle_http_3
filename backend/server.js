import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Установим заголовок Content-Type по умолчанию
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

const notes = [];
let nextId = 1;

// Обработка GET-запроса на получение всех заметок
app.get("/notes", (req, res) => {
  res.send(JSON.stringify(notes));
});

// Обработка POST-запроса на добавление новой заметки
app.post("/notes", (req, res) => {
  notes.push({ ...req.body, id: nextId++ });
  res.status(201).json({ message: "Note created" });
});

// Обработка DELETE-запроса на удаление заметки по ID
app.delete("/notes/:id", (req, res) => {
  const noteId = Number(req.params.id);
  const index = notes.findIndex((o) => o.id === noteId);
  if (index !== -1) {
    notes.splice(index, 1);
    return res.status(204).end(); // Успешное удаление
  }
  res.status(404).json({ message: "Note not found" }); // Если заметка не найдена
});

// Запуск сервера
const port = process.env.PORT || 7070;
app.listen(port, () => console.log(`The server is running on http://localhost:${port}`));
