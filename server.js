import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './db.sqlite',
    driver: sqlite3.Database
  });
  await db.exec('CREATE TABLE IF NOT EXISTS rejections (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
  await db.exec(`CREATE TABLE IF NOT EXISTS dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    date TEXT,
    idea TEXT,
    insta TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
})();

app.post('/api/reject', async (req, res) => {
  await db.run('INSERT INTO rejections DEFAULT VALUES');
  res.json({ success: true });
});

app.get('/api/rejections', async (req, res) => {
  const { count } = await db.get('SELECT COUNT(*) as count FROM rejections');
  res.json({ count });
});

app.post('/api/date', async (req, res) => {
  const { name, date, idea, insta } = req.body;
  await db.run('INSERT INTO dates (name, date, idea, insta) VALUES (?, ?, ?, ?)', [name, date, idea, insta]);
  res.json({ success: true });
});

app.get('/api/export', async (req, res) => {
  const rejections = await db.all('SELECT * FROM rejections');
  const dates = await db.all('SELECT * FROM dates');
  res.json({ rejections, dates });
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
