const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const QUESTIONS_DIR  = path.join(__dirname, '../data/questions');
const META_FILE      = path.join(__dirname, '../data/subjects_meta.json');

// Barcha so'rovlar token talab qiladi
router.use(verifyToken);

// GET /api/questions/subjects  — faqat fan nomi, soni (savollar YO'Q)
router.get('/subjects', (req, res) => {
  const meta = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
  res.json(meta);
});

// GET /api/questions/:subjectId?count=20  — aralashtirilgan savollar (to'g'ri javob bilan!)
router.get('/:subjectId', (req, res) => {
  const { subjectId } = req.params;
  const count = parseInt(req.query.count) || 20;

  const filePath = path.join(QUESTIONS_DIR, subjectId + '.json');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Fan topilmadi." });
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let questions = [...data.questions];

  // Aralashtirish (Fisher-Yates)
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  const selected = count === -1 ? questions : questions.slice(0, Math.min(count, questions.length));

  res.json({
    subject: { id: data.id, name: data.name, icon: data.icon, color: data.color },
    total: data.questions.length,
    count: selected.length,
    questions: selected // to'g'ri javob bilan — token bo'lmasasiz kelmaydi
  });
});

module.exports = router;
