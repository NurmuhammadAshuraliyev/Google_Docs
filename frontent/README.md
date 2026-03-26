# CollabDocs - Frontend

Real-time collaborative notes ilovasi uchun frontend qismi (React + Vite).

## Texnologiyalar

- **React 18** + **Vite**
- **React Router v6**
- **React Quill** (rich text editor)
- **Socket.io-client**
- **Tailwind CSS**
- **Lucide React** (icons)

## Loyihani ishga tushirish

### 1. Loyihani klon qilish

```bash
git clone https://github.com/yourusername/collabdocs.git
cd collabdocs/frontend


2. Kerakli paketlarni o‘rnatish
npm install


3. Environment faylini yaratish
.env faylini yaratib, quyidagini yozing: env

VITE_API_URL=http://localhost:4000

4. Frontendni ishga tushirish
npm run dev


Ilova http://localhost:3000 da ishga tushadi.


Loyihaning asosiy sahifalari

/login – Kirish
/register – Ro‘yxatdan o‘tish
/ – Dashboard (hujjatlar ro‘yxati)
/note/:id – Real-time hujjat tahrirlash
/profile – Foydalanuvchi profili


Real-time funksiyalar

Bir vaqtda bir nechta foydalanuvchi bitta hujjatni tahrirlay oladi
"Online" foydalanuvchilar soni ko‘rinadi
Cursor pozitsiyasi (kelajakda qo‘shilishi mumkin)


```
