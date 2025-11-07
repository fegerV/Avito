# Development Guide

## Project Structure

```
avito-clone/
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── auth/                     # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── categories/               # Categories management
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── categories.module.ts
│   │   │   └── dto/
│   │   │       ├── create-category.dto.ts
│   │   │       └── update-category.dto.ts
│   │   ├── listings/                 # Listings management
│   │   │   ├── listings.controller.ts
│   │   │   ├── listings.service.ts
│   │   │   ├── listings.module.ts
│   │   │   └── dto/
│   │   │       ├── create-listing.dto.ts
│   │   │       ├── update-listing.dto.ts
│   │   │       └── search-listings.dto.ts
│   │   ├── messages/                 # Messaging system
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── messages.module.ts
│   │   │   └── dto/
│   │   │       └── create-message.dto.ts
│   │   ├── telegram/                 # Telegram integration
│   │   │   ├── telegram.controller.ts
│   │   │   ├── telegram.service.ts
│   │   │   └── telegram.module.ts
│   │   ├── database/
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── category.entity.ts
│   │   │   │   ├── listing.entity.ts
│   │   │   │   ├── listing-image.entity.ts
│   │   │   │   ├── message.entity.ts
│   │   │   │   ├── review.entity.ts
│   │   │   │   └── moderation-report.entity.ts
│   │   │   └── migrations/
│   │   │       └── 1.InitialSchema.ts
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   └── decorators/
│   │   │       ├── roles.decorator.ts
│   │   │       └── current-user.decorator.ts
│   │   ├── config/
│   │   │   └── config.service.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   ├── .prettierrc
│   └── Dockerfile
│
├── frontend/                         # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── globals.css
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── create-listing/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── components/               # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ListingCard.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── lib/
│   │   │   └── api.ts                # API client
│   │   ├── store/
│   │   │   └── auth.ts               # Zustand auth store
│   │   └── types/
│   │       └── index.ts              # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── Dockerfile
│
├── docker-compose.yml                # Docker Compose configuration
├── .gitignore
├── README.md                         # Main documentation
├── API.md                            # API documentation
├── INTEGRATION_GUIDE.md              # Integration documentation
└── DEVELOPMENT.md                    # This file
```

## Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (optional)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd avito-clone
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Setup environment variables
```bash
# Backend
cd backend
cp .env.example .env
```

4. Start services with Docker Compose
```bash
docker-compose up
```

Or start manually:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Development Workflow

### Adding a New Feature

1. **Create a new module** (if needed)
```bash
# Backend example
nest g module myfeature
nest g controller myfeature
nest g service myfeature
```

2. **Define entities** in `database/entities/`

3. **Create DTOs** in module's `dto/` folder

4. **Implement service** with business logic

5. **Implement controller** with endpoints

6. **Create tests**

7. **Update documentation** (API.md, INTEGRATION_GUIDE.md)

### Backend Development

#### Running Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

#### Adding a New Entity

1. Create entity file: `src/database/entities/myentity.entity.ts`
2. Export from a barrel file (optional)
3. Add to TypeOrmModule in module file
4. Generate migration: `npm run migration:generate`
5. Run migration: `npm run migration:run`

#### Creating a Service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyEntity } from '@/database/entities/my-entity.entity';

@Injectable()
export class MyService {
  constructor(
    @InjectRepository(MyEntity)
    private repository: Repository<MyEntity>,
  ) {}

  async findAll() {
    return this.repository.find();
  }
}
```

#### Creating a Controller

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MyService } from './my.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('my-endpoint')
export class MyController {
  constructor(private readonly service: MyService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreateMyDto) {
    return this.service.create(createDto);
  }
}
```

### Frontend Development

#### Creating a Page

1. Create directory in `src/app/my-page/`
2. Create `page.tsx` file
3. Use `'use client'` directive for interactive pages
4. Import components and hooks

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function MyPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Page content */}
    </main>
  );
}
```

#### Creating a Component

```typescript
'use client';

import React from 'react';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
```

#### Using Zustand Store

```typescript
import { useAuth } from '@/store/auth';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Testing

### Backend

```bash
cd backend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Frontend

Create `__tests__` folder alongside component/page

```typescript
// Example: src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Debugging

### Backend

1. Add debugger statement in code
2. Run with debug flag:
```bash
npm run start:debug
```
3. Chrome DevTools: `chrome://inspect`

### Frontend

1. Use browser DevTools (F12)
2. Or use VS Code debugger with Next.js extension

## Code Style

### Formatting

```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Type Checking

```bash
# Frontend
cd frontend
npm run type-check
```

## Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check DB_* env variables
- Verify user has database creation permissions

### Port Already in Use
- Change PORT in .env
- Or kill process using port: `lsof -i :PORT` then `kill -9 PID`

### Module Not Found
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist .next`

### CORS Issues
- Check CORS_ORIGIN in backend .env
- Ensure frontend makes requests to correct API URL

## Performance Optimization

### Backend

1. Use database indexes
2. Implement caching with Redis
3. Use pagination for large datasets
4. Add query limits and timeouts

### Frontend

1. Lazy load images
2. Code splitting with dynamic imports
3. Optimize bundle size
4. Cache API responses

## Security

1. Never commit `.env` files
2. Use environment variables for secrets
3. Validate all user inputs
4. Use HTTPS in production
5. Implement rate limiting
6. Use CORS properly
7. Hash passwords with bcrypt
8. Use JWT with expiration

## Deployment

See deployment guide (to be created) for:
- Docker deployment
- Kubernetes setup
- CI/CD pipeline
- Environment configuration

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following code style
3. Add tests
4. Update documentation
5. Commit: `git commit -m "Add my feature"`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
