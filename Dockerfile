# --- STAGE 1: BUILD ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --- STAGE 2: LIVE SERVER (DEPLOIMENT) ---
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# 1. Remove default nginx static assets
RUN rm -rf ./*

# 2. Copy the build output from the builder stage
# Vite usually outputs to the 'dist' folder
COPY --from=builder /app/dist .

# 3. Expose the port (Nginx default is 80)
EXPOSE 5500

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]