# Skills2Career (CareerBridge) 🚀

> A comprehensive MERN stack internship platform seamlessly connecting IT students with tech employers through automated skill matching and real-time communication.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat-square&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-Live_Chat-010101?style=flat-square&logo=socket.io)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Architecture](#api-architecture)
- [License](#license)

---

## 🎯 Overview

**Skills2Career** (also known as CareerBridge) is a full-stack web application designed to solve the disconnect between students seeking internships and companies looking for talent. The platform features an advanced **Weighted Skill-Matching Algorithm**, a built-in **Career Assessment Tool**, **Automated Resume Building**, and **Real-time Chat**. 

It supports three core user roles: **Seekers (Students)**, **Employers**, and **Admins**.

---

## ✨ Key Features

### 🎓 For Seekers (Students)
- **Weighted Skill Matching:** Automatically matches internships to your profile using a proprietary algorithm (75% core skills, 25% additional skills).
- **Automated Resume Builder:** A 5-step profile completion timeline automatically generates a professional digital resume.
- **Career Assessment Quiz:** A built-in pathway tool that recommends the best career choices and relevant courses based on current qualifications.
- **Media Management:** Securely upload profile pictures, PDF CVs, and certificates (Powered by Cloudinary).
- **Application Tracking:** Track application status (Pending, Shortlisted, Selected) and manage scheduled Walk-in/Zoom interviews.

### 💼 For Employers
- **Company Verification:** Secure onboarding requiring Admin verification before posting jobs.
- **Smart Candidate Search:** Instantly see the "Match %" of applicants based on how well their skills align with your internship requirements.
- **Interview Scheduling:** Schedule interviews and notify candidates instantly.
- **Real-Time Messaging:** Chat directly with shortlisted candidates via a live WebSocket connection.

### 🛡️ For Admins
- **Platform Management:** Oversee and suspend users, verify company profiles, and manage active/draft/closed internships.
- **Academic Ecosystem:** Manage system-wide institutions and courses for the Career Pathway tool.

### 🔧 System-Wide
- **Secure Authentication:** JWT-based sessions with 6-digit email OTP verification via Nodemailer.
- **Real-Time Sync:** Socket.io infrastructure for instant chat messages and in-app notifications.

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance SPA with a responsive utility-first UI. |
| **Backend** | Node.js, Express.js | Robust, non-blocking REST API architecture. |
| **Database** | MongoDB & Mongoose | Flexible NoSQL document storage with strict schema validation. |
| **Real-time** | Socket.io | Bi-directional communication for live chat. |
| **File Storage**| Cloudinary | Secure cloud hosting for images and PDF resumes. |
| **Mailing** | Nodemailer | Handling transactional emails (OTPs, password resets). |
| **Security** | JWT, bcryptjs | Encrypted passwords and secure stateless authentication. |

---

## 👥 User Roles

| Role | Access Level |
|------|--------------|
| **Seeker** | Browse jobs, take career quizzes, build resume, apply, and chat with employers. |
| **Employer** | Post internships, manage applications, filter candidates by skills, and schedule interviews. |
| **Admin** | Full platform oversight, user management, company verification, and content moderation. |

---

## 📁 Project Structure

```text
skills2career/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components (Modals, Buttons)
│   │   ├── contexts/          # React Context (Auth, Socket)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Role-specific wrappers (Seeker/Employer/Admin)
│   │   ├── pages/             # Route views (Dashboard, Auth, etc.)
│   │   └── utils/             # API clients (Axios instance)
│
├── server/                    # Node.js Backend (Express)
│   ├── config/                # Database and Cloudinary configuration
│   ├── controllers/           # Business logic (Auth, Seeker, Employer)
│   ├── middleware/            # JWT verification, Role Guards, Multer
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API endpoints
│   ├── socket/                # Socket.io event listeners
│   └── utils/                 # Helpers (sendEmail via Nodemailer)
│
└── .env                       # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+
- **MongoDB** (Local instance or MongoDB Atlas)
- **Cloudinary Account** (For file uploads)
- **Google App Password** (For Nodemailer SMTP)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skills2career
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables** (See below)

5. **Start the Servers**

   *Run concurrently from the root (if set up):*
   ```bash
   npm run dev
   ```

   *Or run separately in two terminals:*
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

6. **Access the App**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 🔒 Environment Variables

Create a `.env` file in the `server/` directory with the following keys:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/skills2career

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Nodemailer / Email Setup (SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📜 Scripts

### Client (`client/package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint to find issues |

### Server (`server/package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Express server with Nodemon for hot-reloading |
| `npm start` | Start Node server (Production) |
| `npm run seed` | Seed database with initial roles/data |

---

## 🔗 API Architecture (Key Endpoints)

### Authentication (`/api/auth`)
- `POST /register` - Register user & dispatch OTP
- `POST /verify-otp` - Verify account
- `POST /login` - Issue JWT
- `POST /forgot-password` - Request password reset

### Seekers (`/api/seeker`)
- `GET /profile` - Retrieve full resume & match scores
- `PUT /profile` - Update details (handles Cloudinary media)
- `POST /assessment` - Submit career quiz

### Employers (`/api/employer`)
- `POST /internship` - Publish a job post
- `GET /applications` - View all applicant match scores

### Real-time (`Socket.io`)
- `join_room`, `send_message`, `receive_message`

---

## 📝 License

This project is licensed under the MIT License.

---

<p align="center">Built with ❤️ using the MERN Stack</p>
