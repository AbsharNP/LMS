# LMS Project Structure

This project is split into two apps:

- `client`: React + Vite + Tailwind admin panel
- `server`: Express + MongoDB API server

## Default Ports

- Client: `http://127.0.0.1:5173`
- Server: `http://localhost:3000`
- MongoDB: `mongodb://127.0.0.1:27017/lms_db`

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
|   |-- router.js         # Express API routes
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

File: `server/router.js`

```text
GET /              # Basic server health response
GET /api/test      # Backend connection test
GET /api/courses   # Course list API
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
- MongoDB connection
- Express router
- Server port

### `server/router.js`

Contains API route definitions.

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
