# Grdabud

# 🎓 GradBud — Student Engagement & Academic Integrity Platform

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![AWS Deploy](https://img.shields.io/badge/deploy-AWS-E53E3E)](https://aws.amazon.com/ecs/)

**CredBud** is a full-stack platform designed to **boost student engagement**, ensure **academic integrity**, and streamline **attendance and reward management** in educational institutions.

The system enables secure tracking of participation, gamified reward distribution, and transparent faculty-student interaction — all through a unified web and mobile experience.

---

## 🎯 Purpose & Benefits

### **For Students**
- Track attendance, achievements, and participation in real time ✅  
- Earn **rewards** and **badges** for consistent engagement 🏆  
- Access personalized dashboards for academic progress 📊  
- Strengthen accountability with secure attendance verification 🔒  

### **For Faculty & Institutions**
- Automate attendance tracking and reward distribution ⚡  
- Gain actionable insights into student engagement patterns 📈  
- Promote integrity with transparent, tamper-proof attendance 📜  
- Simplify administrative workflows and reporting 🖥️  

---

## 🧭 How to Use

### 1️⃣ Backend (Node.js + Express)
Handles JWT-based authentication and exposes RESTful APIs:

| Endpoint | Purpose |
|----------|---------|
| `/auth/login` | Authenticate users (students/faculty/admins) |
| `/attendance` | Mark and fetch attendance |
| `/rewards` | Issue or view student rewards |
| `/me` | Fetch user profile and progress summary |

Run backend:
```bash
cd backend
npm install
npm start
