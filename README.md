
---

# Real-Time Collaborative Notes App

This is the backend for the Real-time Collaborative Notes App, enabling collaborative editing, user authentication, and note storage with MongoDB.

🛠 Built With:
🟢 Node.js

🚀 Express.js

🧬 MongoDB + Mongoose

🔐 JWT (Authentication)

⚡ Socket.IO (Real-time collaboration)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

wathc at `https://drive.google.com/file/d/1BKxmsJ75-PgRn7ruV09kEbJxlAYHvMIb/view?usp=drive_link`

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vijaykanwal90/notes-backend.git
   
   ```



2. **Backend (Server) Setup:**

   - Navigate to the server directory:

     ```bash
     cd server
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - **Configure Environment Variables:**

     - Rename `.env.example` file to `.env`:

       ```bash
       cp .env.example .env
       ```

     - or Add your MongoDB URI to the `.env` file:

       ```
       DATABASE_URL=<your-mongo-uri>
       ```

   - Start the backend server:

     ```bash
     npm start
     ```

   The backend will run on `http://localhost:3000`.

   the fronted repository is at `https://github.com/vijaykanwal90/notesFrontend`








