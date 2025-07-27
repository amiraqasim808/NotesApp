# 🧠 NotesApp – AI-Powered Smart Note Management

Welcome to **NotesApp**, a modern, secure, and AI-enhanced note management API built with Node.js, Express, MongoDB, GraphQL, and OpenAI. Users can register, log in, manage notes, upload profile pictures, and summarize their content using LLMs.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login/logout with **asymmetric encryption**
- Secure password storage with **bcrypt**
- Upload and update profile pictures (via **Multer**)
- **Forget/reset password** flow with OTP sent via email

### 📝 Notes
- Create, fetch, and delete notes
- Fetch notes via **GraphQL**
- Filter notes by:
  - Title
  - Date range
  - User ID
- Pagination for performance
- Auto-populated note author info

### 🤖 AI Summarization
- Summarize long notes using **OpenAI's LLM API**
- Returns short, human-readable summaries

### 🛡️ Security & Best Practices
- CORS + Helmet + Rate Limiting
- JWT **token revocation**
- Input validation with **Joi**
- Centralized error handling
- 404 route fallback

---

## 🗂️ Project Structure

NotesApp/
│
├── config/ # DB & email configs
├── controllers/ # Route logic
├── graphql/ # GraphQL schema & resolvers
├── middlewares/ # Auth, validators, errors
├── models/ # MongoDB schemas
├── routes/ # Express routes
├── uploads/ # Profile images
├── utils/ # Helpers (OTP, mail, tokens)
├── index.js # Entry point
├── .env # Environment variables (excluded in .gitignore)
└── README.md

yaml
Copy
Edit

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amiraqasim808/NotesApp.git
cd NotesApp
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment
Rename .env.example to .env and fill in your secrets:

env
Copy
Edit
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
PRIVATE_KEY_PATH=./config/private.key
PUBLIC_KEY_PATH=./config/public.key
JWT_EXPIRES=1d
4. Generate JWT Keys
bash
Copy
Edit
mkdir -p config
openssl genrsa -out config/private.key 2048
openssl rsa -in config/private.key -pubout -out config/public.key
5. Run the App
bash
Copy
Edit
npm run dev
🧪 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/register	Register new user
POST	/login	Login & get JWT
POST	/logout	Revoke JWT
PATCH	/upload-profile-pic	Upload profile image
POST	/forget-password	Send OTP via email
POST	/reset-password	Reset password with OTP

📝 Notes
Method	Endpoint	Description
POST	/notes	Create new note
DELETE	/notes/:id	Delete note by ID
POST	/notes/:id/summarize	Summarize note using AI

📊 GraphQL
Method	Endpoint	Description
POST	/graphql	Query notes with filters

Example Query:

graphql
Copy
Edit
{
  notes(title: "meeting", page: 1, limit: 5) {
    id
    title
    content
    user {
      id
      email
    }
  }
}
🧾 Postman Collection
📥 Download and import from:
SmartNoteApp.postman_collection.json

✅ Best Practices Applied
Asymmetric JWT signing with RS256

Token versioning to revoke on password reset

bcrypt for password hashing

OTP with expiration & one-time use

File conflict prevention (uploads)

GraphQL for flexible note retrieval

Modular, clean architecture

Descriptive HTTP status codes and error messages

🛠️ Tech Stack
Node.js, Express

MongoDB, Mongoose

GraphQL via Apollo

OpenAI API for summarization

JWT, bcrypt, Multer, Joi

Nodemailer for emails

Helmet, Rate Limiting, CORS

👩‍💻 Author
Amira Qasim
GitHub: @amiraqasim808
