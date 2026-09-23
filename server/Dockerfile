# Multi-Stage Node.js Dockerfile for SmartDoc Analyzer API
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
