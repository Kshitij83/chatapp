# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./backend/

# Copy frontend build (if exists)
COPY frontend/dist ./frontend/dist

# Expose port (default 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "run", "start"]
