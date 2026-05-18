# Skills2Career Testing Workflow

## Prerequisites
1. Ensure MongoDB is running
2. Install dependencies: `npm install` in both `/server` and `/client`
3. Run the seed script to populate test data

---

## Step 1: Seed Test Data

```bash
cd server
node scripts/seed.js
```

This creates:
- **3 Employer accounts** (4 job posts each = 12 internships total)
- **2 Seeker accounts** (4 applications each = 8 applications total)

---

## Step 2: Start the Servers

### Terminal 1 — Backend
```bash
cd server
npm run dev
```

### Terminal 2 — Frontend
```bash
cd client
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`)

---

## Step 3: Test Employer Flow

### Employer 1 — TechNova Solutions
- **Login:** `employer1@test.com` / `Test@123`
- **Verify:**
  - Dashboard loads with 4 posted internships
  - Can view/edit each internship
  - Can see applications for each post

### Employer 2 — GreenLeaf Marketing
- **Login:** `employer2@test.com` / `Test@123`
- **Verify:**
  - Dashboard shows 4 internships
  - Can update application statuses (Shortlist / Select / Reject)

### Employer 3 — BuildRight Engineering
- **Login:** `employer3@test.com` / `Test@123`
- **Verify:**
  - All posts and applicants visible
  - Profile editing works

---

## Step 4: Test Seeker Flow

### Seeker 1 — Amal Perera (Developer)
- **Login:** `seeker1@test.com` / `Test@123`
- **Verify:**
  - Profile shows: React, Node.js, Python skills
  - Dashboard shows 4 applied internships:
    1. Frontend Developer Intern (TechNova)
    2. Backend Developer Intern (TechNova)
    3. Data Analyst Intern (GreenLeaf)
    4. Full Stack Developer Intern (BuildRight)
  - Can browse all 12 internships
  - Can apply to additional internships

### Seeker 2 — Kavindi Silva (Designer/Marketer)
- **Login:** `seeker2@test.com` / `Test@123`
- **Verify:**
  - Profile shows: Figma, Photoshop, SEO skills
  - Dashboard shows 4 applied internships:
    1. UI/UX Design Intern (TechNova)
    2. Digital Marketing Intern (GreenLeaf)
    3. Content Writer Intern (GreenLeaf)
    4. Graphic Design Intern (GreenLeaf)
  - Can update profile and preferences

---

## Step 5: Test Cross-User Interactions

| Action | How to Test |
|--------|-------------|
| Employer shortlists seeker | As Employer 1 → view applications → shortlist Seeker 1 |
| Employer rejects seeker | As Employer 2 → reject an application |
| Employer marks selected | As Employer 3 → select an applicant |
| Seeker sees status update | As Seeker 1 → refresh dashboard → status changed from Pending |
| Seeker browses all posts | As Seeker 2 → go to internships page → see all 12 posts |

---

## Step 6: Test Admin Features (if available)

If admin panel exists:
- Login as admin
- Verify all 5 users listed
- Verify all 12 internships listed
- Test suspend/verify user actions

---

## Test Account Summary

| Role | Email | Password | Company/Name |
|------|-------|----------|--------------|
| Employer | employer1@test.com | Test@123 | TechNova Solutions |
| Employer | employer2@test.com | Test@123 | GreenLeaf Marketing |
| Employer | employer3@test.com | Test@123 | BuildRight Engineering |
| Seeker | seeker1@test.com | Test@123 | Amal Perera |
| Seeker | seeker2@test.com | Test@123 | Kavindi Silva |

---

## Cleanup

To remove all seeded data:

```bash
cd server
node -e "require('dotenv').config(); require('./config/db')(); const mongoose=require('mongoose'); setTimeout(async()=>{await mongoose.connection.dropDatabase(); console.log('DB dropped'); process.exit(0)},2000)"
```

Or use MongoDB Compass to drop the database manually.
