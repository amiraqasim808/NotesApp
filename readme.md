# 🧠 Smart Note App - Node.js REST API with AI-Powered Summarization

A smart note management system that allows users to register, authenticate, manage notes, upload profile pictures, and summarize notes using AI (OpenAI API). Built with Node.js, Express, MongoDB, JWT, and GraphQL.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Register, login, logout with JWT (asymmetric)
  - Password hashing with bcrypt
  - Profile picture upload (with file name collision prevention)
  - Forgot/reset password with OTP via email

- 📝 **Note Management**
  - Create, view (GraphQL), delete notes
  - Filter notes by user, title, date range
  - Pagination at DB level
  - Fetch note owner data with each note

- 🤖 **AI Integration**
  - Summarize notes using OpenAI LLM
  - Returns concise summaries via OpenAI API

- 🔧 **Tech Stack**
  - Node.js + Express
  - MongoDB + Mongoose
  - GraphQL (Apollo Server)
  - JWT (asymmetric signing)
  - bcrypt, multer, nodemailer, dotenv
  - OpenAI SDK or `fetch`

- 🛡️ **Security**
  - CORS, Helmet, Rate Limiting
  - Token revocation support
  - Input validation via Joi
  - 404 router fallback
  - Centralized error handling middleware

---

## 📁 Project Structure

smart-note-app/
│
├── config/ # DB & email configs
├── controllers/ # Route logic
├── middlewares/ # Auth, error handling, validators
├── models/ # Mongoose schemas
├── routes/ # API routes (modularized)
├── graphql/ # GraphQL schema & resolvers
├── uploads/ # Profile pictures
├── utils/ # Helpers: OTP, mail, tokens, etc.
├── .env # Environment variables
├── index.js # App entry point
└── README.md

yaml
Copy
Edit

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/smart-note-app.git
cd smart-note-app
Install dependencies

bash
Copy
Edit
npm install
Configure .env

env
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-note
OPENAI_API_KEY=your-openai-key
PRIVATE_KEY_PATH=keys/private.pem
PUBLIC_KEY_PATH=keys/public.pem
JWT_ALGO=RS256
EMAIL_USER=you@example.com
EMAIL_PASS=yourpass
Generate JWT Key Pair (if not done)

bash
Copy
Edit
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
Run the server

bash
Copy
Edit
npm run dev
📬 API Endpoints
🔐 Authentication
POST /register — Register new user

POST /login — Login and receive JWT

POST /logout — Revoke JWT

PATCH /upload-profile-pic — Upload profile picture

POST /forget-password — Request password reset OTP

POST /reset-password — Reset password using OTP

📝 Notes
POST /notes — Create note

DELETE /notes/:id — Delete note

POST /notes/:id/summarize — Summarize note content via OpenAI

📊 GraphQL
POST /graphql — Get filtered notes using userId, title, or created range

🧪 Postman Collection
Download and import from:

arduino
Copy
Edit
https://github.com/your-username/smart-note-app/blob/main/SmartNoteApp.postman_collection.json
✅ Best Practices Used
JWT with asymmetric signing (RS256)

Password hashing with bcrypt

OTP expiration and one-time use

File upload conflict prevention

Input validation with Joi

Environment variables via dotenv

GraphQL for flexible querying

Modular, clean code structure

Descriptive error handling and status codes


# NotesApp
