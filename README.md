# 📁 Project Management Tool

A full-stack web application for managing projects and tasks. It provides a dashboard to create and manage projects and tasks with user authentication, pagination, filtering, and more.

---

## 🚀 Tech Stack

**Frontend:**
- React, TypeScript, Vite
- Tailwind CSS
- React Router
- React Hook Form + Yup
- Axios

**Backend:**
- Node.js, Express
- MongoDB, Mongoose
- JWT, Bcrypt

**Testing:**
- Jest, Supertest
- MongoDB Memory Server
- React Testing Library

---

## 📦 Prerequisites

- **Node.js** (v16+)
- **npm** (v8+)
- **MongoDB** (local or MongoDB Atlas)

---

## 📁 Project Structure

project-management-tool/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ ├── tests/
│ ├── server.js
│ ├── app.js
│ ├── seed.js
│ └── .env
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── tests/
│ │ └── types.ts
│ ├── jest.config.js
│ ├── tsconfig.json
│ ├── vite.config.ts
│ └── tailwind.config.js

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### 🔌 Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file:

env
Copy
Edit
MONGO_URI=mongodb://localhost:27017/project-management-tool
JWT_SECRET=your_jwt_secret
Start the backend server:

bash
Copy
Edit
npm start
Runs at: http://localhost:5000

🌐 Frontend
Navigate to the frontend folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm run dev
Runs at: http://localhost:5173

🌱 Seed Data (Optional)
To populate the database with sample data:

bash
Copy
Edit
cd backend
npm run seed
✅ Sample Login:
graphql
Copy
Edit
Email: test@example.com
Password: Test@123
🧑‍💻 Usage
Register: http://localhost:5173/register

Login: http://localhost:5173/login

Dashboard: http://localhost:5173/

Features:
➕ Create, edit, delete projects and tasks

🔍 Search projects by title

📄 Paginate through projects (4 per page)

🧾 Filter tasks by status (todo, in-progress, done)

🔎 Search tasks by title/description

🧪 Testing
🔧 Backend
bash
Copy
Edit
cd backend
npm run test
Uses: Jest, Supertest, MongoDB Memory Server

💻 Frontend
bash
Copy
Edit
cd frontend
npm run test
Uses: Jest, React Testing Library, ts-jest

✅ Features Summary
🔐 JWT Authentication (Register/Login)

📁 Project CRUD with pagination & search

✅ Task CRUD with filtering

🔐 Ownership validation (only user can access their data)

📋 Form validation using react-hook-form + Yup

⚡ Responsive UI with Tailwind CSS

🧪 Unit-tested components & endpoints

⚠️ Troubleshooting
MongoDB connection error: Ensure MongoDB is running and .env is configured correctly.

Tests failing: Ensure all packages are installed (npm install), MongoDB URI is correct, and seed is optional.

Vite issues: Try upgrading:

bash
Copy
Edit
npm install vite@latest @vitejs/plugin-react@latest
🚀 Future Improvements
⬆ Upgrade to Vite v5 and plugin-react v4

⏰ Add due dates & reminders for tasks

🧪 Add more validation & edge case tests

🐳 Add Docker support

🧠 Add sorting, labels, and task priority

🤝 Contributing
Fork the repo, create a new branch, and open a pull request!

📄 License
This project is licensed under the MIT License.
