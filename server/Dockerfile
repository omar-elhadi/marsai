FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY packages/validators/package.json ./packages/validators/

# Add make, python3, g++ for native modules like bcrypt
RUN apk add --no-cache python3 make g++

RUN npm ci

COPY . .
RUN npm run build --workspace=packages/validators
RUN npm run build --workspace=server

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY packages/validators/package.json ./packages/validators/

# Add make, python3, g++ for native modules
RUN apk add --no-cache python3 make g++

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/packages/validators/dist ./packages/validators/dist
COPY --from=builder /usr/src/app/server/dist ./server/dist
COPY --from=builder /usr/src/app/server/prisma ./server/prisma
COPY --from=builder /usr/src/app/server/start.sh ./server/start.sh

EXPOSE 5000

CMD ["sh", "server/start.sh"]
