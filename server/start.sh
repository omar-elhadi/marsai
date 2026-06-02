#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Starting server..."
npm start --workspace=server
