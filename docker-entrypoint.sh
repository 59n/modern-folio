#!/bin/sh
set -e

# Run Prisma migrations/push
echo "Running database setup..."
./node_modules/.bin/prisma db push

# Run seed if needed (the seed script should handle idempotency)
echo "Seeding database..."
./node_modules/.bin/prisma db seed

# Start the application
echo "Starting application..."
exec "$@"
