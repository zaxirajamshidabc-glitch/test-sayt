const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const LOGS_FILE  = path.join(__dirname, '../data/logs.json');

// Barcha admin routelari himoyalangan
router.use(verifyToken, requireAdmin);

function readUsers() { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
function saveUsers(u) { fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2), 'utf8'); }
function readLogs()  { return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')); }
function saveLogs(l) { fs.writeFileSync(LOGS_FILE, JSON.stringify(l, null, 2), 'utf8'); }

// ===== USERS =====

// GET /api/admin/users
router.get('/users', (req, res) => {
  const users = readUsers().map(u => ({
    id: u.id, name: u.name, username: u.username,
    role: u.role, createdAt: u.createdAt, lastLogin: u.lastLogin || null
  })); // parol YUBORILMAYDI
  res.json(users);
});

// POST /api/admin/users  — yangi foydalanuvchi
router.post('/users', (req, res) => {
  const { name, username, password, role } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ error: "Ism, login va parol majburiy." });
  }
  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: "Bu login allaqachon mavjud." });
  }
  const newUser = {
    id: 'u' + uuidv4().replace(/-/g,'').slice(0,8),
    name, username,
    password: bcrypt.hashSync(password, 10),
    role: role === 'admin' ? 'admin' : 'student',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});

// PUT /api/admin/users/:id  — tahrirlash
router.put('/users/:id', (req, res) => {
  const { name, password, role } = req.body;
  let users = readUsers();
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Foydalanuvchi topilmadi." });
  if (users[idx].role === 'admin' && role === 'student') {
    return res.status(403).json({ error: "Adminni rolini o'zgartirib bo'lmaydi." });
  }
  if (name) users[idx].name = name;
  if (password) users[idx].password = bcrypt.hashSync(password, 10);
  if (role) users[idx].role = role;
  saveUsers(users);
  const { password: _, ...safe } = users[idx];
  res.json(safe);
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
  let users = readUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "Topilmadi." });
  if (user.role === 'admin') return res.status(403).json({ error: "Adminni o'chirib bo'lmaydi." });
  saveUsers(users.filter(u => u.id !== req.params.id));
  res.json({ success: true });
});

// ===== LOGS =====

// GET /api/admin/logs?limit=100
router.get('/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 200;
  const logs = readLogs().slice(0, limit);
  res.json(logs);
});

// DELETE /api/admin/logs  — tozalash
router.delete('/logs', (req, res) => {
  saveLogs([]);
  res.json({ success: true });
});

module.exports = router;
