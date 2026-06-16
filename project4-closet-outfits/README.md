# Project 4 – Closet + Outfit Builder

## Requirements
- Node.js (LTS recommended)
- MySQL Server (local)

## Project Structure
- `backend/` = Express API (port **3000**)
- `frontend/` = Vite app (port **5173**)
- `project4_dump.sql` = MySQL dump (DB + tables + sample data)
- `backend/.env.example` = environment template

---

## Setup Instructions

### 1) Import the Database
From the project root (same folder as `project4_dump.sql`):
```bash
mysql -u root -p < project4_dump.sql
```

Enter your MySQL password when prompted.

---

### 2) Backend Setup
From the project root:
```bash
cd backend
npm install
cp .env.example .env
```

**Configure your environment:**

Edit `backend/.env` and replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=closet_app
PORT=3000
```

**Start the backend:**
```bash
npm start
```
---

### 3) Frontend Setup
Open a **NEW terminal** (keep backend running). From the project root:
```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in terminal

---

## Troubleshooting

### "Access denied for user..." error
Your MySQL credentials in `backend/.env` are incorrect.

**Fix:**
1. Edit `backend/.env`
2. Set `DB_USER` to your MySQL username
3. Set `DB_PASSWORD` to your MySQL password
4. Restart backend:
```bash
   cd backend
   npm start
```

### Windows: `cp` command not found
Manually copy `backend/.env.example` to `backend/.env`, then edit the password.


