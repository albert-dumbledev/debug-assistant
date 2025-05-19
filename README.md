# Full Stack Web Application

Web app that helps debuggers untangle confusing error messages and stack traces. Built on Express (Backend) and React/Typescript (Frontend).

## Project Structure

```
.
├── client/             # React frontend
│   ├── src/           # Source files
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
├── server/            # Express backend
│   ├── src/          # Source files
│   └── package.json  # Backend dependencies
└── package.json      # Root package.json (workspace)
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the server directory:
   ```
   PORT=3001
   ```

## Development

To run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

## Building for Production

To build both frontend and backend:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Features

- Express.js backend with TypeScript
- React frontend with TypeScript
- Vite for fast development
- API proxy configuration
- Basic health check endpoint
- Modern UI with CSS 