# ---------- Base stage ----------
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runner stage ----------
FROM node:24-alpine AS runner
WORKDIR /app

# Copy only the necessary files from the base stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./

# Copy application source code
COPY . .

# Set environment variables if needed
ENV NODE_ENV=production


# Start the app
CMD ["npm", "run", "start"]