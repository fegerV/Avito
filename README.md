# Avito Clone - MVP

A comprehensive classifieds marketplace platform with support for multiple types of listings, user roles, chat functionality, and Telegram integration.

## Features (MVP)

### Core Features
- **Multi-category listings system** with hierarchical categories
- **Listing management** - create, edit, delete, and search listings
- **User authentication** - registration and login with JWT
- **User profiles** - manage listings and preferences
- **Built-in messaging** - chat between users
- **Moderation system** - pending listings review
- **Admin panel** - category and user management
- **Responsive design** - works on desktop and mobile

### Technical Stack
- **Backend**: NestJS + TypeScript
- **Frontend**: Next.js + React + TypeScript
- **Database**: PostgreSQL
- **Caching**: Redis
- **Styling**: Tailwind CSS
- **Docker**: Full containerization support

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis (or use Docker)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd avito-clone
```

2. **Copy environment files**
```bash
cp backend/.env.example backend/.env
```

3. **Start with Docker Compose**
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Local Development

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

Backend will run on http://localhost:3001

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## Project Structure

```
avito-clone/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── categories/     # Categories management
│   │   ├── listings/       # Listings management
│   │   ├── messages/       # Messaging system
│   │   ├── database/
│   │   │   ├── entities/   # TypeORM entities
│   │   │   └── migrations/ # Database migrations
│   │   ├── common/
│   │   │   ├── guards/     # Auth guards
│   │   │   └── decorators/ # Custom decorators
│   │   └── main.ts
│   ├── package.json
│   └── Dockerfile
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # App pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities (API client, etc)
│   │   ├── store/          # Zustand stores
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## API Documentation

### Authentication Endpoints

**POST /auth/register**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**POST /auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Listings Endpoints

**GET /listings/search?query=&region=&city=&minPrice=&maxPrice=**
Search listings with filters

**POST /listings**
Create a new listing (requires authentication)

**GET /listings/:id**
Get listing details

**PATCH /listings/:id**
Update listing (owner only)

**DELETE /listings/:id**
Delete listing (owner only)

### Categories Endpoints

**GET /categories**
Get all categories

**GET /categories/tree**
Get categories tree structure

**POST /categories**
Create new category (admin only)

### Messages Endpoints

**POST /messages**
Send a message

**GET /messages/conversations**
Get user conversations

**GET /messages/conversation/:userId**
Get conversation with specific user

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=avito_clone

JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

REDIS_HOST=localhost
REDIS_PORT=6379

FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development Commands

### Backend
```bash
cd backend

# Development with hot reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Features in Development

### Phase 1 (MVP - Current)
- ✅ User authentication
- ✅ Listing creation and management
- ✅ Category system
- ✅ Basic search and filtering
- ✅ Messaging system
- ✅ Admin panel basics
- 🚧 File upload system

### Phase 2 (v1.0)
- Payment integration (Stripe, PayPal, etc)
- Advanced moderation system
- Analytics dashboard
- PWA support
- Email notifications
- SMS notifications

### Phase 3 (v2.0)
- Telegram Mini App
- Telegram bot integration
- n8n automation support
- AI-powered listing recommendations
- Advanced search with Elasticsearch
- Mobile app (React Native/Flutter)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT

## Support

For issues and feature requests, please use the GitHub Issues page.
