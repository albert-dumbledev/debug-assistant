# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["sh", "-c", "PORT=$(cat /run/secrets/port) ATLAS_CONNECTION_STRING=$(cat /run/secrets/atlas_connection_string) GEMINI_API_KEY=$(cat /run/secrets/gemini_api_key) npm start"]