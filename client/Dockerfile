FROM node:20-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY packages/validators/package.json ./packages/validators/

RUN npm ci

COPY . .
RUN npm run build --workspace=packages/validators
RUN npm run build --workspace=client

FROM nginx:alpine AS production

COPY --from=builder /usr/src/app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
