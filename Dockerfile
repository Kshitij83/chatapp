# Use official Node.js image
FROM node:20

WORKDIR /app

# Copy only backend and root files needed for backend
COPY package.json package-lock.json ./
COPY backend ./backend
COPY .env .env

WORKDIR /app/backend

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "start"]
