# MongoDB Setup Guide for "The Quad"

This document outlines how to set up, connect, and configure your MongoDB database across different environments for The Quad backend.

## Structure & Architecture

Our database interface is managed by `mongoose` in the Node.js environment. Connection handling is defined primarily in `src/config/db.ts`. It includes:
- **Connection pooling:** Handles scaling API traffic efficiently (configured automatically scaled up for production).
- **Event Listeners:** Observes connections limits, downtime, and logs states immediately (`connected`, `error`, `disconnected`).
- **Graceful Shutdown:** Ensures that on `SIGINT` / `SIGTERM`, DB sockets close smoothly, preventing hung operations or memory leaks.

## Database Naming Conventions
Always segregate your environments strictly to avoid dirtying or losing data:
- **Development**: `the-quad-dev`
- **Staging**: `the-quad-staging`
- **Production**: `the-quad` or `the-quad-prod`
All collections will use lower camel case natively by mongoose models.

---

## 1. Local Database Setup (Recommended for Dev)

Running MongoDB locally gives you 0 latency. By default, our `docker-compose.yml` sets up a MongoDB container on port `27017`, so you don't even need to install it natively. 

### Option A: Using Docker (Fastest)

1. Root terminal: Run `docker-compose up -d mongo` 
2. Container handles data persistence via standard docker volumes (`mongo-data`).
3. Connection string in `.env`:
   ```bash
   MONGO_URI=mongodb://localhost:27017/the-quad-dev
   ```

### Option B: Local Installation

1. Install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Start the MongoDB Service (`mongod`).
3. Connection string remains the same:
   ```bash
   MONGO_URI=mongodb://localhost:27017/the-quad-dev
   ```

---

## 2. MongoDB Atlas Setup (Staging/Production)

When deploying The Quad, a managed cluster across AWS/GCP (e.g. MongoDB Atlas) replaces the local instance to provide redundancy.

### Steps
1. Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a cluster.
2. Under "Database Access", create a new specialized user (e.g., `the-quad-app`) with precise **Read and write to any database** privileges (or isolated scopes for production).
3. Under "Network Access", add IPs in the allow-list (e.g., your Vercel/Render/Heroku static IPs, or `0.0.0.0/0` if securely managed through VPC peering).
4. Click **Connect** → **Connect your application**.
5. Copy the standard SRV string into your deployment environment's `.env` configuration file, making sure to replace `<username>`, `<password>` and inject the desired DB name before the specific query options string (e.g., `...mongodb.net/the-quad-prod?retryWrites=...`)

### Example Cloud URI
```env
MONGO_URI=mongodb+srv://the-quad-app:sUperSECURE123@cluster0.mongodb.net/the-quad-prod?retryWrites=true&w=majority
```

## Security Best Practices
- **Do NOT** commit your realistic `.env` file or passwords to Git. The `.env.example` remains a dummy structural guide template.
- Ensure MongoDB users configured for your application backend don't possess overarching admin (`atlasAdmin`) abilities, only specific R/W operational roles strictly confined to The Quad's namespace.
