const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'test-tizimi-secret-key-2025';

// Tokenni tekshirish
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Token mavjud emas. Iltimos, tizimga kiring.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token yaroqsiz yoki muddati tugagan.' });
    }
    req.user = user;
    next();
  });
}

// Faqat admin uchun
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bu amalni faqat admin bajarishi mumkin.' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin, JWT_SECRET };
