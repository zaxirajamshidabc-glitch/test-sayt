const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { JWT_SECRET } = require('../middleware/auth');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const LOGS_FILE  = path.join(__dirname, '../data/logs.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}
function readLogs() {
  return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
}
function saveLogs(logs) {
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8');
}

// Birinchi ishga tushganda parollarni hash qilish
function migratePasswords() {
  const users = readUsers();
  let changed = false;
  users.forEach(u => {
    if (!u.password.startsWith('$2')) { // hash emas
      u.password = bcrypt.hashSync(u.password, 10);
      changed = true;
    }
  });
  if (changed) saveUsers(users);
}
migratePasswords();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Login va parol kiritilishi shart." });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Login yoki parol noto'g'ri." });
  }

  // JWT token yaratish (8 soat amal qiladi)
  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  // Kirish tarixini saqlash
  const logs = readLogs();
  logs.unshift({
    id: uuidv4(),
    userId: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    time: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress
  });
  // Max 1000 ta log
  saveLogs(logs.slice(0, 1000));

  // So'nggi kirish vaqtini yangilash
  const allUsers = users.map(u => {
    if (u.id === user.id) u.lastLogin = new Date().toISOString();
    return u;
  });
  saveUsers(allUsers);

  res.json({
    token,
    user: { id: user.id, name: user.name, username: user.username, role: user.role }
  });
});

module.exports = router;
