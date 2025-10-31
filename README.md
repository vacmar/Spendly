# 💜 Spendly - Expense Tracking Application

A beautiful, full-stack expense tracking application with purple gradient theme and smooth animations.

![Spendly](https://img.shields.io/badge/Spendly-Expense%20Tracker-purple)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🔐 **User Authentication**
  - Email/Password registration and login
  - Google Sign-In integration
  - Forgot password with email recovery
  - Password reset flow with tokens
  - JWT-based authentication

- 💰 **Expense Management**
  - Add, view, and delete expenses
  - Categorize expenses (Food, Transport, Entertainment, etc.)
  - Real-time expense tracking
  - Date-based expense records

- 🎯 **Budget Tracking**
  - Set budgets for different categories
  - Visual progress bars for budget utilization
  - Budget vs actual spending comparison
  - Category-wise budget management

- 📊 **Dashboard & Analytics**
  - Total expenses overview
  - Monthly spending summary
  - Category-wise breakdown
  - Visual charts and statistics

- 🎨 **Beautiful UI/UX**
  - Purple gradient theme throughout
  - Smooth Framer Motion animations
  - Responsive design for all devices
  - Loading screens with animations
  - Particle effects and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Router DOM** - Navigation
- **@react-oauth/google** - Google authentication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account (for email features)

### Clone Repository
```bash
git clone https://github.com/vacmar/Spendly.git
cd Spendly
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
NODE_ENV=development
PORT=3001

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/spendly

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key

JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173

# Gmail credentials for password reset emails
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

5. Start backend server:
```bash
npm start
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update Google Client ID in `src/components/AuthForm.jsx`:
```javascript
const GOOGLE_CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com';
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Create a database user
4. Get connection string from "Connect" → "Connect your application"
5. Add to `.env` file

### Gmail App Password Setup
1. Enable 2-Step Verification on your Gmail account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create new app password for "Spendly"
4. Copy 16-character password (no spaces)
5. Add to `.env` file

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add authorized JavaScript origins: `http://localhost:5173`
6. Copy Client ID and add to `AuthForm.jsx`

## 📁 Project Structure

```
Spendly/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   ├── .env.example      # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google Sign-In
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (protected)
- `POST /api/expenses` - Create expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)

### Budgets
- `GET /api/budgets` - Get all budgets (protected)
- `POST /api/budgets` - Create/Update budget (protected)

## 🎨 Features in Detail

### Authentication System
- Secure password hashing with bcrypt
- JWT token-based authentication
- Google OAuth integration
- Email-based password recovery
- Rate limiting on auth endpoints (100 attempts/15min)
- Separate handling for Google vs email/password users

### Email System
- Beautiful HTML email templates
- Purple gradient themed emails
- Password reset with secure tokens (1-hour expiry)
- Nodemailer integration
- Development mode shows reset links in console

### Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with express-validator
- Password hashing with bcrypt (salt rounds: 12)
- JWT secret key protection
- Environment variables for sensitive data

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Ensure `.env` file exists with all required variables
- Verify port 3001 is not in use

### Email not sending
- Verify Gmail 2-Step Verification is enabled
- Check App Password is correct (no spaces)
- Ensure `EMAIL_SERVICE=gmail` in `.env`
- Check backend logs for detailed error messages

### Google Sign-In not working
- Verify Google Client ID is correct
- Check authorized origins in Google Cloud Console
- Ensure `http://localhost:5173` is in authorized origins

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vaaheesan S**
- GitHub: [@vacmar](https://github.com/vacmar)

## 🙏 Acknowledgments

- React and Vite teams for amazing tools
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- MongoDB Atlas for cloud database
- All open-source contributors

## 📧 Support

For support, email vaahee21@gmail.com or open an issue on GitHub.

---

**Built with 💜 using React, Node.js, and MongoDB**
