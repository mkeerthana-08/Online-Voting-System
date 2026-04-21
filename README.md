# Online Voting System (MERN)

A full-stack Online Voting System built with:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (with in-memory fallback for local development)
- Auth: JWT + password hashing + OTP verification (demo OTP)
- Features: Role-based access (Admin/User), one-user-one-vote logic, party management, multilingual UI

## Project Structure

- `client/` - React frontend
- `server/` - Express API backend
- `package.json` - Root scripts to run both apps together

## Clone on Another Laptop

1. Install prerequisites:
- Node.js 18+ (recommended: latest LTS)
- npm
- MongoDB (optional for local persistence; app can run with in-memory fallback)

2. Clone the repository:

```bash
git clone https://github.com/mkeerthana-08/Online-Voting-System.git
cd Online-Voting-System
```

3. Install dependencies:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

## Environment Setup

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/voting_system
JWT_SECRET=replace_with_secure_secret
OTP_EXPIRY_MINUTES=5
```

Notes:
- If local MongoDB is not running, backend falls back to in-memory MongoDB for development.
- In-memory data is temporary and is lost on restart.

## Run Locally

### Option 1: Run both frontend + backend together (recommended)

```bash
npm run dev
```

### Option 2: Run separately

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## App URLs

- Frontend: shown by Vite (usually `http://localhost:5173`)
- Backend: `http://localhost:5000`
- Health API: `http://localhost:5000/api/health`

## Default Flow

1. Register a user/admin account.
2. Login with voter ID + password.
3. Request OTP and verify OTP.
4. User can vote once.
5. Admin can add/edit/delete parties and view vote stats.

## Important Security Notes

- `.env` files are ignored and not pushed.
- Replace `JWT_SECRET` with a strong value in production.
- Current OTP is demo-mode (displayed in UI for development).

## Troubleshooting

- If login says invalid credentials: register first or check voter ID/password.
- If API connection fails: ensure backend is running on port 5000.
- If `npm run dev` fails at root: run `npm install` at root first.
