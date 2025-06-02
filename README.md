# 🎓 Campus Connect

Campus Connect is a full-stack complaint management system for students to raise concerns regarding faculty, infrastructure, peer groups, and more. The admin (principal) receives real-time notifications and can update complaint statuses.

## 🔧 Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Tools:** XAMPP, Git, GitHub


📁 Folder Structure

campus_connect/
├── backend/ # Node.js server and API
├── db_scripts/ # SQL files for database setup
└── frontend/ # React.js client-side app


---

## 🚀 Features

- Student login (no signup; data is pre-stored)
- Complaint filing with:
  - Title
  - Urgency (Medium, High, Critical)
  - Category (Faculty, Peer Group, Infrastructure, Other)
  - Description (max 300 words)
- Admin dashboard to view complaints
- Admin can mark as **Resolved** or **Noted**
- **Email notifications** to admin and student on status change

---

## ⚙️ Setup Instructions

### 📌 Prerequisites
- Node.js & npm
- MySQL (via XAMPP)
- Git

### 🔌 Database Setup

1. Start Apache and MySQL from XAMPP
2. Open **phpMyAdmin**
3. Run SQL scripts in `db_scripts/`:
   - `create_tables.sql`
   - `insert_data.sql`

### 💻 Run Backend
cd backend
npm install
node server.js

### 🌐 Run Frontend
cd frontend
npm install
npm start

Some of Result Snapshots:
![Screenshot 2025-06-02 115122](https://github.com/user-attachments/assets/a58e87c9-fbe4-41de-8e0f-f17e45c283c9)
![image](https://github.com/user-attachments/assets/a0a409b5-449f-4cc2-aae6-27c952e3c115)


