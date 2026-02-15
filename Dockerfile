# --- STAGE 1: BUILD ---
FROM node:22.21-bookworm-slim AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .

# 3. Expose the port (Nginx default is 80)
EXPOSE 5173

# Set host to 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0
ENV PORT=5173

# Start Nginx
CMD ["npm", "run", "docker"]