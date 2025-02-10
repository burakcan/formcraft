# Architecture Overview

## Technology Stack

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- Zustand (State Management)
- React Query (Server State)
- DND Kit (Drag and Drop)
- React Flow (Flow Diagrams)
- Zod (Schema Validation)

### Backend

- Next.js API Routes
- Prisma (ORM)
- PostgreSQL (Database)
- RabbitMQ (Message Queue)
- AWS S3 (File Storage)

### Authentication & Payments

- Clerk (Authentication)
- Stripe (Payments)

## System Architecture

FormCraft follows a modern full-stack architecture with the following key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │     │   API Routes    │     │   PostgreSQL    │
│   (Frontend)    │────▶│    (Backend)    │────▶│   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       │
┌─────────────────┐     ┌─────────────────┐            │
│     Clerk       │     │    RabbitMQ     │            │
│  (Auth Service) │     │ (Message Queue) │            │
└─────────────────┘     └─────────────────┘            │
                                │                       │
                                ▼                       │
                        ┌─────────────────┐            │
                        │    Workers      │            │
                        │ (Integrations)  │◀───────────┘
                        └─────────────────┘
```

## Key Components

### Frontend Architecture

- App Router based routing (`src/app/*`)
- Shared components (`src/components/*`)
- Custom hooks (`src/hooks/*`)
- Form builder components (`src/craftPages/*`)
- Type definitions (`src/types.d.ts`)
- Server actions (`src/actions/*`)

### Backend Services

- Database services (`src/services/db/*`)
- Integration services (`src/services/integrations/*`)
- Authentication middleware (`src/middleware.ts`)
- API routes (`src/app/api/*`)

### Worker Architecture

- Webhook connector (`workers/webhook-connector-worker.ts`)
- Sheets connector (`workers/sheets-connector-worker.ts`)
- Email connector (`workers/email-connector-worker.ts`)

## Data Flow

1. **Form Building**

   - Users create forms using the drag-and-drop builder
   - Form configurations are stored in PostgreSQL
   - Form assets are stored in AWS S3

2. **Form Submission**

   - Submissions are validated using Zod schemas
   - Data is stored in PostgreSQL
   - Integration tasks are queued in RabbitMQ

3. **Integration Processing**
   - Workers pick up tasks from RabbitMQ
   - Process data according to integration type
   - Update submission status in database

## State Management

- **Client State**: Managed by Zustand

  - Form builder state
  - UI state
  - User preferences

- **Server State**: Managed by React Query
  - Form data
  - Submission data
  - Integration status

## Security Architecture

- **Authentication**: Clerk handles user authentication
- **Authorization**: Role-based access control
- **API Security**:
  - CSRF protection
  - Rate limiting
  - Input validation

## Performance Optimizations

- Server-side rendering for initial page loads
- Client-side navigation for smooth transitions
- Optimistic updates for better UX
- Lazy loading of heavy components
- Image optimization via Next.js Image component

## Monitoring and Error Handling

- Client-side error boundaries
- Server-side error logging
- Integration failure handling and retries
- Performance monitoring
- API request tracking
