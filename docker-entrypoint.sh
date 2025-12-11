#!/bin/sh
set -e

# Run Prisma migrations/push
echo "Running database setup..."
echo "Skipping generation flag active"
./node_modules/.bin/prisma db push --skip-generate

# Run seed if needed (the seed script should handle idempotency)
echo "Seeding database..."
./node_modules/.bin/prisma db seed

# Start the application
echo "Starting application..."
exec "$@"
