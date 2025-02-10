# Database Documentation

## Overview

FormCraft uses PostgreSQL as its primary database, with Prisma as the ORM. The database schema is designed to support form building, submissions, integrations, and subscription management.

## Database Configuration

- **Provider**: PostgreSQL
- **ORM**: Prisma
- **Connection Pooling**: Enabled for API routes
- **Direct Connection**: Used for migrations

## Core Models

### User and Organization Models

```prisma
model User {
  id                  String
  organizations       Organization[]
  crafts              Craft[]
  CustomTheme         CustomTheme[]
  uploadedImages      UploadedImage[]
  stripeCustomer      StripeCustomer?
  stripeSubscriptions StripeSubscription[]
  stripeAccounts      StripeAccount[]
}

model Organization {
  id                  String
  users               User[]
  crafts              Craft[]
  CustomTheme         CustomTheme[]
  uploadedImages      UploadedImage[]
  stripeCustomer      StripeCustomer?
  stripeSubscriptions StripeSubscription[]
  stripeAccounts      StripeAccount[]
}
```

### Form Building Models

```prisma
model Craft {
  id                     String
  title                  String
  createdAt              DateTime
  updatedAt              DateTime
  archivedAt             DateTime?
  userId                 String
  organizationId         String?
  craftVersions          CraftVersion[]
  craftSubmissions       CraftSubmission[]
  webhookConnection      WebhookConnection?
  emailConnection        EmailConnection?
  googleSheetsConnection GoogleSheetsConnection?
}

model CraftVersion {
  id               String
  publishedAt      DateTime?
  createdAt        DateTime
  updatedAt        DateTime
  craftId          String
  craftSubmissions CraftSubmission[]
  data             Json  // Contains form structure
}

model CraftSubmission {
  id             String
  createdAt      DateTime
  updatedAt      DateTime
  craftId        String
  craftVersionId String
  data           Json  // Contains submission data
}
```

### Integration Models

```prisma
model WebhookConnection {
  id        String
  createdAt DateTime
  updatedAt DateTime
  url       String
  secret    String
  craft     Craft[]
}

model EmailConnection {
  id               String
  createdAt        DateTime
  updatedAt        DateTime
  confirmedAt      DateTime?
  email            String
  craft            Craft[]
  confirmationCode String
}

model GoogleSheetsConnection {
  id                          String
  createdAt                   DateTime
  updatedAt                   DateTime
  sheetId                     String
  sheetUrl                    String
  connectionProblem           Boolean
  googleSheetsAuthorizationId String
  craft                       Craft[]
}
```

### Billing Models

```prisma
model StripeCustomer {
  id             String
  createdAt      DateTime
  userId         String?
  organizationId String?
  subscriptions  StripeSubscription[]
}

model StripeSubscription {
  id                   String
  cancel_at_period_end Boolean
  currency             String
  current_period_end   DateTime
  current_period_start DateTime
  trial_end           DateTime?
  trial_start         DateTime?
  customerId          String
  userId              String?
  organizationId      String?
  items               StripeSubscriptionItem[]
}
```

## Key Relationships

1. **User-Organization**

   - Many-to-many relationship
   - Users can belong to multiple organizations
   - Organizations can have multiple users

2. **Craft Ownership**

   - Each Craft belongs to a User
   - Optionally belongs to an Organization
   - Has multiple versions and submissions

3. **Integration Connections**

   - Each Craft can have one of each integration type
   - Integrations (Webhook, Email, Google Sheets) are one-to-many with Crafts

4. **Billing Relationships**
   - StripeCustomer can be associated with either User or Organization
   - Subscriptions are linked to StripeCustomer and optionally to User/Organization

## JSON Fields

Several models use JSON fields to store flexible data structures:

1. **CraftVersion.data**

   - Stores form structure and configuration
   - Type: `CraftVersionData`

2. **CraftSubmission.data**

   - Stores form submission data
   - Type: `CraftSubmissionData`

3. **CustomTheme.data**
   - Stores theme configuration
   - Type: `CraftTheme`

## Migrations

Migrations are managed through Prisma and should follow these guidelines:

1. **Creating Migrations**

   ```bash
   pnpm prisma:migrate:create
   ```

2. **Applying Migrations**

   ```bash
   pnpm prisma:migrate:dev    # Development
   pnpm prisma:migrate:deploy # Production
   ```

3. **Reset Database**
   ```bash
   pnpm prisma:migrate:reset
   ```

## Database Management

1. **Prisma Studio**

   - Access via `pnpm prisma:studio`
   - Visual database browser at `http://localhost:5555`

2. **Type Generation**

   - Prisma types are auto-generated on install
   - Manual generation: `pnpm prisma:generate`

3. **Database Cleaning**
   - Development only: `pnpm db:clean`

## Best Practices

1. **Migrations**

   - Always create migrations for schema changes
   - Test migrations on development before production
   - Back up production database before migrations

2. **JSON Fields**

   - Use TypeScript types for JSON field structures
   - Validate JSON data before storage
   - Consider indexing frequently queried JSON fields

3. **Relationships**

   - Use cascading deletes where appropriate
   - Maintain referential integrity
   - Consider indexing foreign keys

4. **Performance**
   - Use appropriate indexes
   - Monitor query performance
   - Implement connection pooling in production
