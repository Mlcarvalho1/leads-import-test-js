FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# SQLite DB path inside container (override with env or mount volume for persistence)
ENV DB_PATH=/app/data.db

CMD ["node", "src/index.js"]
