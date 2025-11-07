# Avito Clone API Documentation

Base URL: `http://localhost:3001`

## Authentication

All endpoints (except auth endpoints) require JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGc...
```

## Auth Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Login User
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:** `200 OK`
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

## Categories Endpoints

### Get All Categories
- **GET** `/categories`
- **Query Parameters:** None
- **Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "slug": "cars",
    "name": "Cars",
    "description": "Buy and sell cars",
    "children": [
      {
        "id": "uuid",
        "slug": "cars-sedans",
        "name": "Sedans"
      }
    ]
  }
]
```

### Get Categories Tree
- **GET** `/categories/tree`
- **Response:** `200 OK` (same structure as above)

### Get Category by ID
- **GET** `/categories/:id`
- **Response:** `200 OK`
```json
{
  "id": "uuid",
  "slug": "cars",
  "name": "Cars",
  "description": "Buy and sell cars",
  "customFields": [
    {
      "name": "engineVolume",
      "type": "number",
      "required": true
    }
  ]
}
```

### Get Category by Slug
- **GET** `/categories/slug/:slug`
- **Response:** `200 OK` (same as Get by ID)

### Create Category
- **POST** `/categories`
- **Auth:** Admin only
- **Body:**
```json
{
  "slug": "cars",
  "name": "Cars",
  "description": "Buy and sell cars",
  "iconUrl": "https://example.com/icon.png",
  "parentId": "uuid-of-parent-category",
  "displayOrder": 1,
  "customFields": [
    {
      "name": "engineVolume",
      "type": "number",
      "required": true
    }
  ]
}
```
- **Response:** `201 Created`

### Update Category
- **PATCH** `/categories/:id`
- **Auth:** Admin only
- **Body:** (same fields as Create, all optional)
- **Response:** `200 OK`

### Delete Category
- **DELETE** `/categories/:id`
- **Auth:** Admin only
- **Response:** `200 OK`

## Listings Endpoints

### Search Listings
- **GET** `/listings/search`
- **Query Parameters:**
  - `query` (string): Search text
  - `categoryId` (uuid): Filter by category
  - `region` (string): Filter by region
  - `city` (string): Filter by city
  - `minPrice` (number): Minimum price
  - `maxPrice` (number): Maximum price
  - `status` (string): Filter by status (active, pending, etc.)
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 20)
  - `sortBy` (string): Sort by field (createdAt, price, views)
  - `sortOrder` (string): ASC or DESC (default: DESC)

- **Response:** `200 OK`
```json
{
  "listings": [
    {
      "id": "uuid",
      "title": "Listing Title",
      "description": "Description",
      "price": 10000,
      "region": "Moscow",
      "city": "Moscow",
      "status": "active",
      "views": 150,
      "responses": 5,
      "images": [
        {
          "id": "uuid",
          "url": "/uploads/listings/xxx/image.jpg",
          "displayOrder": 0
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Create Listing
- **POST** `/listings`
- **Auth:** Required
- **Content-Type:** multipart/form-data
- **Body:**
```json
{
  "title": "Listing Title",
  "description": "Listing description",
  "categoryId": "uuid",
  "price": 10000,
  "pricePerUnit": "per item",
  "region": "Moscow",
  "city": "Moscow",
  "latitude": 55.7558,
  "longitude": 37.6173,
  "customData": {
    "engineVolume": "2.0",
    "mileage": "50000 km"
  },
  "expiresAt": "2024-02-01T00:00:00Z"
}
```
- **Files:** `images` (up to 10 files)
- **Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "Listing Title",
  "status": "pending",
  "images": []
}
```

### Get Listing Details
- **GET** `/listings/:id`
- **Response:** `200 OK` (listing object with incremented views)

### Get My Listings
- **GET** `/listings/my-listings`
- **Auth:** Required
- **Query Parameters:**
  - `status` (string): Filter by status
- **Response:** `200 OK` (array of listings)

### Get Pending Listings
- **GET** `/listings/pending`
- **Auth:** Moderator/Admin
- **Query Parameters:**
  - `page` (number): Default 1
  - `limit` (number): Default 20
- **Response:** `200 OK`
```json
{
  "listings": [],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### Update Listing
- **PATCH** `/listings/:id`
- **Auth:** Required (owner only)
- **Body:** (partial listing fields)
- **Response:** `200 OK`

### Update Listing Status
- **PATCH** `/listings/:id/status`
- **Auth:** Moderator/Admin
- **Body:**
```json
{
  "status": "active",
  "rejectionReason": "Optional rejection reason"
}
```
- **Response:** `200 OK`

### Delete Listing
- **DELETE** `/listings/:id`
- **Auth:** Required (owner only)
- **Response:** `200 OK`
```json
{
  "message": "Listing deleted successfully"
}
```

## Messages Endpoints

### Send Message
- **POST** `/messages`
- **Auth:** Required
- **Body:**
```json
{
  "text": "Message text",
  "recipientId": "uuid",
  "listingId": "uuid (optional)"
}
```
- **Response:** `201 Created`
```json
{
  "id": "uuid",
  "text": "Message text",
  "senderId": "uuid",
  "recipientId": "uuid",
  "status": "sent",
  "isRead": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get Conversations
- **GET** `/messages/conversations`
- **Auth:** Required
- **Response:** `200 OK`
```json
[
  {
    "userId": "uuid",
    "lastMessageAt": "2024-01-01T00:00:00Z",
    "unreadCount": 3
  }
]
```

### Get Conversation with User
- **GET** `/messages/conversation/:userId`
- **Auth:** Required
- **Query Parameters:**
  - `page` (number): Default 1
  - `limit` (number): Default 20
- **Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": "uuid",
      "text": "Message text",
      "senderId": "uuid",
      "recipientId": "uuid",
      "status": "delivered",
      "isRead": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### Mark Message as Read
- **POST** `/messages/:messageId/read`
- **Auth:** Required
- **Response:** `200 OK`

### Mark Conversation as Read
- **POST** `/messages/conversation/:userId/read`
- **Auth:** Required
- **Response:** `200 OK`
```json
{
  "message": "Conversation marked as read"
}
```

### Get Unread Count
- **GET** `/messages/unread-count`
- **Auth:** Required
- **Response:** `200 OK`
```json
{
  "count": 5
}
```

## Telegram Endpoints

### Handle Telegram Webhook
- **POST** `/telegram/webhook`
- **Body:** (Telegram update object)
- **Response:** `200 OK`
```json
{
  "ok": true
}
```

## Response Codes

- **200 OK** - Successful request
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server error

## Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Rate Limiting

Rate limits are applied per IP address:
- 100 requests per 15 minutes for most endpoints
- 10 requests per 15 minutes for auth endpoints

Rate limit info is included in response headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Pagination

Responses with multiple items use the following pagination format:

```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

## Sorting

Use `sortBy` and `sortOrder` query parameters:

```
GET /listings/search?sortBy=price&sortOrder=ASC
```

Available sort fields vary by endpoint. Check specific endpoint documentation.

## Date Format

All dates are in ISO 8601 format:
```
2024-01-01T00:00:00Z
```

## Filters

Multiple filters can be combined:

```
GET /listings/search?query=car&region=Moscow&minPrice=100000&maxPrice=500000
```

## Webhooks

Event webhooks can be configured to POST to external URLs when certain events occur:

- `listing.created`
- `listing.updated`
- `listing.deleted`
- `message.sent`
- `user.registered`

See INTEGRATION_GUIDE.md for webhook configuration.
