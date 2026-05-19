# 🎓 Online Test Tizimi — Backend

## Xavfsizlik xususiyatlari
- ✅ JWT token autentifikatsiya (8 soat amal qiladi)
- ✅ Parollar bcrypt bilan shifrlangan
- ✅ Savollar va to'g'ri javoblar faqat token bo'lganda keladi
- ✅ Admin API alohida himoyalangan
- ✅ Frontend HTML da hech qanday savol/parol yo'q
- ✅ Kirish tarixi (IP bilan)

## O'rnatish

### 1. Node.js o'rnating
https://nodejs.org dan yuklab o'rnating (v18+ tavsiya etiladi)

### 2. Papkani oching va paketlarni yuklab oling
```bash
cd test_sayt
npm install
```

### 3. Serverni ishga tushiring
```bash
node server.js
```

### 4. Brauzerda oching
```
http://localhost:3000
```

## Kirish ma'lumotlari (boshlang'ich)
| Login | Parol | Rol |
|-------|-------|-----|
| admin | admin123 | Admin |
| student1 | pass123 | Talaba |
| student2 | pass123 | Talaba |

> **Eslatma:** Birinchi ishga tushganda parollar avtomatik bcrypt bilan hashlanadi.

## Loyiha tuzilmasi
```
test_sayt/
├── server.js              # Asosiy server
├── package.json
├── middleware/
│   └── auth.js            # JWT tekshirish
├── routes/
│   ├── auth.js            # Login endpoint
│   ├── questions.js       # Savollar API (himoyalangan)
│   └── admin.js           # Admin API (admin only)
├── data/
│   ├── users.json         # Foydalanuvchilar
│   ├── logs.json          # Kirish tarixi
│   ├── subjects_meta.json # Fan ma'lumotlari (savollarsiz)
│   └── questions/         # Savollar (serverda, frontendga kelmaydi)
│       ├── iqtisodiyot.json
│       ├── rus_tili.json
│       ├── falsafa.json
│       └── dinshunoslik.json
└── public/
    └── index.html         # Frontend (savollar YO'Q)
```

## API endpointlar
| Method | URL | Himoya | Tavsif |
|--------|-----|--------|--------|
| POST | /api/auth/login | - | Tizimga kirish |
| GET | /api/questions/subjects | Token | Fan ro'yxati |
| GET | /api/questions/:id?count=20 | Token | Savollar |
| GET | /api/admin/users | Admin | Foydalanuvchilar |
| POST | /api/admin/users | Admin | Yangi foydalanuvchi |
| PUT | /api/admin/users/:id | Admin | Tahrirlash |
| DELETE | /api/admin/users/:id | Admin | O'chirish |
| GET | /api/admin/logs | Admin | Kirish tarixi |
| DELETE | /api/admin/logs | Admin | Tarixni tozalash |

## Internet orqali ishlatish
Railway, Render, yoki VPS da deploy qilish mumkin.
`JWT_SECRET` environment variable o'rnating:
```bash
JWT_SECRET=sizning-maxfiy-kalitingiz node server.js
```
