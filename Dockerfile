# Define base image with Node.js
FROM node:20-slim AS base

# Install dependencies needed for Prisma and clean up
RUN apt-get update -y \
    && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack for pnpm
RUN corepack enable

# Build stage
FROM base AS build

# Copy source code
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install dependencies and build apps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile && \
    pnpm prisma:generate && \
    pnpm build && \
    pnpm deploy --prod --filter=users-api /prod/users-api && \
    pnpm deploy --prod --filter=stocks-api /prod/stocks-api

# Final users-api image
FROM base AS users-api
COPY --from=build /prod/users-api /prod/users-api
WORKDIR /prod/users-api
EXPOSE 3001
CMD [ "pnpm", "start:prod" ]

# Final stocks-api image
FROM base AS stocks-api
COPY --from=build /prod/stocks-api /prod/stocks-api
WORKDIR /prod/stocks-api
CMD [ "pnpm", "start" ]