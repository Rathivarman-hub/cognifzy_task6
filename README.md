# AuthVault

AuthVault is a full-stack MERN (MongoDB, Express, React, Node.js) authentication and user management system. It provides a robust and secure foundation for building applications that require advanced user authentication features.

## 🚀 Features

- **Secure Authentication:** JWT-based authentication with refresh tokens.
- **Account Management:** User registration, login, and secure logout.
- **Email Verification:** Users must verify their email addresses via secure expiring links.
- **Password Recovery:** Forgot password and secure reset password functionality.
- **Profile Customization:** Update profile details and upload custom avatars (images).
- **Security:** Rate-limiting on authentication routes to prevent brute-force attacks, and password hashing using bcrypt.
- **Activity Tracking:** User activity logs (e.g., tracking logins, profile changes, and password updates).
- **Role-Based Access Control:** Separate standard `user` and `admin` roles, complete with an Admin Dashboard to manage users.
- **Responsive UI:** Fully responsive frontend built with React, Bootstrap 5, and custom CSS, featuring seamless Light and Dark mode toggles.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Context API (for global state)
- Axios
- Bootstrap 5 & Bootstrap Icons

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Multer (for file uploads)
- Nodemailer (for sending verification/reset emails)

---

## 💻 Installation and Setup

### Prerequisites
- Node.js installed
- MongoDB URI (Local or MongoDB Atlas)
- An email provider setup (e.g., Gmail with App Passwords / OAuth2)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd authVault
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory and add your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d
COOKIE_EXPIRE=7

# Email API Credentials
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
GMAIL_SENDER_EMAIL=your_email@gmail.com
GMAIL_SENDER_NAME=AuthVault

CLIENT_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```text
authVault/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, ThemeToggle, etc.)
│       ├── context/        # React Context (Auth, Theme)
│       ├── pages/          # Full page views (Home, Dashboard, Login, Profile, etc.)
│       └── services/       # API communication (Axios interceptors)
└── server/                 # Express Backend
    ├── public/uploads/     # Stored user avatars
    └── src/
        ├── config/         # DB connection & Email configuration
        ├── controllers/    # Route logic (authController, userController)
        ├── middleware/     # Custom middleware (auth, rate limits, validation)
        ├── models/         # Mongoose schemas
        └── routes/         # Express API routes
```

## 🔒 Security Measures
- **Cross-Origin Resource Sharing (CORS):** Strict origin checking.
- **HttpOnly Cookies:** Used to securely store authentication tokens to prevent XSS attacks.
- **Request Validation:** Input validation middleware before hitting controllers.
- **Rate Limiting:** IP-based request throttling to stop spam and brute-force login attempts.

---
*Built as a secure, production-ready starting point for modern web applications.*
