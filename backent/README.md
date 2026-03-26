# CollabDocs - Backend

Real-time collaborative notes ilovasi uchun backend qismi (Node.js + Express + Prisma + Socket.io).

## Texnologiyalar

- **Node.js** + **Express**
- **Prisma ORM** + PostgreSQL
- **Socket.io** (real-time)
- **JWT** authentication
- **bcrypt** parol hash

## Loyihani ishga tushirish

### 1. Loyihani klon qilish

```bash
git clone https://github.com/NurmuhammadAshuraliyev/Google_Docs
cd collabdocs/backend

2. Kerakli paketlarni o‘rnatish

npm install

3. Environment faylini yaratish
.env faylini yaratib, quyidagilarni yozing: env

DATABASE_URL="postgresql://username:password@localhost:5432/collabdocs"
JWT_SECRET=your_super_secret_jwt_key_here
PORT=4000

4. Database ni yaratish va migratsiya qilish
npx prisma migrate dev
npx prisma db push

5. Serverni ishga tushirish
npm run dev
Server http://localhost:4000 da ishga tushadi.


Mavjud endpointlar (asosiylari)
Method     Route             Tavsif
POST       /api/auth/        registerRo‘yxatdan o‘tish
POST       /api/auth/        loginKirish
GET        /api/auth/        meFoydalanuvchi ma’lumoti
PUT        /api/auth/        meProfilni yangilash
GET        /api/notes        Barcha hujjatlar
POST       /api/notes        Yangi hujjat yaratish
GET        /api/notes/:id    Bitta hujjat olish
PUT        /api/notes/:id    Hujjatni yangilash
```
