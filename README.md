# Headless Gamify

Headless Gamify is a flexible and modular gamification system designed for seamless integration into various applications. This particular server is tailored for the retail industry, with a primary focus on enhancing employee engagement and motivation. By leveraging gamification techniques, it aims to create a more stimulating and rewarding work environment, ultimately boosting productivity and job satisfaction.

## Project Structure

This is a monorepo containing the following packages:

- `api-server`: The main backend server built with Hono.js
- `packages/common`: Shared utilities and validators
- `packages/sdk`: Client SDK for integrating with the gamification system
- `packages/prisma-client`: Generated Prisma client for database operations

## Prerequisites

- Node.js (Latest LTS version recommended)
- Yarn
- PostgreSQL

## Installation

```bash
# Install dependencies
yarn install
# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate:dev

# Start development server
yarn dev
```

## Building

To build the project, run:

```bash
# Build all packages
yarn build:packages

# Build API server
yarn build
```

## Linting
To lint the project, run:

```bash
# Lint all packages
yarn lint:packages
# Lint API server
yarn lint
```

## Package Details

### API Server (@headless-gamify/api-server)

The main backend server implementing the gamification logic.

**Key Features:**

- Built with Hono.js
- Zod validation
- PostgreSQL database with Prisma ORM

### Common Package (@headless-gamify/common)

Shared utilities and validators used across the project.

### SDK (@headless-gamify/sdk)

Client SDK for easy integration with the gamification system.

**Features:**

- TypeScript support
- Axios-based HTTP client
- Full API coverage

### Prisma Client (@headless-gamify/prisma-client)

Generated Prisma client package for database operations.
