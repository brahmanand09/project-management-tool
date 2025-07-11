# Project Management Tool
A full-stack web application for managing projects and tasks, built with a React frontend and an Express/MongoDB backend. Features include user authentication, project/task CRUD operations, server-side pagination and search, ownership validation, form validation, and unit tests.

## Tech Stack
* Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Yup, Axios
* Backend: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
* Testing: Jest, Supertest, MongoDB Memory Server, React Testing Library

## Prerequisites

* Node.js (v16 or higher)
* MongoDB (local or MongoDB Atlas)
* npm (v8 or higher)

## Project Structure
### project-management-tool/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── middleware/
│   │   └── auth.js
│   ├── tests/
│   │   └── projectController.test.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── tests/
│   │   │   ├── Login.test.tsx
│   │   │   ├── Dashboard.test.tsx
│   │   │   └── Register.test.tsx
│   │   └── types.ts
│   ├── jest.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── package.json
│   └── tailwind.config.js
└── README.md

## Setup Instructions
### Backend

1. Navigate to the backend directory:
   * cd backend


2. Install dependencies:
   * npm install


3. Create a .env file in the backend directory with the following:
   * MONGO_URI=mongodb://localhost:27017/project-management-tool
   * JWT_SECRET=your_jwt_secret
     
   Note: Replace MONGO_URI with your MongoDB connection string (local or MongoDB Atlas) and JWT_SECRET with a secure key.
4. Start the backend server:
   * npm start

The server runs on http://localhost:5000.

## Frontend

1. Navigate to the frontend directory:
   * cd frontend


2. Install dependencies:
   * npm install


3. Start the development server:
   * npm run dev

The frontend runs on http://localhost:5173.

### Seed Data (Optional)
To populate the database with sample data:
* cd backend
* npm run seed

#### Login with:

* Email: test@example.com
* Password: Test@123

## Usage

1. **Register:** Navigate to http://localhost:5173/register to create a new account.
2. **Login:** Go to http://localhost:5173/login to log in with your credentials.
3. **Dashboard:** After logging in, you'll be redirected to http://localhost:5173/, where you can:
    * Create, edit, or delete projects and tasks.
    * Search projects by title.
    * Paginate through projects (4 per page).
    * Filter tasks by status (all, todo, in-progress, done).
    * Search tasks by title or description.



## Testing
### Backend Tests

1. Navigate to the backend directory:
   * cd backend


2. Run tests:
   * npm run test

Tests use jest, supertest, and mongodb-memory-server to test project CRUD and pagination.

### Frontend Tests

1. Navigate to the frontend directory:
   *cd frontend


2. Run tests:
   * npm run test

Tests use jest, react-testing-library, and ts-jest to test rendering and form submission for Login, Register, and Dashboard components.

## Features

* **Authentication:** Secure JWT-based login and registration.
* **Project Management:** Create, update, delete, and list projects with server-side pagination and search.
* **Task Management:** Create, update, delete, and filter tasks within projects.
* **Ownership Validation:** Users can only modify their own projects and tasks.
* **Form Validation:** Client-side validation using react-hook-form and yup.
* **Responsive UI:** Styled with Tailwind CSS for a modern, user-friendly interface.
* **Unit Tests:** Comprehensive tests for backend and frontend functionality.

## Troubleshooting

* MongoDB Connection: Ensure MongoDB is running and MONGO_URI is correct in backend/.env.
* Test Errors: If tests fail, verify all dependencies are installed (npm install) and check for missing files (e.g., axios.ts, AuthContext.tsx).
* Vite Errors: If the frontend fails to build, consider upgrading vite and @vitejs/plugin-react (see below).

## Potential Improvements

* Upgrade to vite@^5.0.0 and @vitejs/plugin-react@^4.0.0 for better performance.
* Add more test cases for form validation errors and edge cases.
* Implement Docker for containerized deployment.
* Enhance UI with additional features like project sorting or task due date reminders.

## Contributing
Feel free to fork the repository, create a feature branch, and submit a pull request with improvements or bug fixes.
## License
MIT License
