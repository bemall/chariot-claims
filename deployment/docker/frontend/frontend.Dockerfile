FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with legacy peer deps for React 19
RUN npm ci --legacy-peer-deps

# Ensure TailwindCSS is installed
RUN npm install -D tailwindcss autoprefixer postcss --legacy-peer-deps

# Copy application files
COPY . .

EXPOSE 3000

# Development mode
CMD ["npm", "run", "dev"]
