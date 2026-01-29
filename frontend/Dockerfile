# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite default port
EXPOSE 5173

# Run vite dev server with host flag to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
