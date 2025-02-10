# Getting Started

## Prerequisites

- Node.js (v18 or higher)
- PNPM package manager
- PostgreSQL database
- Docker (for local message queue)
- Git

## Environment Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd formcraft
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/formcraft"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AWS S3 (File Storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# RabbitMQ
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

## Development Environment Setup

1. Start the local message queue:

```bash
pnpm lavinmq
```

2. Initialize the database:

```bash
pnpm prisma:migrate:dev
```

3. Start the development server:

```bash
pnpm dev
```

4. Start the required workers (in separate terminals):

```bash
# Webhook connector worker
pnpm start:worker:webhook-connector

# Sheets connector worker
pnpm start:worker:sheets-connector

# Email connector worker
pnpm start:worker:email-connector
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm prisma:studio` - Open Prisma Studio for database management
- `pnpm build:workers` - Build all workers
- `pnpm db:clean` - Clean the database (development only)

## Development Tools

### Database Management

- Prisma Studio is available at `http://localhost:5555` when running `pnpm prisma:studio`
- Database migrations can be created using `pnpm prisma:migrate:create`

### API Testing

- For webhook testing, you can use the tunnel command: `pnpm tunnel`
- Stripe webhook testing: `pnpm stripe:listen`

### Type Generation

- Prisma types are automatically generated on `pnpm install`
- Run `pnpm prisma:generate` manually if schema changes

## Recommended IDE Setup

- VS Code with the following extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
