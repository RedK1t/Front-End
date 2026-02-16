# --- STAGE 1: BUILD ---
FROM node:22.21-bookworm-slim AS builder
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
EXPOSE 5173

ENV VITE_proxy_websocket_url=ws://localhost:5050/ws \
    VITE_subdomains_websocket_url=ws://localhost:3003/ws/enumerate \
    VITE_openPorts_REST_url=http://localhost:3004/scan \
    VITE_endpoints_REST_url=http://localhost:3005/scan \
    VITE_web_check_url=http://localhost:3001/api \
    VITE_DEV_whois=http://localhost:3000 \
    VITE_scanner_websocket_url=ws://localhost:3006 \
    VITE_web_check_local_url=http://localhost:3001/api
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]