# LearnPulse – Interactive Learning & Course Management Hub
**Architecture:** Modern MERN (MongoDB Atlas, Express.js, React 19, Node.js)  
**Deployment Targets:** Vercel (Frontend SPA) + Render (Backend API) + MongoDB Atlas (Cloud Database)  

---

## 1. Project Overview
**LearnPulse** is a modern, enterprise-grade, full-stack Single Page Application (SPA) designed for interactive online education. It provides an immersive video classroom, self-paced module progression, instant interactive quizzes with automated grading and explanations, student learning dashboards, and an Instructor Studio for course authoring.

### 🌟 Key Highlights
- **Full MERN Stack Implementation**: Completely decoupled React 19 SPA communicating with an Express.js REST API backed by MongoDB Atlas.
- **Distraction-Free Classroom**: Video lesson player with responsive aspect ratio, curriculum sidebar, progress checkpoints, and markdown notes.
- **Interactive Assessment Engine**: Real-time multiple-choice quizzes with instant feedback, explanations, passing badges, and retake capabilities.
- **Student Dashboard & Analytics**: Tracks enrolled courses, completion percentages, total lessons finished, quizzes passed, and completion certificates.
- **Instructor Studio**: Comprehensive course authoring interface allowing instructors to publish courses, organize curriculum modules, embed videos, and monitor enrollment metrics.
- **1-Click Demo Accounts**: Instant pre-filled credentials on the login screen for Student, Instructor, and Admin roles to simplify grading and evaluation.
- **Cloud-Ready**: Includes zero-configuration deployment setup for **MongoDB Atlas**, **Render**, and **Vercel** (with SPA rewrite rules in `vercel.json`).

---

## 2. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend SPA** | React 19, React Router v7, Vite 8, Axios, Lucide React Icons, Modern CSS3 |
| **Styling & Design** | Glassmorphism, Responsive CSS Grid & Flexbox, Lavender & Navy Theme |
| **Backend API** | Node.js (v20+), Express.js (v4.21+), CORS, Dotenv |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js password hashing, Protected Route Layouts |
| **Database** | MongoDB Atlas (Cloud NoSQL M0 Free Tier) / Local MongoDB |
| **Deployment Targets** | Vercel (Frontend) & Render (Backend Web Service) |

---

## 3. Project Directory Structure

```text
library-management-system/
├── client/                               # Frontend Single Page Application
│   ├── public/                           # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx          # Reusable confirmation dialogs
│   │   │   ├── CourseCard.jsx            # Course grid display card with progress
│   │   │   ├── LessonQuiz.jsx            # Interactive quiz engine with real-time feedback
│   │   │   ├── Navbar.jsx                # Responsive header with profile menu & navigation
│   │   │   ├── StatCard.jsx              # Metric cards with iconography & gradients
│   │   │   └── Toast.jsx                 # Temporary feedback notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # JWT session management & role-based helpers
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx            # Standard page shell with Header & Footer
│   │   │   └── ProtectedRoute.jsx        # Route guard enforcing authentication & roles
│   │   ├── pages/
│   │   │   ├── Classroom.jsx             # Fullscreen video classroom & module navigation
│   │   │   ├── CourseCatalog.jsx         # Course discovery with filters & search
│   │   │   ├── CourseDetail.jsx          # Course overview, syllabus, & enrollment
│   │   │   ├── Dashboard.jsx             # Student learning metrics & active courses
│   │   │   ├── InstructorStudio.jsx      # Course creation & management studio
│   │   │   ├── Login.jsx                 # Authentication with 1-click demo accounts
│   │   │   └── Register.jsx              # New account registration
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with JWT interceptors
│   │   ├── App.css                       # LearnPulse application styling
│   │   ├── App.jsx                       # Client-side router configuration
│   │   ├── index.css                     # Global design tokens & CSS variables
│   │   └── main.jsx                      # Vite React entry point
│   ├── index.html                        # HTML template
│   ├── package.json                      # Frontend dependencies & build scripts
│   ├── vercel.json                       # Vercel SPA routing rewrite configuration
│   └── vite.config.js                    # Vite configuration with local proxy
│
└── server/                               # Backend REST API Service
    ├── config/
    │   └── db.js                         # Mongoose connection for Atlas & Local MongoDB
    ├── controllers/
    │   ├── authController.js             # User registration, login, profile management
    │   ├── courseController.js           # Course listing, detail, creation, deletion
    │   ├── dashboardController.js        # Analytics & student/instructor metrics
    │   └── progressController.js         # Enrollment, lesson completion, quiz grading
    ├── middleware/
    │   ├── auth.js                       # JWT verification & role authorization
    │   └── errorHandler.js               # Centralized exception handler
    ├── models/
    │   ├── Course.js                     # Course & lesson schema with quiz sub-documents
    │   ├── Enrollment.js                 # Student progress, completed lessons, quiz scores
    │   └── User.js                       # User schema with bcrypt encryption & roles
    ├── routes/
    │   ├── authRoutes.js                 # /api/auth
    │   ├── courseRoutes.js               # /api/courses
    │   ├── dashboardRoutes.js            # /api/dashboard
    │   └── progressRoutes.js             # /api/progress
    ├── scripts/
    │   └── seed.js                       # Comprehensive database seeder with demo courses
    ├── .env                              # Active environment configuration
    ├── .env.example                      # Environment variables reference template
    ├── package.json                      # Backend dependencies & scripts
    └── server.js                         # Express application entry point
```

---

## 4. Pre-configured Demo Accounts

When running the application, click any of the **Quick 1-Click Demo Accounts** on the `/login` screen:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Student** | `student@learnhub.dev` | `Student@123` | Browse catalog, enroll in courses, watch lessons, complete quizzes, view learning progress & certificates |
| **Instructor** | `instructor@learnhub.dev` | `Instructor@123` | All student capabilities + access to **Instructor Studio** to create, edit, and delete courses |
| **Admin** | `admin@learnhub.dev` | `Admin@123` | Full platform administrative oversight & course management |

---

## 5. Local Setup & Running in 3 Steps

### Step 1: Install Dependencies
Open your terminal in the project directory:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables
Inside `server/.env`, verify or update your MongoDB connection string:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learnpulseDB
JWT_SECRET=super_secret_learnpulse_jwt_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*(To use **MongoDB Atlas Cloud** directly, replace `MONGO_URI` with your Atlas connection string as shown in Section 6).*

### Step 3: Seed Database & Run
Run the database seed script to populate realistic courses, video lessons, and demo user accounts:

```bash
# In the server directory:
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server starts at http://localhost:5000
```

In a new terminal window, start the frontend development server:
```bash
cd client
npm run dev
# Frontend opens at http://localhost:5173
```

---

## 6. Setting Up Free MongoDB Atlas Cloud

To run your database in the cloud:

1. **Create an Account**: Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up for a free account.
2. **Create a Free Cluster**:
   - Choose **M0 Free Tier** (Shared).
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure) and nearest region.
   - Click **Create Cluster**.
3. **Configure Database Security**:
   - **Database User**: Create a user (e.g. username `learnuser` and a strong password).
   - **Network Access**: Click **Network Access** > **Add IP Address** > Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so your Render backend can connect.
4. **Get Connection String**:
   - Click **Database** > **Connect** > **Drivers** (Node.js).
   - Copy the connection URI:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learnpulseDB?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
5. **Update `server/.env`**:
   ```env
   MONGO_URI=mongodb+srv://learnuser:YourPassword123@cluster0.xxxxx.mongodb.net/learnpulseDB?retryWrites=true&w=majority
   ```
6. Run `npm run seed` in `server/` to verify the cloud database seeds properly!

---

## 7. Cloud Deployment Guide (Render + Vercel)

### Part A: Deploying Backend on Render (Free Web Service)
1. Push your repository to **GitHub** or **GitLab**.
2. Sign in to [Render](https://render.com) and click **New +** > **Web Service**.
3. Select your repository.
4. Set the following configuration:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learnpulseDB?retryWrites=true&w=majority`
   - `JWT_SECRET`: `super_secret_learnpulse_jwt_key_2026`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (or `*` during initial setup)
6. Click **Deploy Web Service**.
7. Once deployed, note your Render URL: e.g. `https://learnpulse-api.onrender.com`. Verify health at `https://learnpulse-api.onrender.com/api/health`.

---

### Part B: Deploying Frontend on Vercel (Free Static / SPA Hosting)
1. Sign in to [Vercel](https://vercel.com) and click **Add New...** > **Project**.
2. Import your repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://learnpulse-api.onrender.com` (Your Render backend URL)
5. Click **Deploy**.
6. Vercel will build and deploy your site with a live URL (e.g. `https://learnpulse.vercel.app`).
7. **Note on SPA Routing**: The included `client/vercel.json` automatically rewrites all routes to `/index.html`, ensuring page refreshes on `/courses/:id`, `/learn/:courseId`, and `/dashboard` work seamlessly without 404 errors.

---

## 8. Summary of API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register student or instructor
- `POST /api/auth/login` – Authenticate user and receive JWT
- `GET /api/auth/profile` – Retrieve authenticated profile
- `PUT /api/auth/profile` – Update user profile

### Courses (`/api/courses`)
- `GET /api/courses` – List courses with optional `category`, `level`, `search`, and `sort` parameters
- `GET /api/courses/:id` – Retrieve complete syllabus, lessons, and enrollment status
- `POST /api/courses` – Create a new course (Instructor/Admin only)
- `PUT /api/courses/:id` – Update existing course (Instructor/Admin only)
- `DELETE /api/courses/:id` – Delete course (Instructor/Admin only)

### Progress & Quizzes (`/api/progress`)
- `POST /api/progress/:courseId/enroll` – Enroll student in course
- `GET /api/progress/:courseId` – Get student's progress and completed lessons
- `POST /api/progress/:courseId/complete-lesson` – Mark lesson complete & advance progress
- `POST /api/progress/:courseId/submit-quiz` – Submit answers, calculate score, and record passed status

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` – Aggregated statistics, enrolled courses, and completion metrics

### System Health
- `GET /api/health` – Uptime monitoring & deployment health check
