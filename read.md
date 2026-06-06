# LMS Project Structure

This project is split into two apps:

- `client`: React + Vite + Tailwind admin panel
- `server`: Express + MongoDB API server

## Default Ports

- Client: `http://127.0.0.1:5173`
- Server: `http://localhost:3000`
- MongoDB: `mongodb://127.0.0.1:27017/lms`

## Folder Structure

```text
LMS/
|-- client/
|   |-- src/
|   |   |-- App.jsx        # Main admin layout and page rendering
|   |   |-- index.css      # Tailwind import and global CSS
|   |   |-- main.jsx       # React app entry with BrowserRouter
|   |   `-- router.js      # Client route config and sidebar route list
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   `-- vite.config.js
|
|-- server/
|   |-- .env              # MongoDB URI and server port
|   |-- config/
|   |   `-- db.js         # MongoDB connection helper
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- courseController.js
|   |   `-- healthController.js
|   |-- middleware/
|   |   `-- authMiddleware.js
|   |-- models/
|   |   |-- courseModel.js
|   |   `-- userModel.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- courseRoutes.js
|   |   `-- index.js
|   |-- router.js         # Backward-compatible export for routes/index.js
|   |-- server.js         # Express app, middleware, DB connection
|   |-- package.json
|   `-- package-lock.json
|
`-- read.md
```

Generated folders like `node_modules/`, `dist/`, and log files are not part of the source structure.

## Client Routes

Client routes are browser page routes handled by React Router.

File: `client/src/router.js`

```text
/dashboard
/courses
```

These routes are rendered inside `client/src/App.jsx`.

## Server Routes

Server routes are API routes handled by Express.

Files: `server/routes/index.js` and `server/routes/courseRoutes.js`

```text
GET /              # Basic server health response
GET /api/test      # Backend connection test
POST /api/signup   # Create user, hash password, return JWT
POST /api/login    # Verify password, return JWT
GET /api/courses   # Course list API
POST /api/courses  # Create a course in MongoDB
```

## JWT Auth

The server uses `jsonwebtoken` with `JWT_SECRET` from `server/.env`.

```env
JWT_SECRET=my_super_secret_key
JWT_EXPIRES_IN=7d
```

Signup and login responses include:

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin",
    "token": "jwt-token"
  }
}
```

The React client saves the returned user in `localStorage`. `client/src/api/axios.js` reads the saved token and sends it as:

```text
Authorization: Bearer <token>
```

Use `server/middleware/authMiddleware.js` to protect backend routes:

```js
import { protect } from '../middleware/authMiddleware.js';

router.get('/profile', protect, handler);
```

## Important Files

### `client/src/main.jsx`

Starts the React app and wraps it in `BrowserRouter`.

### `client/src/App.jsx`

Contains the admin panel layout:

- Sidebar
- Header
- Mobile route buttons
- Page route rendering

### `client/src/router.js`

Contains the client route configuration:

- Route path
- Sidebar label
- Sidebar icon
- Page key

### `server/server.js`

Sets up:

- Express app
- CORS
- JSON middleware
- MongoDB connection through `server/config/db.js`
- Express router
- Server port

### `server/router.js`

Keeps the old import path working by exporting `server/routes/index.js`.

### `server/models/courseModel.js`

Defines the Mongoose course schema.

### `server/models/userModel.js`

Defines the Mongoose user schema used for signup, login, roles, password hash, and saved JWT.

### `server/controllers/authController.js`

Contains signup and login handlers. Passwords are hashed with `bcryptjs`, and login/signup both return a JWT.

### `server/middleware/authMiddleware.js`

Verifies `Authorization: Bearer <token>` headers and places the decoded JWT payload on `req.user`.

### `server/controllers/courseController.js`

Contains course request handlers for listing and creating courses.

### `server/routes/courseRoutes.js`

Contains course API route definitions.

## Run The Project

Start the server:

```bash
cd server
npm run dev
```

Start the client:

```bash
cd client
npm run dev
```

## Build And Check Client

```bash
cd client
npm run lint
npm run build
```

## Current Data Flow

The React app calls:

```text
http://localhost:3000/api/test
```

The server responds from:

```text
server/router.js
```

Later, course data can be moved from temporary arrays into MongoDB models and controllers.
Course reads now use the MVC structure and fall back to sample courses while the database is empty.
