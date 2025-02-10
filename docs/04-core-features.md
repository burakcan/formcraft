# Core Features

## Form Builder

The form builder is the central feature of FormCraft, allowing users to create dynamic forms through a drag-and-drop interface.

### Components

1. **Form Elements**

   - Text Input
   - Text Area
   - Select/Dropdown
   - Radio Buttons
   - Checkboxes
   - Date/Time Pickers
   - File Upload
   - Phone Number Input
   - Rating
   - Signature
   - Payment Fields

2. **Layout Components**

   - Sections
   - Columns
   - Dividers
   - Spacers
   - Rich Text
   - Images

3. **Advanced Features**
   - Conditional Logic
   - Field Dependencies
   - Custom Validation
   - Calculations
   - Hidden Fields

### Form Versioning

- Each form has multiple versions
- Versions are tracked in `CraftVersion` model
- Published versions are immutable
- Draft versions can be edited
- Version history is maintained

## Form Rendering

### Runtime Engine

- Dynamic form rendering based on JSON configuration
- Real-time validation
- Conditional rendering
- Mobile-responsive design
- Accessibility compliance

### Themes and Styling

- Custom theme support
- Brand color integration
- Typography customization
- Responsive breakpoints
- CSS customization
- Dark/Light mode support

## Data Collection

### Submission Processing

1. **Validation**

   - Client-side validation
   - Server-side validation
   - Custom validation rules
   - File type restrictions
   - Size limits

2. **Storage**

   - JSON data structure
   - File storage in S3
   - Version tracking
   - Submission metadata

3. **Security**
   - CSRF protection
   - Rate limiting
   - Data encryption
   - Access control

### File Handling

1. **Upload Features**

   - Multi-file upload
   - Progress tracking
   - File type validation
   - Size restrictions
   - Image preview

2. **Storage**
   - AWS S3 integration
   - Temporary storage
   - Cleanup procedures
   - Access control

## Integrations

### Webhook Integration

```typescript
interface WebhookConfig {
  url: string;
  secret: string;
  retryPolicy: {
    maxAttempts: number;
    backoffStrategy: "linear" | "exponential";
  };
}
```

- Real-time data forwarding
- Signature verification
- Retry mechanism
- Error handling

### Email Integration

```typescript
interface EmailConfig {
  recipients: string[];
  template: string;
  attachments: boolean;
  customization: {
    subject: string;
    body: string;
  };
}
```

- Email confirmation
- Template support
- Attachment handling
- HTML/Plain text support

### Google Sheets Integration

```typescript
interface SheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  columnMapping: Record<string, string>;
  appendStrategy: "new_row" | "update_existing";
}
```

- OAuth2 authentication
- Column mapping
- Auto-append rows
- Error handling

## Payment Processing

### Stripe Integration

1. **Payment Methods**

   - Credit Cards
   - ACH
   - Digital Wallets

2. **Features**

   - One-time payments
   - Subscriptions
   - Usage-based billing
   - Invoicing

3. **Security**
   - PCI compliance
   - 3D Secure
   - Fraud prevention

## Background Processing

### Message Queue System

1. **RabbitMQ Integration**

   - Queue management
   - Message persistence
   - Dead letter queues
   - Priority queues

2. **Workers**

   - Webhook processing
   - Email sending
   - Sheets updates
   - File processing

3. **Error Handling**
   - Retry mechanisms
   - Error logging
   - Alerting
   - Recovery procedures

## Analytics and Reporting

### Submission Analytics

- Submission counts
- Completion rates
- Drop-off analysis
- Error tracking

### Performance Metrics

- Response times
- Error rates
- Integration success rates
- Resource usage

## Security Features

### Authentication

- Clerk integration
- Role-based access
- Session management
- 2FA support

### Authorization

- Resource-level permissions
- Organization-based access
- API key management
- Scope-based access

### Data Protection

- Field-level encryption
- Data retention policies
- Backup procedures
- GDPR compliance
