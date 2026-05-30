FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build 2>&1 || (echo "=== BUILD FAILED ===" && exit 1)

RUN ls -la dist/ || (echo "=== dist/ EMPTY ===" && exit 1)

EXPOSE 3000

CMD ["node", "dist/main"]