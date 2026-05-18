# Skills2Career Project Structure

```
skills2career/
│
├── admin.md                          # Admin documentation
├── new feature idea.txt              # Feature ideas
├── passwords.md                      # Passwords/credentials reference
├── WorkDone.md                       # Work completed log
├── workflow.md                       # Workflow documentation
│
├── client/                           # React Frontend (Vite + Tailwind)
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vite.config.js
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       │
│       ├── assets/
│       │   ├── hero.png
│       │   ├── logo.png
│       │   ├── logo1.png
│       │   ├── react.svg
│       │   ├── vite.svg
│       │   └── zzlogo.png
│       │
│       ├── components/
│       │   ├── EmployerOnboardingTimeline.jsx
│       │   ├── ProfileTimeline.jsx
│       │   ├── ProtectedRoute.jsx
│       │   │
│       │   ├── chat/
│       │   │   └── ChatInterface.jsx
│       │   │
│       │   ├── layout/
│       │   │   ├── Footer.jsx
│       │   │   ├── Navbar.jsx
│       │   │   └── NotificationBell.jsx
│       │   │
│       │   ├── sections/
│       │   │   ├── About.jsx
│       │   │   ├── Categories.jsx
│       │   │   ├── Contact.jsx
│       │   │   ├── FAQ.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── Trending.jsx
│       │   │   └── Trust.jsx
│       │   │
│       │   └── ui/
│       │       ├── Accordion.jsx
│       │       ├── ApplyModal.jsx
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── ConfirmModal.jsx
│       │       ├── CustomSelect.jsx
│       │       └── Toast.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       │
│       ├── data/
│       │   └── quizData.js
│       │
│       ├── hooks/
│       │   ├── useDebounce.js
│       │   └── useSocket.js
│       │
│       ├── layouts/
│       │   ├── AdminLayout.jsx
│       │   ├── EmployerLayout.jsx
│       │   └── SeekerLayout.jsx
│       │
│       ├── pages/
│       │   ├── BrowseInternships.jsx
│       │   ├── Chat.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Landing.jsx
│       │   │
│       │   ├── admin/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── ManageInternships.jsx
│       │   │   ├── ManageUsers.jsx
│       │   │   ├── Settings.jsx
│       │   │   └── VerifyCompanies.jsx
│       │   │
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   └── RoleSelect.jsx
│       │   │
│       │   ├── employer/
│       │   │   ├── CompanyProfile.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   ├── InterviewScheduler.jsx
│       │   │   ├── ManageApplications.jsx
│       │   │   ├── ManageInternships.jsx
│       │   │   ├── PostInternship.jsx
│       │   │   ├── SearchCandidates.jsx
│       │   │   └── Settings.jsx
│       │   │
│       │   └── seeker/
│       │       ├── CareerQuiz.jsx
│       │       ├── Certificates.jsx
│       │       ├── CVUpload.jsx
│       │       ├── Dashboard.jsx
│       │       ├── MyApplications.jsx
│       │       ├── Preferences.jsx
│       │       ├── Profile.jsx
│       │       ├── Recommended.jsx
│       │       ├── Resume.jsx
│       │       └── Settings.jsx
│       │
│       └── utils/
│           ├── api.js
│           ├── ErrorBoundary.jsx
│           └── getImageUrl.js
│
└── server/                           # Node.js Backend (Express)
    ├── migrateRoles.js               # Role migration script
    ├── package.json
    ├── package-lock.json
    ├── server.js                     # Main entry point
    │
    ├── config/
    │   └── db.js                     # Database configuration
    │
    ├── controllers/
    │   ├── adminController.js
    │   ├── applicationController.js
    │   ├── authController.js
    │   ├── chatController.js
    │   ├── companyController.js
    │   ├── employerController.js
    │   ├── internshipController.js
    │   ├── interviewController.js
    │   ├── notificationController.js
    │   └── seekerController.js
    │
    ├── middleware/
    │   ├── auth.js
    │   ├── error.js
    │   ├── rateLimit.js
    │   └── upload.js
    │
    ├── models/
    │   ├── Application.js
    │   ├── CompanyProfile.js
    │   ├── Conversation.js
    │   ├── Internship.js
    │   ├── Interview.js
    │   ├── Message.js
    │   ├── Notification.js
    │   ├── SeekerProfile.js
    │   └── User.js
    │
    ├── routes/
    │   ├── admin.js
    │   ├── application.js
    │   ├── auth.js
    │   ├── candidate.js
    │   ├── chat.js
    │   ├── company.js
    │   ├── employer.js
    │   ├── health.js
    │   ├── internship.js
    │   ├── interview.js
    │   ├── notification.js
    │   └── seeker.js
    │
    ├── scripts/
    │   ├── resetPassword.js
    │   └── seed.js
    │
    ├── socket/
    │   └── index.js                  # Socket.io setup
    │
    └── uploads/                      # Uploaded files storage
        ├── certificates/
        ├── companies/
        ├── cv/
        └── profiles/
```

## Project Architecture Overview

### Frontend (client/)
- **Framework**: React 18 with Vite build tool
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: React Context (AuthContext, ToastContext)
- **Routing**: React Router (implied by page structure)

**Key Directories:**
| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable UI components (layout, sections, UI elements, chat) |
| `context/` | Global state providers |
| `layouts/` | Page layouts for different user roles |
| `pages/` | Route pages organized by role (admin, auth, employer, seeker) |
| `hooks/` | Custom React hooks |
| `utils/` | Utility functions and API helpers |

### Backend (server/)
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB (via Mongoose models)
- **Real-time**: Socket.io for chat/notifications
- **Authentication**: JWT with middleware protection

**Key Directories:**
| Directory | Purpose |
|-----------|---------|
| `controllers/` | Request handlers for each resource |
| `middleware/` | Auth, error handling, rate limiting, file upload |
| `models/` | Mongoose schemas (User, Internship, Application, etc.) |
| `routes/` | API endpoint definitions |
| `scripts/` | Utility scripts (migration, seeding, password reset) |
| `uploads/` | File storage for certificates, CVs, logos, profiles |

### User Roles
1. **Admin** - Platform management (manage users, internships, verify companies)
2. **Employer** - Post internships, manage applications, schedule interviews
3. **Seeker** - Browse jobs, apply, manage profile, upload resume/CVs

### Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Real-time | Socket.io |
| File Storage | Local filesystem (server/uploads/) |
