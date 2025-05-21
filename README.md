# Bug Busterroo 🦘

Web app that helps debuggers untangle confusing error messages and stack traces. Built on Express (Backend) and React/Typescript (Frontend).

## Project Structure

```
.
├── client/            # React frontend
│   ├── src/           # Source files
│   └── package.json   # Frontend dependencies
├── common/            # Shared types / utils.  
├── server/            # Express backend
│   ├── src/          # Source files
│   └── package.json  # Backend dependencies
└── package.json      # Root package.json (workspace)
```

## Prerequisites

- Node.js (v20 or higher)
- npm (v9 or higher)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the server directory:
   ```
   cd server
   ```
   ```
   PORT=3001
   ATLAS_CONNECTION_STRING=mongodb+srv://<username>:<password>@debugassistantcluster.snbi2xe.mongodb.net/?retryWrites=true&w=majority&appName=DebugAssistantCluster
   GEMINI_API_KEY=<your API key>
   ```
   - For MongoDB username / password, reach out to Albert. Alternatively, you can create your own Atlas Cluster and set it up https://www.mongodb.com/cloud/atlas/register.
   - For Gemini, sign up here: https://aistudio.google.com/ and go to https://aistudio.google.com/apikey 

## Development

To run both frontend and backend in development mode (this is easiest for general testing):

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

To run in pseudo production:

```bash
cd client && npm start
```
This is because the server is hosted on render while the UI is still in local dev

## Testing containerization:
```bash
docker-compose up --build
```

## Features

- Basic log ingester, uses Gemini to give suggestions on how to fix it.
- Provides an indication on confidence and severity
- Search & filters