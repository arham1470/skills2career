# Skills2Career 🚀

> A MERN stack internship platform connecting seekers with employers

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [License](#license)

---

## 🎯 Overview

Skills2Career is a full-stack web application designed to help job seekers find internships and employers post opportunities. The platform supports three user roles: **Seekers**, **Employers**, and **Admins**.

---

## ✨ Features

### For Seekers
- ✅ Browse and filter internships
- ✅ Apply to internships
- ✅ Upload CV and certificates
- ✅ Career quiz for recommendations
- ✅ Track applications
- ✅ Chat with employers

### For Employers
- ✅ Post and manage internships
- ✅ Review applications
- ✅ Schedule interviews
- ✅ Search candidates
- ✅ Manage company profile
- ✅ Real-time chat with applicants

### For Admins
- ✅ Manage users
- ✅ Manage internships
- ✅ Verify companies
- ✅ Platform settings

### General
- 💬 Real-time notifications (Socket.io)
- 🔐 JWT authentication
- 📱 Responsive design (Tailwind CSS)
- 🗄️ File uploads (profiles, CVs, certificates)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Real-time** | Socket.io |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Upload** | Multer |

---

## 📁 Project Structure

```
skills2career/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/            # Page layouts by role
│   │   ├── pages/              # Route pages
│   │   └── utils/              # Helper functions
│   └── ...
│
├── server/                    # Node.js Backend
│   ├── config/                # Database config
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Auth, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── scripts/               # Utility scripts
│   ├── socket/                # Socket.io setup
│   └── uploads/               # File storage
│
├── admin.md                   # Admin documentation
├── passwords.md               # Credentials reference
├── structure.md              # Detailed project structure
└── workflow.md               # Development workflow
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skills2career
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # server/.env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/skills2career
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

5. **Start the servers**

   **Development mode (both concurrently):**
   ```bash
   # From root directory
   npm run dev
   ```

   **Or run separately:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

6. **Open the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 🔒 Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skills2career
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

---

## 📜 Scripts

### Root (`package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Run both frontend and backend in development mode |

### Client (`client/package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Server (`server/package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Express dev server |
| `npm run seed` | Seed database with sample data |
| `npm run reset-password` | Reset a user's password |

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Internships
- `GET /api/internship` - List all internships
- `POST /api/internship` - Create internship (employer)
- `PUT /api/internship/:id` - Update internship
- `DELETE /api/internship/:id` - Delete internship

### Applications
- `POST /api/application` - Submit application
- `GET /api/application` - Get applications
- `PUT /api/application/:id` - Update application status

### Users & Profiles
- `GET /api/seeker` - Seeker endpoints
- `PUT /api/seeker/profile` - Update seeker profile
- `GET /api/candidate` - Search candidates
- `GET /api/company` - Company endpoints

### Admin
- `GET /api/admin/users` - Manage users
- `GET /api/admin/internships` - Manage internships
- `POST /api/admin/verify-company` - Verify company

### Real-time
- `Socket.io` - Chat and notifications

---

## 👥 User Roles

| Role | Access Level |
|------|--------------|
| **Seeker** | Browse jobs, apply, manage profile, chat |
| **Employer** | Post jobs, manage applications, search candidates, chat |
| **Admin** | Full platform access, user management, verification |

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">Built with ❤️ using the MERN Stack</p>
