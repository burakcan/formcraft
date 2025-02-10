# Deployment Guide

## Infrastructure Overview

FormCraft is deployed on Vercel with the following infrastructure components:

```mermaid
graph TB
    subgraph "Vercel Platform"
        A[Next.js App] --> B[API Routes]
    end

    subgraph "Database"
        C[PostgreSQL]
    end

    subgraph "Message Queue"
        D[RabbitMQ]
    end

    subgraph "Storage"
        E[AWS S3]
    end

    subgraph "Workers"
        F[Webhook Worker]
        G[Email Worker]
        H[Sheets Worker]
    end

    A --> C
    B --> C
    B --> D
    D --> F
    D --> G
    D --> H
    A --> E
```

## Environment Setup

### Production Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
POSTGRES_PRISMA_URL=postgresql://user:password@host:5432/database?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_***
CLERK_SECRET_KEY=sk_***

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# Stripe
STRIPE_SECRET_KEY=sk_***
STRIPE_WEBHOOK_SECRET=whsec_***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_***

# RabbitMQ
RABBITMQ_URL=amqp://user:password@host:5672

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## Deployment Process

### 1. Database Migration

```bash
# Generate migration
pnpm prisma:migrate:create

# Apply migration
pnpm prisma:migrate:deploy
```

### 2. Build Process

```bash
# Install dependencies
pnpm install

# Build application
pnpm build

# Build workers
pnpm build:workers
```

### 3. Vercel Deployment

```bash
# Deploy to Vercel
vercel deploy --prod
```

## Infrastructure Components

### 1. Database (PostgreSQL)

#### Connection Configuration

```typescript
// Database connection with connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  },
  connectionLimit: 20,
  poolTimeout: 30,
});

// Non-pooling connection for migrations
const migrationPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL_NON_POOLING,
    },
  },
});
```

#### Backup Strategy

```bash
# Automated daily backups
0 0 * * * pg_dump -Fc database > backup-$(date +%Y%m%d).dump

# Restore from backup
pg_restore -d database backup.dump
```

### 2. Message Queue (RabbitMQ)

#### Queue Configuration

```typescript
const queueConfig = {
  connection: {
    url: process.env.RABBITMQ_URL,
    heartbeat: 60,
    vhost: "/",
  },
  queues: {
    webhook: {
      name: "webhook_tasks",
      options: {
        durable: true,
        deadLetterExchange: "dlx.webhook",
      },
    },
    email: {
      name: "email_tasks",
      options: {
        durable: true,
        deadLetterExchange: "dlx.email",
      },
    },
    sheets: {
      name: "sheets_tasks",
      options: {
        durable: true,
        deadLetterExchange: "dlx.sheets",
      },
    },
  },
};
```

### 3. File Storage (AWS S3)

#### Bucket Configuration

```typescript
const s3Config = {
  bucket: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_REGION,
  acl: "private",
  encryption: {
    serverSideEncryption: "AES256",
  },
  lifecycle: {
    rules: [
      {
        id: "temp-files",
        prefix: "temp/",
        expirationInDays: 1,
      },
    ],
  },
};
```

### 4. Workers Deployment

#### Worker Process Management

```json
{
  "apps": [
    {
      "name": "webhook-worker",
      "script": "workers/dist/webhook-connector-worker.js",
      "instances": 2,
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "email-worker",
      "script": "workers/dist/email-connector-worker.js",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "sheets-worker",
      "script": "workers/dist/sheets-connector-worker.js",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

## Monitoring and Logging

### 1. Application Monitoring

```typescript
// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check queue
    await rabbitmq.checkConnection();

    // Check S3
    await s3.headBucket({ Bucket: process.env.AWS_BUCKET_NAME }).promise();

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});
```

### 2. Error Tracking

```typescript
// Error tracking configuration
const errorTracker = {
  dsn: process.env.ERROR_TRACKING_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  beforeSend: (event) => {
    // Sanitize sensitive data
    if (event.request?.headers) {
      delete event.request.headers["Authorization"];
    }
    return event;
  },
};
```

### 3. Performance Monitoring

```typescript
// Performance monitoring middleware
const performanceMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
    });
  });

  next();
};
```

## Scaling Strategy

### 1. Application Scaling

- Vercel automatic scaling
- Edge caching
- Serverless functions

### 2. Database Scaling

- Connection pooling
- Read replicas
- Vertical scaling
- Horizontal sharding (if needed)

### 3. Queue Scaling

- Multiple worker instances
- Message persistence
- Dead letter queues
- Queue monitoring

## Deployment Checklist

1. **Pre-deployment**

   - Run tests
   - Check dependencies
   - Validate environment variables
   - Review database migrations

2. **Deployment**

   - Apply database migrations
   - Deploy application
   - Deploy workers
   - Update DNS if needed

3. **Post-deployment**

   - Verify health checks
   - Monitor error rates
   - Check worker processes
   - Validate integrations

4. **Rollback Plan**
   - Database rollback procedure
   - Application version rollback
   - DNS rollback if needed

## Maintenance Procedures

### 1. Database Maintenance

```bash
# Vacuum database
VACUUM ANALYZE;

# Reindex
REINDEX DATABASE database_name;

# Update statistics
ANALYZE;
```

### 2. Queue Maintenance

```bash
# Clear dead letter queue
rabbitmqctl purge_queue dlq.webhook_tasks
rabbitmqctl purge_queue dlq.email_tasks
rabbitmqctl purge_queue dlq.sheets_tasks
```

### 3. Storage Maintenance

```typescript
// Cleanup temporary files
const cleanupTempFiles = async () => {
  const objects = await s3
    .listObjects({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: "temp/",
    })
    .promise();

  await Promise.all(
    objects.Contents.map((obj) =>
      s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: obj.Key,
        })
        .promise()
    )
  );
};
```

## Disaster Recovery

### 1. Backup Strategy

- Daily database backups
- S3 versioning
- Configuration backups
- Documentation updates

### 2. Recovery Procedures

- Database restore process
- Application rollback
- DNS failover
- Communication plan

### 3. Testing

- Regular backup testing
- Recovery drills
