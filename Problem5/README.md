# Task Management REST API

A production-ready RESTful API built with Express.js, TypeScript, and SQLite. This API provides comprehensive CRUD operations for task management with enterprise-grade features including validation, error handling, logging, rate limiting, and automated testing.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue)](https://www.sqlite.org/)

## Features

### Core Functionality
**Full CRUD Operations** - Create, Read, Update, Delete tasks
**Advanced Filtering** - Filter by status, priority, search terms
**Pagination Support** - Efficient data retrieval with limit/offset
**Data Persistence** - SQLite database with optimized indexes

### Enterprise Features
**Security** - Helmet.js, CORS, rate limiting
**Validation** - Comprehensive input validation with express-validator
**Logging** - Winston logger with file and console transports
**Testing** - Jest + Supertest with coverage reporting
**Type Safety** - Full TypeScript implementation
**Clean Architecture** - Repository pattern, service layer, controllers
**Error Handling** - Custom error classes with proper HTTP status codes
**Graceful Shutdown** - Proper cleanup on process termination
**Compression** - Response compression for better performance
**Code Quality** - ESLint + Prettier configuration

## Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd express-crud-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables** (optional):
```env
PORT=3000
NODE_ENV=development
DB_FILENAME=./database.sqlite
CORS_ORIGIN=*
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the server with hot-reload using nodemon.

### Production Mode
```bash
# Build the project
npm run build

# Start the server
npm start
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run typecheck
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null,
  "error": string (only in development mode)
}
```

### Endpoints

#### 1. **Create Task**
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high"
}
```

**Validation Rules:**
- `title` (required): 1-255 characters
- `description` (optional): max 1000 characters
- `status` (optional): `pending` | `in_progress` | `completed`
- `priority` (optional): `low` | `medium` | `high`

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "created_at": "2024-01-06T10:30:00.000Z",
    "updated_at": "2024-01-06T10:30:00.000Z"
  }
}
```

---

#### 2. **List Tasks (with Pagination & Filters)**
```http
GET /api/tasks
```

**Query Parameters:**
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `search` (optional): Search in title and description
- `limit` (optional, default: 10, max: 100): Number of results
- `offset` (optional, default: 0): Pagination offset

**Examples:**
```bash
# Get all tasks (first 10)
GET /api/tasks

# Get pending tasks
GET /api/tasks?status=pending

# Get high priority tasks in progress
GET /api/tasks?priority=high&status=in_progress

# Search tasks
GET /api/tasks?search=documentation

# Pagination
GET /api/tasks?limit=20&offset=40
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation",
        "status": "pending",
        "priority": "high",
        "created_at": "2024-01-06T10:30:00.000Z",
        "updated_at": "2024-01-06T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

#### 3. **Get Task by ID**
```http
GET /api/tasks/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "created_at": "2024-01-06T10:30:00.000Z",
    "updated_at": "2024-01-06T10:30:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Task with ID 999 not found"
}
```

---

#### 4. **Update Task**
```http
PUT /api/tasks/:id
PATCH /api/tasks/:id
```

**Request Body** (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "priority": "medium",
    "created_at": "2024-01-06T10:30:00.000Z",
    "updated_at": "2024-01-06T11:00:00.000Z"
  }
}
```

---

#### 5. **Delete Task**
```http
DELETE /api/tasks/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

#### 6. **Health Check**
```http
GET /health
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-06T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

---

#### 7. **API Information**
```http
GET /api
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Task Management API",
  "version": "1.0.0",
  "endpoints": {
    "tasks": {
      "create": "POST /api/tasks",
      "list": "GET /api/tasks",
      "get": "GET /api/tasks/:id",
      "update": "PUT /api/tasks/:id",
      "delete": "DELETE /api/tasks/:id"
    }
  }
}
```

## Testing Examples with cURL

### Create a task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing the API",
    "priority": "high",
    "status": "pending"
  }'
```

### Get all tasks
```bash
curl http://localhost:3000/api/tasks
```

### Get tasks with filters
```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high&limit=5"
```

### Get a specific task
```bash
curl http://localhost:3000/api/tasks/1
```

### Update a task
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "description": "Updated description"
  }'
```

### Delete a task
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Project Structure

```
express-crud-api/
├── src/
│   ├── __tests__/              # Test files
│   │   └── task.test.ts
│   ├── config/                 # Configuration
│   │   └── index.ts
│   ├── controllers/            # Request handlers
│   │   └── taskController.ts
│   ├── middlewares/            # Express middlewares
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── repositories/           # Data access layer
│   │   └── TaskRepository.ts
│   ├── routes/                 # Route definitions
│   │   └── taskRoutes.ts
│   ├── services/               # Business logic
│   │   └── taskService.ts
│   ├── utils/                  # Utility functions
│   │   ├── AppError.ts
│   │   ├── asyncHandler.ts
│   │   └── logger.ts
│   ├── validators/             # Input validation
│   │   └── taskValidator.ts
│   ├── database.ts             # Database configuration
│   ├── types.ts                # TypeScript type definitions
│   └── server.ts               # Application entry point
├── logs/                       # Log files (auto-generated)
├── dist/                       # Compiled JavaScript (auto-generated)
├── coverage/                   # Test coverage reports (auto-generated)
├── .env                        # Environment variables
├── .env.example                # Environment template
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .gitignore
├── jest.config.js              # Jest configuration
├── nodemon.json                # Nodemon configuration
├── package.json
├── tsconfig.json               # TypeScript configuration
└── README.md
```

## Security Features

- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents abuse (100 requests per 15 minutes per IP)
- **Input Validation** - Comprehensive validation with express-validator
- **SQL Injection Protection** - Parameterized queries
- **Error Sanitization** - Detailed errors only in development mode

## Error Handling

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server errors

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)",
  "stack": "Stack trace (development only)"
}
```

## Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK(length(title) > 0),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK(status IN ('pending', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' 
    CHECK(priority IN ('low', 'medium', 'high')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

## Architecture Patterns

### Repository Pattern
Separates data access logic from business logic.

### Service Layer
Contains business logic and orchestrates operations.

### Dependency Injection
Uses constructor injection for better testability.

### Error Handling Strategy
- Custom error classes extending base AppError
- Centralized error handling middleware
- Operational vs programming error distinction

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error level logs
- `combined.log` - All logs

Log format includes:
- Timestamp
- Log level
- Message
- Request metadata (method, URL, status, duration)

## Development Workflow

1. **Make changes** to source files in `src/`
2. **Run tests** with `npm test`
3. **Check code quality** with `npm run lint`
4. **Format code** with `npm run format`
5. **Build** with `npm run build`
6. **Deploy** the `dist/` folder to production

## Production Deployment

1. Set environment variables:
```bash
NODE_ENV=production
PORT=3000
DB_FILENAME=/path/to/production.sqlite
CORS_ORIGIN=https://yourdomain.com
```

2. Build and start:
```bash
npm run build
npm start
```

3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start dist/server.js --name task-api
```

## Test Coverage

Run tests with coverage:
```bash
npm test
```

Coverage reports are generated in the `coverage/` directory.

## Best Practices Implemented

**TypeScript Strict Mode** - Maximum type safety
**Async/Await** - Modern asynchronous code
**Error Handling** - Try-catch with custom errors
**Input Validation** - Validate all user inputs
**Logging** - Comprehensive logging with Winston
**Testing** - Unit and integration tests
**Code Quality** - ESLint + Prettier
 **Security** - Multiple security layers
 **Documentation** - Comprehensive README and code comments
**Graceful Shutdown** - Clean process termination

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## Troubleshooting

### Database Locked Error
If you get "database is locked" error, ensure only one instance of the app is running.

### Port Already in Use
Change the PORT in `.env` file or kill the process using the port:
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 <PID>
```

### Module Not Found
Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with using TypeScript, Express.js, and SQLite**