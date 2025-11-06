const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DB_PATH = "./db.json";

// GET semua tagihan
app.get("/tagihan", (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(db.tagihan);
});

// GET semua siswa
app.get("/siswa", (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(db.siswa);
});

// POST tagihan baru
app.post("/tagihan", (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  const newTagihan = { ...req.body, id: Date.now().toString() };
  db.tagihan.push(newTagihan);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  res.json(newTagihan);
});

// PUT update tagihan
app.put("/tagihan/:id", (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  const idx = db.tagihan.findIndex(t => t.id === req.params.id);
  if (idx !== -1) {
    db.tagihan[idx] = { ...db.tagihan[idx], ...req.body };
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json(db.tagihan[idx]);
  } else {
    res.status(404).json({ msg: "Tagihan tidak ditemukan" });
  }
});

// DELETE tagihan
app.delete("/tagihan/:id", (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  db.tagihan = db.tagihan.filter(t => t.id !== req.params.id);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  res.json({ msg: "Berhasil dihapus" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
