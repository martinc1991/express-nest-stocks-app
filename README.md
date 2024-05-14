# Express-Nest Stocks API

This monorepo (Turborepo) project containing two separate Node.js applications: **users-api** and **stocks-api**, built using Nest.js and Express.js respectively, along with a shared package for exporting TypeScript types for type safety across the project. There's also a postgreSQL db for storing data.

The project utilizes PNPM workspaces for efficient package management, so be sure to have it installed.

## Project Structure

#### Users API (Nest.js)

The users-api is handles users auth flow, queries Stocks API for stock and handles history and stats capabilities.

#### Stocks API (Express.js)

The stocks-api application receives calls from the Users API, queries the Stooq API, parses the response and return to Users API.

#### Shared Contract Package

The contract package just exports Typescript types to improve type safety across the project.

## Requirements

Ensure you have the following installed on your machine:

- Node.js (>= version 18.x)
- PNPM (>= version 9.x)
- TypeScript (>= version 5.x)
- Docker daemon

## IMPORTANT

First of all, for the project to work:

- Look for every ".env.\*.example" file and remove the ".example" part

## How to run in docker

Run:

```
docker compose up
```

App would be listening on http://localhost:3000.

## How to run locally

1. Install dependencies using PNPM (to install PNPM, follow the instructions in the [official documentation](https://pnpm.io/installation)):

   ```bash
   pnpm install
   ```

2. Run from the root (be sure you have docker installed and running):

   ```bash
   pnpm dev
   ```

3. App will run on port 3000 (http://localhost:3000/docs for swagger docs)

## Running tests

Once the project is locally installed (first step of "How to run locally"), run from root:

- For unit tests: `pnpm test`
- For e2e tests: `pnpm test:e2e`

