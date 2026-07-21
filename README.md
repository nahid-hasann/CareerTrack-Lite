# 🚀 CareerTrack Lite - Full-Stack Job Application Tracker

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)]()
[![React](https://img.shields.io/badge/React-18-cyan.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)]()
[![Prisma](https://img.shields.io/badge/ORM-Prisma-indigo.svg)]()
[![Database](https://img.shields.io/badge/Database-MongoDB-green.svg)]()
[![AI Bonus](https://img.shields.io/badge/AI_Feature-%2B5_Bonus_Marks-emerald.svg)]()

> A modern, sleek, full-stack job application management system built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **Node.js (Express)**, **Prisma ORM**, and **MongoDB Atlas**.

---

## 🔑 Required Submission & Test Credentials

| Field | Value |
|---|---|
| **Student Name** | Md Hasan Nahid |
| **Student ID** | 2026-CT-1088 |
| **Test Email** | `test@careertrack.com` |
| **Test Password** | `password123` |
| **Database Used** | MongoDB (Prisma ORM) |
| **Language Used** | TypeScript |
| **AI Feature Added** | Yes (+5 Bonus Marks) |

---

## 🌐 Live Deployment Links

- **Frontend App**: [https://careertrack-lite.vercel.app](https://careertrack-lite.vercel.app) *(Placeholder)*
- **Backend API**: [https://careertrack-lite-api.onrender.com](https://careertrack-lite-api.onrender.com) *(Placeholder)*

---

## 📌 Project Overview

**CareerTrack Lite** empowers job seekers and software engineers to organize, monitor, and manage their job application pipeline seamlessly. It replaces messy spreadsheets with an intuitive, glassmorphic dark-mode dashboard featuring real-time analytics, status filtering, sorting, and AI job description analysis.

### ✨ Key Features

- 🔐 **Secure User Authentication**: Full user signup & login flow with password hashing via `bcryptjs` and stateless JWT session management. Includes 1-click **Instant Demo/Guest Login**.
- 📊 **Real-Time Analytics Dashboard**: Live counters for Total, Saved, Applied, Assessment, Interviewing, Rejected, and Offer Received applications.
- 💼 **Job Application CRUD**: Create, read, update, and delete job applications with company details, job titles, URLs, application sources (`LinkedIn`, `Bdjobs`, `Indeed`, etc.), dates, and notes.
- 🔍 **Live Search & Filter**: Instant search by company name or job title, and quick filter dropdown by status (`SAVED`, `APPLIED`, `ASSESSMENT`, `INTERVIEW`, `REJECTED`, `OFFER`).
- ⏳ **Sorting**: Toggle sorting between **Newest First** and **Oldest First**.
- 🤖 **AI Job Assistant (+5 Bonus Marks)**: Paste any job description to automatically extract key required skills, study topics, role summary, and 3 tailored interview practice questions!
- 🛡️ **Strict Data Ownership**: User data is strictly isolated; users can only access or mutate their own applications.
- 🚫 **404 Not Found Handling**: Friendly custom 404 page for unmatched routes.
- 🎨 **State-of-the-Art Dark UI**: Glassmorphic styling, neon glow accents, tailored status pills, and interactive modal dialogs powered by Tailwind CSS v4 & Lucide Icons.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Routing**: React Context API + [React Router DOM v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) (with automatic JWT Interceptor)
- **Icons**: [Lucide React](https://lucide.dev/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Language**: TypeScript
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: MongoDB Atlas
- **Security**: `bcryptjs` (Password Hashing), `jsonwebtoken` (JWT Authentication), `cors`, `dotenv`

---

## 💻 Local Installation & Setup Guide

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or `yarn`
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database connection string

---

### **1. Backend Setup**

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Configure Environment Variables (Copy template)
cp .env.example .env
```

Edit your `backend/.env` file:
```env
PORT=5001
DATABASE_URL="mongodb+srv://user:password@cluster0.mongodb.net/careertrack_lite?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
```

Generate Prisma Client:
```bash
# Generate Prisma Client for MongoDB
npx prisma generate
```

Start backend development server:
```bash
npm run dev
```
> The API server will be available at `http://localhost:5001`.

---

### **2. Frontend Setup**

Open a new terminal tab:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env
```

Edit your `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5001/api
```

Start Vite frontend development server:
```bash
npm run dev
```
> Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Environment Variables Format (`.env.example`)

### **Backend (`backend/.env.example`)**
```env
PORT=5001
DATABASE_URL="mongodb+srv://user:password@cluster0.mongodb.net/careertrack_lite?retryWrites=true&w=majority"
JWT_SECRET="super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
```

### **Frontend (`frontend/.env.example`)**
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📑 API Endpoint Documentation Table

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns server health status & timestamp |
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | 🔒 Protected | Fetch logged-in user profile |
| `GET` | `/api/dashboard/stats` | 🔒 Protected | Get application counts by status |
| `GET` | `/api/applications` | 🔒 Protected | Fetch user applications (query: `q`, `status`) |
| `POST` | `/api/applications` | 🔒 Protected | Create new application |
| `GET` | `/api/applications/:id` | 🔒 Protected | Get single application details |
| `PATCH` | `/api/applications/:id` | 🔒 Protected | Update application details |
| `DELETE` | `/api/applications/:id` | 🔒 Protected | Delete application |
| `POST` | `/api/ai/analyze-job` | 🔒 Protected | AI analysis of job description requirements |

---

## 👨‍💻 Developer & Student Metadata

- **Developer Name**: Md Hasan Nahid
- **Student ID**: 2026-CT-1088
- **Project**: CareerTrack Lite - Full-Stack Job Application Tracker
- **License**: MIT License
