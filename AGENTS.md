# AGENTS.md

Guidelines for agentic coding agents working in this NestJS/TypeScript repository.

## Build/Lint/Test Commands

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Debug mode with watch

# Building
npm run build              # Build for production
npm run start:prod         # Run production build

# Linting & Formatting
npm run lint               # Run ESLint with auto-fix
npm run format             # Format with Prettier

# Testing
npm test                   # Run all unit tests
npm test -- path/to/file.spec.ts    # Run single test file
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run with coverage
npm run test:e2e           # Run end-to-end tests
npx jest --testNamePattern="test name"  # Run specific test
```

## Code Style Guidelines

### Imports

- Use **single quotes** for all strings
- Group imports in this order:
  1. NestJS core modules (@nestjs/\*)
  2. Third-party libraries
  3. Internal modules using `src/` absolute paths
- Add blank line between import groups

### Formatting

- **Single quotes** enforced
- **Trailing commas** in all multi-line structures
- 2-space indentation
- Run `npm run format` before committing

### Naming Conventions

- **Files**: kebab-case (e.g., `users.controller.ts`, `create-user.dto.ts`)
- **Classes**: PascalCase with suffix:
  - Controllers: `UsersController`
  - Services: `UsersService`
  - Modules: `UsersModule`
  - Entities: `Users` (often singular names like `Users`, `Company`)
  - DTOs: `CreateUserDto`, `UpdateUserDto`
- **Database columns**: snake_case (e.g., `user_id`, `company_id`, `created_at`)
- **Variables/functions**: camelCase
- **Enums**: PascalCase for name, UPPER_CASE for values in `src/common/enum/`

### TypeScript

- Target: ES2021
- Decorators enabled (`emitDecoratorMetadata`, `experimentalDecorators`)
- Strict null checks are **disabled** (be careful with null safety)
- Prefer explicit types on public methods

### Architecture Patterns

#### Module Structure

Each feature module follows this structure:

```
feature-name/
├── feature.controller.ts      # HTTP route handlers
├── feature.service.ts         # Business logic
├── feature.module.ts          # Module definition
├── dto/
│   ├── create-feature.dto.ts  # Validation with class-validator
│   └── update-feature.dto.ts
└── entities/
    └── feature.entity.ts      # TypeORM entities
```

#### Key Directories

- `src/core/` - Authentication, users, companies, billing
- `src/business/` - Business logic: sales, inventory, payments, POS
- `src/common/` - Shared utilities: decorators, filters, guards, enums, utils
- `src/ai/` - AI-related features
- `src/analytics/` - Analytics features
- `src/integrations/` - Third-party integrations

### DTOs & Validation

- Use `class-validator` decorators: `@IsString()`, `@IsNotEmpty()`, `@MinLength()`, `@MaxLength()`, `@IsEnum()`
- DTOs in `dto/` folder with `create-` and `update-` prefixes
- Apply validation pipe globally with `whitelist: true` and `forbidNonWhitelisted: true`

### Entities (TypeORM)

- Use `@Entity()` decorator
- Primary keys: `@PrimaryColumn()` or `@PrimaryGeneratedColumn()`
- Relations: `@ManyToOne()`, `@OneToMany()`, `@OneToOne()`
- Column names in snake_case
- Entity names often singular despite table names (e.g., `Users` entity class)

### Error Handling

- Global exception filter: `AllExceptionsFilter` in `src/common/filters/`
- Returns standardized error response with statusCode, timestamp, path, message
- Use NestJS built-in exceptions: `BadRequestException`, `NotFoundException`, etc.

### Authentication & Authorization

- Custom `@Auth(UserRole.ROLE)` decorator for role-based access
- Roles: `OWNER`, `MANAGER`, `EMPLOYEE`
- Guards: `AuthGuard`, `RolesGuard`

### Testing Patterns

- Unit tests: `*.spec.ts` files alongside source files (not currently present)
- E2E tests: `test/*.e2e-spec.ts`
- Use `@nestjs/testing` Test.createTestingModule()
- Test utilities: supertest for HTTP assertions

## Key Conventions

1. **API Prefix**: All routes prefixed with `api/v1` (set in main.ts)
2. **Environment**: Use `.env` file with `dotenv`
3. **Database**: TypeORM with PostgreSQL (can also use MSSQL)
4. **CUID2**: Use `@paralleldrive/cuid2` for generating IDs
5. **Password hashing**: Use `bcryptjs`
6. **Validation**: Always validate DTOs at controller level

## Running a Single Test

```bash
# Method 1: Direct Jest
npx jest src/path/to/file.spec.ts

# Method 2: Via npm
npm test -- src/path/to/file.spec.ts

# Method 3: Pattern matching
npx jest --testPathPattern="users"

# Method 4: Specific test name
npx jest --testNamePattern="should create user"
```
