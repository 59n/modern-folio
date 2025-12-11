FROM node:20-bullseye-slim AS base

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/docs/advanced-features/output-file-tracing
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# Production dependencies
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Create data directory for SQLite with correct permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# Copy production dependencies to ensure binaries like Prisma are available
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy prisma schema for migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
