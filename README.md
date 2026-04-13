# The Quad 🎓

A full-stack college event and club management platform built with the MERN stack.

## Architecture

This is a monorepo containing:
- `frontend/`: React application built with Vite, TypeScript, and Tailwind CSS.
- `backend/`: Express.js API built with TypeScript and Mongoose.

## Setup & Running Locally

### Using Docker (Recommended for complete environment)

Make sure you have Docker and Docker Compose installed.

1. Ensure the ports `5000`, `5173`, and `27017` are free on your host.
2. Run the application:
   ```bash
   npm start
   # or
   docker-compose up --build
   ```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:5000`
MongoDB will be exposed on `localhost:27017`

### Running without Docker

You will need a MongoDB instance running locally or a MongoDB Atlas URI.

1. Install root workspace dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` in both `frontend` and `backend` directories and adjust variables as needed.
3. Start Backend:
   ```bash
   cd backend
   npm run dev
   ```
4. Start Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Package Manager
This project leverages **npm workspaces**. Running `npm install` at the root will install dependencies for both the frontend and backend.
