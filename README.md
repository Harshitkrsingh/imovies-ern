# IMovies — MERN Movie Ticket Booking System

A simple full-stack movie ticket booking project for academic submission.

## Tech stack
- Frontend: React + Vite + CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt

## Requirements
- Node.js installed
- MongoDB Server running locally (MongoDB Compass is only the GUI; the MongoDB service must also be running)

## 1. Start the backend
Open a terminal in `backend`:

```bash
npm install
```

Create `.env` by copying `.env.example` to `.env`, then update values if needed. Default local MongoDB URL is:
`mongodb://127.0.0.1:27017/imovies`

Run:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

## 2. Start the frontend
Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the Vite URL shown in terminal, usually `http://localhost:5173`.

## Admin account
Register using this email to receive the admin role:
- Email: `admin@imovies.com`
- Password: choose any password during signup

This is a demo convenience for local academic use. Do not use this mechanism in a real production app.

## Features
- Signup and login
- Movie listing and search
- Movie detail modal
- Show selection and seat selection
- Booking creation and booking history
- Admin dashboard to add/delete movies
- Responsive layout

## Notes
- Sample movies are inserted automatically when the database has no movies.
- Booking/payment is a demo flow. No real payment is collected.
- If the backend cannot connect, confirm the MongoDB Server service is running. Compass alone does not start the database server.
