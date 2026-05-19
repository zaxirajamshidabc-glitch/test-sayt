const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Static fayllar (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ===== API ROUTES =====
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/admin',     require('./routes/admin'));

// API bo'lmagan barcha so'rovlarni frontendga yo'naltirish
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Server xatosi:', err.message);
  res.status(500).json({ error: 'Server ichki xatosi.' });
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`\n✅ Online Test Tizimi ishga tushdi!`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`\n📋 Kirish ma'lumotlari:`);
  console.log(`   admin    / admin123`);
  console.log(`   student1 / pass123\n`);
});
