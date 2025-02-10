# API Documentation

## API Overview

FormCraft provides a comprehensive API for managing forms, submissions, and integrations. All API endpoints are available through Next.js API routes under the `/api` path.

## Authentication

All API endpoints require authentication using Clerk. Include the authentication token in the request headers:

```http
Authorization: Bearer <token>
```

## API Endpoints

### Forms API

#### List Forms

```http
GET /api/forms
```

Query Parameters:

- `page`: number (default: 1)
- `limit`: number (default: 10)
- `organizationId`: string (optional)

Response:

```typescript
interface FormsResponse {
  forms: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    archivedAt: string | null;
    versions: {
      id: string;
      publishedAt: string | null;
    }[];
  }[];
  total: number;
  page: number;
  limit: number;
}
```

#### Get Form

```http
GET /api/forms/:id
```

Response:

```typescript
interface FormResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  currentVersion: {
    id: string;
    publishedAt: string | null;
    data: CraftVersionData;
  };
  versions: {
    id: string;
    publishedAt: string | null;
  }[];
}
```

#### Create Form

```http
POST /api/forms
```

Request Body:

```typescript
interface CreateFormRequest {
  title: string;
  organizationId?: string;
  data: CraftVersionData;
}
```

#### Update Form

```http
PUT /api/forms/:id
```

Request Body:

```typescript
interface UpdateFormRequest {
  title?: string;
  data?: CraftVersionData;
}
```

#### Archive Form

```http
POST /api/forms/:id/archive
```

### Submissions API

#### List Submissions

```http
GET /api/forms/:formId/submissions
```

Query Parameters:

- `page`: number (default: 1)
- `limit`: number (default: 10)
- `startDate`: string (ISO date)
- `endDate`: string (ISO date)

Response:

```typescript
interface SubmissionsResponse {
  submissions: {
    id: string;
    createdAt: string;
    data: CraftSubmissionData;
  }[];
  total: number;
  page: number;
  limit: number;
}
```

#### Get Submission

```http
GET /api/forms/:formId/submissions/:id
```

#### Create Submission

```http
POST /api/forms/:formId/submissions
```

Request Body:

```typescript
interface CreateSubmissionRequest {
  data: CraftSubmissionData;
  files?: {
    fieldId: string;
    files: File[];
  }[];
}
```

### Integrations API

#### Webhook Integration

```http
POST /api/integrations/webhook
```

Request Body:

```typescript
interface WebhookIntegrationRequest {
  formId: string;
  url: string;
}
```

#### Email Integration

```http
POST /api/integrations/email
```

Request Body:

```typescript
interface EmailIntegrationRequest {
  formId: string;
  email: string;
  template?: string;
}
```

#### Google Sheets Integration

```http
POST /api/integrations/sheets
```

Request Body:

```typescript
interface SheetsIntegrationRequest {
  formId: string;
  sheetId: string;
  columnMapping: Record<string, string>;
}
```

### Files API

#### Upload File

```http
POST /api/files/upload
```

Multipart form data with:

- `file`: File
- `purpose`: 'submission' | 'asset'

Response:

```typescript
interface UploadResponse {
  id: string;
  url: string;
  filename: string;
}
```

### Organizations API

#### List Organizations

```http
GET /api/organizations
```

#### Create Organization

```http
POST /api/organizations
```

Request Body:

```typescript
interface CreateOrganizationRequest {
  name: string;
  members?: {
    email: string;
    role: "admin" | "member";
  }[];
}
```

## Webhooks

FormCraft can send webhooks for various events:

### Submission Webhook

```typescript
interface SubmissionWebhook {
  type: "submission.created";
  data: {
    id: string;
    formId: string;
    createdAt: string;
    data: CraftSubmissionData;
  };
}
```

### Form Webhook

```typescript
interface FormWebhook {
  type: "form.published" | "form.archived";
  data: {
    id: string;
    title: string;
    versionId?: string;
  };
}
```

## Error Handling

API errors follow this structure:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

Common error codes:

- `unauthorized`: Authentication required
- `forbidden`: Insufficient permissions
- `not_found`: Resource not found
- `validation_error`: Invalid request data
- `rate_limited`: Too many requests
- `integration_error`: Integration-specific error

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per minute per authenticated user
- Webhook endpoints: 10 requests per second per form

Headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1623456789
```

## Best Practices

1. **Authentication**

   - Always use HTTPS
   - Keep tokens secure
   - Rotate tokens regularly

2. **Error Handling**

   - Implement exponential backoff
   - Handle rate limits gracefully
   - Log detailed error information

3. **Performance**

   - Use pagination
   - Minimize payload size
   - Cache responses when appropriate

4. **Security**
   - Validate all inputs
   - Sanitize file uploads
   - Use webhook signatures
