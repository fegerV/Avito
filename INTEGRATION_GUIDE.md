# Integration Guide

This document covers integrations with Telegram, n8n, and other services for the Avito Clone platform.

## Telegram Bot Integration

### Setup

1. **Create a Telegram Bot**
   - Talk to [@BotFather](https://t.me/botfather) on Telegram
   - Create a new bot and get your bot token
   - Set the webhook URL to your backend: `https://your-domain/telegram/webhook`

2. **Configure Backend**
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_API_URL=https://api.telegram.org
   ```

3. **Features**
   - Notifications for new listings
   - Alerts for new messages
   - Listing management via Telegram commands
   - Direct payment notifications

### Telegram Bot Commands

```
/start          - Start the bot and link your account
/listings       - View your active listings
/new_listing    - Create a new listing
/messages       - Check unread messages
/settings       - Configure notification preferences
```

### API Endpoints

**POST /telegram/webhook**
- Receives updates from Telegram
- Automatically processes commands and messages

**POST /auth/telegram**
- Links Telegram account to user account

## n8n Integration

### Setup

1. **Install n8n**
   ```bash
   npm install -g n8n
   n8n
   ```

2. **Connect to API**
   - Backend base URL: `http://localhost:3001`
   - Use JWT authentication with `Bearer token`

### Workflow Examples

#### Example 1: New Listing to Telegram Channel

When a new listing is created:
1. Trigger: HTTP POST `/listings` (webhook)
2. Filter by status: ACTIVE
3. Format message with listing details
4. Send to Telegram channel: `/telegram/webhook`

#### Example 2: Auto-approval Based on Rules

Moderate listings based on rules:
1. Trigger: Listing created with status PENDING
2. Check listing content:
   - No prohibited keywords
   - Price within reasonable range
   - Images uploaded
3. Auto-approve: PATCH `/listings/{id}/status` with `status: ACTIVE`

#### Example 3: User Notifications

Send email/Telegram notifications:
1. Trigger: New message received
2. Get user preferences from `/users/{id}`
3. If `notificationsTelegram`: Send via Telegram
4. If `notificationsEmail`: Send via email service

### n8n Nodes Configuration

**HTTP Request Node**
```json
{
  "authentication": "Header (Query/Body Params)",
  "method": "POST",
  "url": "http://localhost:3001/listings/search",
  "sendHeaders": true,
  "headerParameters": [
    {
      "name": "Authorization",
      "value": "Bearer {{env.JWT_TOKEN}}"
    }
  ]
}
```

**Webhook Trigger Node**
```json
{
  "path": "/webhook/listings",
  "method": "POST",
  "responseMode": "onReceived"
}
```

## Webhook Events

The backend emits events that can be consumed by external services:

### Listing Events

**listing.created**
```json
{
  "event": "listing.created",
  "data": {
    "id": "uuid",
    "title": "string",
    "userId": "uuid",
    "status": "pending",
    "price": 10000
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**listing.updated**
```json
{
  "event": "listing.updated",
  "data": {
    "id": "uuid",
    "status": "active"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Message Events

**message.sent**
```json
{
  "event": "message.sent",
  "data": {
    "id": "uuid",
    "senderId": "uuid",
    "recipientId": "uuid",
    "text": "message text"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### User Events

**user.registered**
```json
{
  "event": "user.registered",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## REST API Authentication

All API calls require JWT authentication:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/listings
```

Get JWT token by logging in:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Service Integration Examples

### Example 1: Slack Notifications

1. Create Slack webhook URL from Slack API
2. In n8n, create workflow:
   - Trigger: POST `/webhook/listings`
   - HTTP Request: POST to Slack webhook with message

### Example 2: Email Notifications

1. Configure email provider (SendGrid, Mailgun, etc.)
2. In n8n:
   - Trigger: `/webhook/messages`
   - Send Email node with template

### Example 3: CRM Sync

1. Setup webhook to CRM (Salesforce, HubSpot)
2. In n8n:
   - Trigger: New user registration
   - Transform data to CRM format
   - HTTP Request: POST to CRM API

## Best Practices

1. **Security**
   - Always use HTTPS in production
   - Validate webhook signatures
   - Rotate API tokens regularly
   - Use environment variables for secrets

2. **Reliability**
   - Implement retry logic with exponential backoff
   - Log all webhook events
   - Monitor webhook delivery status
   - Use message queuing for async tasks

3. **Performance**
   - Cache frequently accessed data
   - Use pagination for large datasets
   - Limit webhook payload size
   - Process events asynchronously

4. **Testing**
   - Test webhooks locally with ngrok
   - Use n8n testing interface
   - Monitor logs in production

## Troubleshooting

### Telegram Bot Not Responding
- Check bot token is correct
- Verify webhook URL is accessible
- Check firewall/network settings
- Look at bot logs in `telegram.service.ts`

### n8n Workflows Not Triggering
- Verify webhook URL in trigger node
- Check n8n is running and reachable
- Review n8n execution logs
- Test webhook manually with curl

### Webhook Events Not Being Sent
- Check event listeners in controllers
- Verify webhook endpoint configuration
- Check API logs for errors
- Ensure database transactions are committed

## Additional Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [n8n Documentation](https://docs.n8n.io/)
- [REST API Documentation](./API.md)
