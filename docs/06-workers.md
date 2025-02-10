# Workers and Background Jobs

## Overview

FormCraft uses a distributed worker system built on RabbitMQ for processing background tasks such as integrations, email notifications, and file processing.

## Worker Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │     │    RabbitMQ     │
│   (Publisher)   │────▶│  Message Broker  │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │      Worker Pool        │
                    │                         │
         ┌─────────┤  - Webhook Worker       │
         │         │  - Email Worker         │
         │         │  - Sheets Worker        │
         │         └─────────────────────────┘
         │
         ▼
┌─────────────────┐
│   External      │
│   Services      │
└─────────────────┘
```

## Available Workers

### 1. Webhook Connector Worker

Location: `workers/webhook-connector-worker.ts`

```typescript
interface WebhookJob {
  type: "webhook.send";
  payload: {
    url: string;
    method: "POST" | "PUT";
    headers: Record<string, string>;
    body: any;
    secret: string;
  };
  metadata: {
    formId: string;
    submissionId: string;
    retryCount: number;
  };
}
```

Features:

- HTTP request handling
- Signature generation
- Retry mechanism
- Error logging

### 2. Email Connector Worker

Location: `workers/email-connector-worker.ts`

```typescript
interface EmailJob {
  type: "email.send";
  payload: {
    to: string[];
    subject: string;
    template: string;
    data: Record<string, any>;
    attachments?: {
      filename: string;
      path: string;
    }[];
  };
  metadata: {
    formId: string;
    submissionId: string;
  };
}
```

Features:

- Template rendering
- Attachment handling
- SMTP integration
- Bounce handling

### 3. Google Sheets Connector Worker

Location: `workers/sheets-connector-worker.ts`

```typescript
interface SheetsJob {
  type: "sheets.update";
  payload: {
    spreadsheetId: string;
    range: string;
    values: any[][];
    auth: {
      access_token: string;
      refresh_token: string;
      expiry_date: number;
    };
  };
  metadata: {
    formId: string;
    submissionId: string;
  };
}
```

Features:

- OAuth token refresh
- Batch updates
- Error recovery
- Rate limiting

## Message Queue Configuration

### Queue Structure

```typescript
interface QueueConfig {
  name: string;
  options: {
    durable: boolean;
    deadLetterExchange: string;
    maxPriority?: number;
  };
}

const queues = {
  webhook: {
    name: "webhook_tasks",
    options: { durable: true, deadLetterExchange: "dlx.webhook" },
  },
  email: {
    name: "email_tasks",
    options: { durable: true, deadLetterExchange: "dlx.email" },
  },
  sheets: {
    name: "sheets_tasks",
    options: { durable: true, deadLetterExchange: "dlx.sheets" },
  },
};
```

### Dead Letter Queues

Each worker has a corresponding dead letter queue for failed jobs:

- `dlq.webhook_tasks`
- `dlq.email_tasks`
- `dlq.sheets_tasks`

## Worker Management

### Starting Workers

```bash
# Build workers
pnpm build:workers

# Start individual workers
pnpm start:worker:webhook-connector
pnpm start:worker:sheets-connector
pnpm start:worker:email-connector
```

### Environment Variables

```env
# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Worker Specific
WEBHOOK_WORKER_CONCURRENCY=5
EMAIL_WORKER_CONCURRENCY=3
SHEETS_WORKER_CONCURRENCY=2

# Monitoring
WORKER_MONITORING_ENABLED=true
WORKER_MONITORING_INTERVAL=60000
```

## Error Handling

### Retry Strategy

```typescript
interface RetryConfig {
  attempts: number;
  backoff: {
    type: "exponential" | "linear";
    initialDelay: number;
    maxDelay: number;
  };
  shouldRetry: (error: Error) => boolean;
}
```

Default configuration:

```typescript
const defaultRetryConfig: RetryConfig = {
  attempts: 3,
  backoff: {
    type: "exponential",
    initialDelay: 1000,
    maxDelay: 60000,
  },
  shouldRetry: (error) => {
    return error.code !== "VALIDATION_ERROR";
  },
};
```

### Error Logging

Workers log errors to multiple destinations:

- Console (development)
- Error tracking service
- Application logs
- Dead letter queue metadata

## Monitoring

### Health Checks

Each worker exposes health metrics:

- Queue size
- Processing rate
- Error rate
- Memory usage

### Alerting

Alert conditions:

- Queue size exceeds threshold
- Error rate spikes
- Worker disconnects
- Processing delays

## Development

### Local Setup

1. Start RabbitMQ:

```bash
pnpm lavinmq
```

2. Build workers:

```bash
pnpm build:workers
```

3. Start workers:

```bash
pnpm start:worker:webhook-connector
pnpm start:worker:sheets-connector
pnpm start:worker:email-connector
```

### Testing

```bash
# Run worker tests
pnpm test:workers

# Test specific worker
pnpm test:worker webhook-connector
```

### Debugging

1. Enable debug logs:

```env
DEBUG=workers:*
```

2. Monitor queues:

```bash
# RabbitMQ Management UI
http://localhost:15672
```

## Best Practices

1. **Job Processing**

   - Validate job payload
   - Handle partial failures
   - Implement idempotency
   - Track job progress

2. **Error Handling**

   - Log detailed errors
   - Implement circuit breakers
   - Handle timeouts
   - Monitor retry counts

3. **Performance**

   - Optimize concurrency
   - Batch operations
   - Monitor memory usage
   - Handle backpressure

4. **Maintenance**
   - Regular health checks
   - Log rotation
   - Queue cleanup
   - Version tracking
